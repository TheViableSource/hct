// Private command-line worker only. Never import into a public request route.
import { pathToFileURL } from 'node:url';
import { openStore } from './store.mjs';
import { deliverOne, migrateOutbox, validateOutboxSchema, mailbox } from './outbox.mjs';
export function smtpConfig(env = process.env) {
  if (env.HCT_MAIL_DELIVERY_ENABLED !== 'true') throw new Error('Mail delivery is disabled');
  mailbox(env.HCT_MAIL_OWNER);
  const host = env.HCT_SMTP_HOST;
  const port = Number(env.HCT_SMTP_PORT);
  if (!host || !/^[a-z0-9.-]+$/i.test(host) || ![465, 587].includes(port) || !env.HCT_SMTP_USER || !env.HCT_SMTP_PASSWORD) throw new Error('Complete approved SMTP configuration required');
  return {
    host, port, secure: port === 465, requireTLS: true,
    auth: { user: env.HCT_SMTP_USER, pass: env.HCT_SMTP_PASSWORD },
    tls: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
    connectionTimeout: 15000, greetingTimeout: 15000, socketTimeout: 60000,
    disableFileAccess: true, disableUrlAccess: true, logger: false, debug: false,
  };
}
export async function runMailCommand(command, { directory, env = process.env, createTransport } = {}) {
  if (!['migrate', 'counts', 'send'].includes(command)) throw new Error('Use migrate, counts, or send');
  // Validate before touching storage or constructing a network transport.
  const config = command === 'send' ? smtpConfig(env) : null;
  const { db } = openStore({ directory });
  let transport;
  try {
    if (command === 'migrate') { migrateOutbox(db); return { schemaVersion: 2 }; }
    validateOutboxSchema(db);
    if (command === 'counts') return db.prepare('SELECT status,count(*) AS count FROM mail_outbox GROUP BY status ORDER BY status').all();
    const factory = createTransport || (await import('nodemailer')).default.createTransport;
    transport = factory(config);
    const results = {};
    for (let i = 0; i < 25; i++) {
      const status = await deliverOne(db, transport);
      if (status === 'idle') break;
      results[status] = (results[status] || 0) + 1;
    }
    return results;
  } finally { transport?.close?.(); db.close(); }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { console.log(JSON.stringify(await runMailCommand(process.argv[2]))); }
  catch { console.error('Mail command failed. Check approved configuration, private storage and aggregate queue status.'); process.exitCode = 1; }
}
