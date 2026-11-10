// All queue mutations run in the same private SQLite store as submissions.
import { randomUUID } from 'node:crypto';
export const MAIL_FROM = 'jeremy@theviablesource.com';
const COLUMNS = 'id,submission_id,audience,recipient,created_at,form,status,attempts,next_attempt_at,lease_until,claim_token,message_id,sent_at,last_error';
export function validateOutboxSchema(db) {
  if (db.prepare('PRAGMA table_info(mail_outbox)').all().map(row => row.name).join(',') !== COLUMNS) throw new Error('Unknown mail outbox columns');
}
export function migrateOutbox(db) {
  db.exec('BEGIN IMMEDIATE');
  try {
    const version = db.prepare('PRAGMA user_version').get().user_version;
    if (version === 2) validateOutboxSchema(db);
    else if (version === 1) {
      db.exec(`CREATE TABLE mail_outbox (
        id TEXT PRIMARY KEY, submission_id TEXT NOT NULL REFERENCES submissions(id),
        audience TEXT NOT NULL CHECK(audience IN ('owner','submitter')), recipient TEXT NOT NULL,
        created_at TEXT NOT NULL, form TEXT NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('pending','sending','sent','failed','uncertain')),
        attempts INTEGER NOT NULL DEFAULT 0, next_attempt_at TEXT NOT NULL,
        lease_until TEXT, claim_token TEXT, message_id TEXT NOT NULL UNIQUE,
        sent_at TEXT, last_error TEXT, UNIQUE(submission_id,audience)
      ); PRAGMA user_version=2;`);
    } else throw new Error('Unknown storage schema');
    db.exec('COMMIT');
  } catch (error) { db.exec('ROLLBACK'); throw error; }
}
export function mailbox(value) {
  // Deliberately accept only one plain mailbox, never display names or lists.
  if (typeof value !== 'string' || value.length > 254 || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?\.[a-z]{2,}$/i.test(value)) throw new Error('Single mailbox required');
  return value;
}
export function enqueueMail(db, submission, env = process.env) {
  if (env.HCT_FORM_MAIL_QUEUE_ENABLED !== 'true') return;
  const owner = mailbox(env.HCT_MAIL_OWNER);
  const submitter = mailbox(submission.email);
  // Missing migration or invalid configuration rolls back the entire intake,
  // rather than claiming success while silently dropping required notifications.
  validateOutboxSchema(db);
  for (const [audience, recipient] of [['owner', owner], ['submitter', submitter]]) {
    const id = randomUUID();
    db.prepare(`INSERT INTO mail_outbox
      (id,submission_id,audience,recipient,created_at,form,status,next_attempt_at,message_id)
      VALUES (?,?,?,?,?,?,'pending',?,?)`).run(id, submission.id, audience, recipient, submission.timestamp, submission.form, submission.timestamp, `<hct-${id}@theviablesource.com>`);
  }
}
export function mailMessage(job) {
  const label = { newsletter: 'newsletter request', community: 'community form', 'get-involved': 'get-involved inquiry' }[job.form];
  if (!label) throw new Error('Unknown form type');
  return {
    from: { name: 'Hillsboro Civic Theatre', address: MAIL_FROM },
    to: { address: mailbox(job.recipient) },
    envelope: { from: MAIL_FROM, to: [mailbox(job.recipient)] },
    messageId: job.message_id,
    subject: job.audience === 'owner' ? `HCT: New ${label}` : 'Hillsboro Civic Theatre received your form',
    text: job.audience === 'owner'
      ? `A new ${label} was saved securely.\n\nReference: ${job.submission_id}\nReceived: ${job.created_at}\n\nReview the submission through the authorized private form-review workflow. No submitted personal details are included in this notification.`
      : `Thank you for contacting Hillsboro Civic Theatre. Your ${label} was received and saved.\n\nThis receipt does not confirm a newsletter subscription, donation, payment, or pledge. Newsletter enrollment is handled separately. If you did not submit a form, no action is needed.`,
  };
}
export function claimMail(db, now = new Date()) {
  db.exec('BEGIN IMMEDIATE');
  try {
    // A crashed worker may already have handed the message to SMTP. Quarantine
    // instead of automatically re-sending and risking a duplicate receipt.
    db.prepare("UPDATE mail_outbox SET status='uncertain',last_error='worker_interrupted',claim_token=NULL,lease_until=NULL WHERE status='sending' AND lease_until<=?").run(now.toISOString());
    const job = db.prepare("SELECT * FROM mail_outbox WHERE status='pending' AND next_attempt_at<=? ORDER BY created_at,id LIMIT 1").get(now.toISOString());
    if (!job) { db.exec('COMMIT'); return null; }
    const token = randomUUID();
    db.prepare("UPDATE mail_outbox SET status='sending',attempts=attempts+1,claim_token=?,lease_until=? WHERE id=?").run(token, new Date(now.getTime() + 300000).toISOString(), job.id);
    db.exec('COMMIT'); return { ...job, attempts: job.attempts + 1, claim_token: token };
  } catch (error) { db.exec('ROLLBACK'); throw error; }
}
export async function deliverOne(db, transport, now = new Date()) {
  const job = claimMail(db, now);
  if (!job) return 'idle';
  let status = 'sent'; let code = null;
  try {
    const info = await transport.sendMail(mailMessage(job));
    if (!Array.isArray(info?.accepted) || info.accepted.length !== 1 || info?.rejected?.length) {
      status = 'uncertain'; code = 'unconfirmed_acceptance';
    }
  } catch (error) {
    // Only explicit SMTP negative replies prove non-acceptance. Timeouts and
    // connection loss (including after DATA) are ambiguous, so never auto-retry.
    const responseCode = Number(error?.responseCode);
    if (responseCode >= 400 && responseCode < 500) {
      status = job.attempts < 5 ? 'pending' : 'failed'; code = 'smtp_temporary_rejection';
    } else if (responseCode >= 500 && responseCode < 600) {
      status = 'failed'; code = 'smtp_permanent_rejection';
    } else { status = 'uncertain'; code = 'smtp_outcome_unknown'; }
  }
  const retryAt = new Date(now.getTime() + Math.min(86400000, 60000 * 2 ** job.attempts)).toISOString();
  const result = db.prepare(`UPDATE mail_outbox SET status=?,last_error=?,sent_at=?,next_attempt_at=?,lease_until=NULL,claim_token=NULL WHERE id=? AND claim_token=? AND status='sending'`).run(status, code, status === 'sent' ? new Date().toISOString() : null, retryAt, job.id, job.claim_token);
  if (result.changes !== 1) return 'uncertain';
  return status;
}
