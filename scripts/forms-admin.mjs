// Run only through authenticated server administration, never a web route.
import fs from 'node:fs';
import path from 'node:path';
import { openStore, privateDirectory } from '../lib/forms/store.mjs';
import { exportCsv, backup } from '../lib/forms/admin.mjs';
const [command, output] = process.argv.slice(2);
try {
  if (command === 'diagnose') {
    const configured = process.env.HCT_FORM_DATA_DIR;
    let storageSafe = false;
    try { privateDirectory(); storageSafe = true; } catch {}
    const info = { cwd: process.cwd(), node: process.version, configuredPath: configured && path.isAbsolute(configured) ? path.resolve(configured) : null, storageSafe };
    if (storageSafe) {
      const stat = fs.lstatSync(configured);
      info.directoryMode = (stat.mode & 0o777).toString(8);
      info.ownerMatches = stat.uid === process.getuid?.();
      try { const { db } = openStore(); db.close(); info.storeReady = true; } catch { info.storeReady = false; }
    }
    console.log(JSON.stringify(info));
  } else if (command === 'init') {
    const dir = process.env.HCT_FORM_DATA_DIR;
    if (!dir || !path.isAbsolute(dir) || path.resolve(dir) !== dir || dir === process.cwd() || dir.startsWith(process.cwd() + path.sep)) throw new Error('Invalid path');
    // Parent must already exist. Never recursively create a guessed server path.
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { mode: 0o700 });
    privateDirectory(dir);
    const { db } = openStore({ initialize: true }); db.close();
    console.log('Private store initialized.');
  } else if (command === 'check' || command === 'counts') {
    const { db } = openStore();
    try {
      if (db.prepare('PRAGMA integrity_check').get().integrity_check !== 'ok') throw new Error('Integrity check failed');
      console.log(JSON.stringify({ integrity: 'ok', counts: db.prepare('SELECT form,newsletter_consent,count(*) count FROM submissions GROUP BY form,newsletter_consent').all() }));
    } finally { db.close(); }
  } else if (command === 'export' || command === 'export-newsletter') {
    exportCsv(output, command === 'export-newsletter'); console.log('Private CSV created. Review withdrawals before any mailing.');
  } else if (command === 'backup') {
    backup(output); console.log('Private backup created and checked.');
  } else throw new Error('Unknown command');
} catch {
  console.error('Admin operation failed. Check the command, private path, ownership, permissions, free space, and whether the output already exists. No existing file was overwritten.');
  process.exitCode = 1;
}
