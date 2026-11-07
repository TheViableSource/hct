import fs from 'node:fs';
import path from 'node:path';
import { randomUUID, createHash } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { CONSENT_TEXT, CONSENT_VERSION, FormFailure } from './schema.mjs';
const MAX_ROWS = 10000;
const MAX_BYTES = 128 * 1024 * 1024;
export function privateDirectory(directory = process.env.HCT_FORM_DATA_DIR) {
  if (!directory || !path.isAbsolute(directory) || path.resolve(directory) !== directory) throw new Error('Private storage configuration required');
  const app = fs.realpathSync(process.cwd());
  if (directory === app || directory.startsWith(app + path.sep)) throw new Error('Storage must be outside application');
  let current = path.parse(directory).root;
  for (const part of directory.slice(current.length).split(path.sep)) {
    current = path.join(current, part);
    const stat = fs.lstatSync(current);
    if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error('Unsafe storage path');
    if (current === directory && ((stat.mode & 0o777) !== 0o700 || stat.uid !== process.getuid?.())) throw new Error('Private directory must be owned by current user with mode 0700');
    if (current !== directory && (stat.mode & 0o022) && !(stat.mode & 0o1000)) throw new Error('Writable parent directory');
  }
  return directory;
}
function secureFile(file, create = false) {
  if (create && !fs.existsSync(file)) {
    const fd = fs.openSync(file, fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_WRONLY | fs.constants.O_NOFOLLOW, 0o600);
    fs.fsyncSync(fd); fs.closeSync(fd);
  }
  const s = fs.lstatSync(file);
  if (!s.isFile() || s.isSymbolicLink() || s.nlink !== 1 || (s.mode & 0o777) !== 0o600 || s.uid !== process.getuid?.()) throw new Error('Unsafe storage file');
}
export function openStore({ initialize = false, directory } = {}) {
  const dir = privateDirectory(directory);
  const file = path.join(dir, 'submissions.sqlite');
  secureFile(file, initialize);
  for (const suffix of ['-journal', '-wal', '-shm']) {
    try { secureFile(file + suffix); }
    catch (error) {
      // DELETE journals can disappear between lstat calls as another process commits.
      // Missing optional sidecars are safe; all other errors still fail closed.
      if (error.code !== 'ENOENT') throw error;
    }
  }
  const db = new DatabaseSync(file);
  try {
    db.exec('PRAGMA busy_timeout=5000;');
    if (initialize) db.exec('BEGIN IMMEDIATE');
    try {
      const version = db.prepare('PRAGMA user_version').get().user_version;
      const objects = db.prepare("SELECT type,name FROM sqlite_schema WHERE name NOT LIKE 'sqlite_%' ORDER BY type,name").all();
      if (version === 0 && initialize && objects.length === 0) {
        db.exec(`CREATE TABLE submissions (id TEXT PRIMARY KEY, request_id TEXT UNIQUE NOT NULL, fingerprint TEXT NOT NULL, created_at TEXT NOT NULL, email TEXT NOT NULL, form TEXT NOT NULL, newsletter_consent INTEGER NOT NULL CHECK(newsletter_consent IN (0,1)), consent_at TEXT, consent_text TEXT NOT NULL, consent_version TEXT NOT NULL, source_path TEXT NOT NULL, fields_json TEXT NOT NULL); CREATE INDEX rate_email ON submissions(email, created_at); CREATE INDEX rate_global ON submissions(created_at); PRAGMA user_version=1;`);
      } else {
        // Never relabel unknown databases or append this schema to unrelated data.
        const expected = [['index', 'rate_email'], ['index', 'rate_global'], ['table', 'submissions']];
        if (version !== 1 || JSON.stringify(objects.map(row => [row.type, row.name])) !== JSON.stringify(expected)) throw new Error('Unknown storage schema');
        const columns = db.prepare('PRAGMA table_info(submissions)').all().map(row => row.name);
        if (columns.join(',') !== 'id,request_id,fingerprint,created_at,email,form,newsletter_consent,consent_at,consent_text,consent_version,source_path,fields_json') throw new Error('Unknown storage columns');
      }
      if (initialize) db.exec('COMMIT');
    } catch (error) {
      if (initialize) { try { db.exec('ROLLBACK'); } catch {} }
      throw error;
    }
    db.exec('PRAGMA journal_mode=DELETE; PRAGMA synchronous=FULL; PRAGMA max_page_count=32768;');
    return { db, dir, file };
  } catch (error) { db.close(); throw error; }
}
export function saveSubmission(value, options) {
  const { db, dir } = openStore(options);
  try {
    db.exec('BEGIN IMMEDIATE');
    const fingerprint = createHash('sha256').update(JSON.stringify(value)).digest('hex');
    const existing = db.prepare('SELECT fingerprint FROM submissions WHERE request_id=?').get(value.requestId);
    if (existing) {
      if (existing.fingerprint !== fingerprint) throw new FormFailure(409, 'Your form changed. Please send it again.');
      db.exec('COMMIT'); return;
    }
    const now = new Date();
    const since = new Date(now.getTime() - 3600000).toISOString();
    if (db.prepare('SELECT count(*) n FROM submissions WHERE email=? AND created_at>?').get(value.fields.email, since).n >= 5 || db.prepare('SELECT count(*) n FROM submissions WHERE created_at>?').get(since).n >= 100) throw new FormFailure(429, 'Too many forms were sent. Please try again later.');
    const bytes = fs.readdirSync(dir).reduce((n, name) => n + fs.lstatSync(path.join(dir, name)).size, 0);
    if (bytes >= MAX_BYTES || db.prepare('SELECT count(*) n FROM submissions').get().n >= MAX_ROWS) throw new Error('Storage limit');
    const timestamp = now.toISOString();
    db.prepare('INSERT INTO submissions VALUES (?,?,?,?,?,?,?,?,?,?,?,?)').run(randomUUID(), value.requestId, fingerprint, timestamp, value.fields.email, value.form, Number(value.newsletterConsent), value.newsletterConsent ? timestamp : null, CONSENT_TEXT, CONSENT_VERSION, value.sourcePath, JSON.stringify(value.fields));
    db.exec('COMMIT');
  } catch (error) { try { db.exec('ROLLBACK'); } catch {} throw error; }
  finally { db.close(); }
}
