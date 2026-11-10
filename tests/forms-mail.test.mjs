import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import nodemailer from 'nodemailer';
import { openStore, saveSubmission } from '../lib/forms/store.mjs';
import { validate } from '../lib/forms/schema.mjs';
import { migrateOutbox, enqueueMail, claimMail, deliverOne, mailMessage, MAIL_FROM } from '../lib/forms/outbox.mjs';
import { smtpConfig, runMailCommand } from '../lib/forms/mail-worker.mjs';
const root = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), 'hct-mail-synthetic-'));
fs.chmodSync(root, 0o700);
let seq = 0;
const queueEnv = { HCT_FORM_MAIL_QUEUE_ENABLED: 'true', HCT_MAIL_OWNER: 'owner@example.invalid' };
function store(migrate = true) {
  const directory = path.join(root, String(++seq)); fs.mkdirSync(directory, { mode: 0o700 });
  const { db } = openStore({ directory, initialize: true });
  if (migrate) migrateOutbox(db);
  db.close(); return directory;
}
function input(extra = {}) { return validate({ form: 'community', name: 'Synthetic Private Name', email: 'sender@example.invalid', cityZip: '', involvement: [], about: 'SENSITIVE TEST TEXT', website: '', newsletterConsent: false, requestId: randomUUID(), ...extra }); }
function save(directory, value = input()) {
  Object.assign(process.env, queueEnv);
  try { saveSubmission(value, { directory }); }
  finally { delete process.env.HCT_FORM_MAIL_QUEUE_ENABLED; delete process.env.HCT_MAIL_OWNER; }
}
function rows(directory) { const { db } = openStore({ directory }); try { return db.prepare('SELECT * FROM mail_outbox ORDER BY audience').all(); } finally { db.close(); } }
const smtpEnv = { HCT_MAIL_DELIVERY_ENABLED: 'true', HCT_MAIL_OWNER: 'owner@example.invalid', HCT_SMTP_HOST: 'smtp.example.invalid', HCT_SMTP_PORT: '587', HCT_SMTP_USER: 'synthetic', HCT_SMTP_PASSWORD: 'synthetic-not-a-credential' };
test.after(() => fs.rmSync(root, { recursive: true, force: true }));
test('migration preserves old submissions, is idempotent, and never backfills mail', () => {
  const directory = store(false); saveSubmission(input(), { directory });
  const { db } = openStore({ directory });
  const before = db.prepare('SELECT * FROM submissions').all();
  migrateOutbox(db); migrateOutbox(db);
  assert.deepEqual(db.prepare('SELECT * FROM submissions').all(), before);
  assert.equal(db.prepare('SELECT count(*) n FROM mail_outbox').get().n, 0); db.close();
  openStore({ directory }).db.close();
});
test('queue disabled by default; enabled intake and both jobs commit atomically and deduplicate', () => {
  const directory = store(); saveSubmission(input(), { directory }); assert.equal(rows(directory).length, 0);
  const value = input(); save(directory, value); save(directory, value);
  const jobs = rows(directory); assert.equal(jobs.length, 2); assert.equal(jobs[0].submission_id, jobs[1].submission_id);
  assert.equal(jobs[0].recipient, queueEnv.HCT_MAIL_OWNER); assert.equal(jobs[1].recipient, 'sender@example.invalid');
  assert.throws(() => save(directory, { ...value, fields: { ...value.fields, name: 'Changed' } }), e => e.status === 409);
  const { db } = openStore({ directory });
  db.exec("CREATE TRIGGER reject_queue BEFORE INSERT ON mail_outbox BEGIN SELECT RAISE(ABORT,'synthetic failure'); END;"); db.close();
  assert.throws(() => save(directory));
  // Unknown added schema is rejected before writes too; remove trigger to inspect.
  const { DatabaseSync } = process.getBuiltinModule('node:sqlite');
  const raw = new DatabaseSync(path.join(directory, 'submissions.sqlite')); raw.exec('DROP TRIGGER reject_queue');
  assert.equal(raw.prepare('SELECT count(*) n FROM submissions').get().n, 2); raw.close();
});
test('queue failure rolls back submission when migration is absent or owner unconfigured', () => {
  const directory = store(false); assert.throws(() => save(directory));
  const { db } = openStore({ directory }); assert.equal(db.prepare('SELECT count(*) n FROM submissions').get().n, 0); db.close();
  const migrated = store(); process.env.HCT_FORM_MAIL_QUEUE_ENABLED = 'true';
  try { assert.throws(() => saveSubmission(input(), { directory: migrated })); }
  finally { delete process.env.HCT_FORM_MAIL_QUEUE_ENABLED; }
  assert.equal(rows(migrated).length, 0);
});
test('message content excludes all submitted personal fields and does not promise subscription', async () => {
  const directory = store(); save(directory);
  // Nodemailer's stream transport serializes locally without DNS/network access.
  const transport = nodemailer.createTransport({ streamTransport: true, buffer: true });
  for (const job of rows(directory)) {
    const message = mailMessage(job); assert.equal(message.from.address, MAIL_FROM);
    assert.ok(!message.text.includes('SENSITIVE TEST TEXT')); assert.ok(!message.text.includes('Synthetic Private Name'));
    assert.ok(!message.text.includes('sender@example.invalid'));
    const rendered = await transport.sendMail(message);
    assert.match(rendered.message.toString(), /Message-ID: <hct-/);
    assert.equal(rendered.envelope.from, MAIL_FROM); assert.deepEqual(rendered.envelope.to, [job.recipient]);
    if (job.audience === 'submitter') assert.match(message.text, /does not confirm a newsletter subscription/);
  }
});
test('successful delivery is recorded once across reopen and repeated worker runs', async () => {
  const directory = store(); save(directory); let sends = 0;
  const createTransport = () => ({ sendMail: async () => { sends++; return { accepted: ['synthetic@example.invalid'], rejected: [] }; } });
  assert.deepEqual(await runMailCommand('send', { directory, env: smtpEnv, createTransport }), { sent: 2 });
  assert.deepEqual(await runMailCommand('send', { directory, env: smtpEnv, createTransport }), {});
  assert.equal(sends, 2); assert.ok(rows(directory).every(row => row.status === 'sent' && row.sent_at));
});
test('explicit transient rejection retries with delay; permanent and ambiguous errors do not', async () => {
  for (const [error, expected] of [[{ responseCode: 451 }, 'pending'], [{ responseCode: 550 }, 'failed'], [{ code: 'ETIMEDOUT', message: 'secret recipient and server text' }, 'uncertain']]) {
    const directory = store(); save(directory); const { db } = openStore({ directory });
    const now = new Date(Date.now() + 1000);
    assert.equal(await deliverOne(db, { sendMail: async () => { throw error; } }, now), expected);
    const changed = db.prepare('SELECT * FROM mail_outbox WHERE attempts=1').get();
    assert.equal(changed.status, expected); assert.ok(!changed.last_error.includes('secret'));
    assert.ok(changed.next_attempt_at > now.toISOString()); db.close();
  }
});
test('cross-process claims are exclusive and expired claims quarantine rather than resend', async () => {
  const directory = store(); save(directory);
  const child = () => new Promise((resolve, reject) => {
    const p = spawn(process.execPath, ['--input-type=module', '-e', `import {openStore} from './lib/forms/store.mjs'; import {claimMail} from './lib/forms/outbox.mjs'; const {db}=openStore({directory:process.env.TEST_MAIL_DIR}); const job=claimMail(db); console.log(job?.id || 'idle'); db.close();`], { env: { ...process.env, TEST_MAIL_DIR: directory }, stdio: ['ignore', 'pipe', 'ignore'] });
    let output = ''; p.stdout.on('data', chunk => output += chunk); p.on('error', reject); p.on('exit', code => code ? reject(new Error('Child failed')) : resolve(output.trim()));
  });
  const claims = await Promise.all(Array.from({ length: 6 }, child));
  assert.equal(claims.filter(value => value !== 'idle').length, 2); assert.equal(new Set(claims.filter(value => value !== 'idle')).size, 2);
  const { db } = openStore({ directory }); assert.equal(claimMail(db, new Date(Date.now() + 360000)), null);
  assert.equal(db.prepare("SELECT count(*) n FROM mail_outbox WHERE status='uncertain'").get().n, 2); db.close();
});
test('SMTP requires explicit activation, TLS, credentials and exactly one owner mailbox', async () => {
  assert.throws(() => smtpConfig({})); assert.throws(() => smtpConfig({ ...smtpEnv, HCT_SMTP_PORT: '25' }));
  assert.throws(() => smtpConfig({ ...smtpEnv, HCT_SMTP_PASSWORD: '' })); assert.throws(() => smtpConfig({ ...smtpEnv, HCT_MAIL_OWNER: 'a@example.invalid,b@example.invalid' }));
  const config = smtpConfig(smtpEnv); assert.equal(config.requireTLS, true); assert.equal(config.tls.rejectUnauthorized, true); assert.equal(config.debug, false);
  assert.equal(smtpConfig({ ...smtpEnv, HCT_SMTP_PORT: '465' }).secure, true);
  let created = false;
  await assert.rejects(runMailCommand('send', { directory: store(), env: {}, createTransport: () => { created = true; } }));
  assert.equal(created, false);
});
