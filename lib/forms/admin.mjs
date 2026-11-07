import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { openStore, privateDirectory } from './store.mjs';
export const HEADERS = ['id','created_at','form','source_path','email','newsletter_consent','consent_at','consent_text','consent_version','fields_json'];
export function csvCell(value) {
  let text = value == null ? '' : String(value);
  // Also block formula prefixes hidden after Unicode spaces/control characters.
  if (/^[\s\u0000-\u001f\u007f-\u009f]*[=+@-]/u.test(text) || /^[\t\r\n]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}
function artifact(file) {
  if (!file || !path.isAbsolute(file) || path.resolve(file) !== file) throw new Error('Absolute output path required');
  privateDirectory(path.dirname(file));
  return fs.openSync(file, fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_WRONLY | fs.constants.O_NOFOLLOW, 0o600);
}
export function exportCsv(file, newsletterOnly = false, options) {
  const { db } = openStore(options);
  let fd;
  try {
    fd = artifact(file);
    db.exec('BEGIN');
    fs.writeSync(fd, HEADERS.map(csvCell).join(',') + '\r\n');
    for (const row of db.prepare(`SELECT ${HEADERS.join(',')} FROM submissions ${newsletterOnly ? 'WHERE newsletter_consent=1' : ''} ORDER BY created_at,id`).iterate()) fs.writeSync(fd, HEADERS.map(k => csvCell(row[k])).join(',') + '\r\n');
    fs.fsyncSync(fd); db.exec('COMMIT');
  } finally { if (fd !== undefined) fs.closeSync(fd); db.close(); }
}
export function backup(file, options) {
  const { db } = openStore(options);
  try {
    const fd = artifact(file); fs.closeSync(fd);
    // SQLite produces a consistent snapshot, including concurrent writers.
    db.prepare('VACUUM INTO ?').run(file);
    const check = new DatabaseSync(file, { readOnly: true });
    try { if (check.prepare('PRAGMA integrity_check').get().integrity_check !== 'ok') throw new Error('Backup verification failed'); }
    finally { check.close(); }
    const out = fs.openSync(file, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW); fs.fsyncSync(out); fs.closeSync(out);
  } finally { db.close(); }
}
