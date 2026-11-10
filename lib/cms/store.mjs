import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { CmsError, validateDocument } from './schema.mjs';
function secureFile(file, create = false) {
  if (create && !fs.existsSync(file)) { const fd=fs.openSync(file,fs.constants.O_CREAT|fs.constants.O_EXCL|fs.constants.O_WRONLY|fs.constants.O_NOFOLLOW,0o600); fs.fsyncSync(fd); fs.closeSync(fd); }
  const s=fs.lstatSync(file);
  if (!s.isFile() || s.isSymbolicLink() || s.nlink !== 1 || (s.mode & 0o777)!==0o600 || s.uid!==process.getuid?.()) throw new Error('Unsafe CMS file');
}
export function privateDirectory(directory=process.env.HCT_CMS_DATA_DIR) {
  if (!directory || !path.isAbsolute(directory) || path.resolve(directory)!==directory) throw new Error('CMS private directory required');
  const app=fs.realpathSync(process.cwd());
  if (directory===app || directory.startsWith(app+path.sep)) throw new Error('CMS storage must be outside app');
  let current=path.parse(directory).root;
  for (const part of directory.slice(current.length).split(path.sep)) {
    current=path.join(current,part); const s=fs.lstatSync(current);
    if (s.isSymbolicLink() || !s.isDirectory()) throw new Error('Unsafe CMS directory');
    if (current===directory && ((s.mode&0o777)!==0o700 || s.uid!==process.getuid?.())) throw new Error('CMS directory must be 0700 and owned by app user');
    if (current!==directory && (s.mode&0o022) && !(s.mode&0o1000)) throw new Error('Unsafe CMS parent');
  }
  return directory;
}
const TABLES=['attempts','content','invitations','revisions','sessions','users'];
export function openCms({directory,initialize=false,defaults}={}) {
  const dir=privateDirectory(directory); const file=path.join(dir,'cms.sqlite'); secureFile(file,initialize);
  for (const suffix of ['-journal','-wal','-shm']) {try {secureFile(file+suffix);}catch(e){if(e.code!=='ENOENT')throw e;}}
  const db=new DatabaseSync(file);
  try {
    db.exec('PRAGMA busy_timeout=5000; PRAGMA journal_mode=DELETE; PRAGMA synchronous=FULL; PRAGMA max_page_count=65536;');
    if (initialize) db.exec('BEGIN IMMEDIATE');
    try {
      const version=db.prepare('PRAGMA user_version').get().user_version;
      const names=db.prepare("SELECT name FROM sqlite_schema WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all().map(r=>r.name);
      if (initialize && version===0 && !names.length) {
        validateDocument(defaults,defaults);
        db.exec(`CREATE TABLE content (id INTEGER PRIMARY KEY CHECK(id=1), revision INTEGER NOT NULL, draft TEXT NOT NULL, published TEXT NOT NULL); CREATE TABLE revisions (revision INTEGER PRIMARY KEY, saved_at TEXT NOT NULL, actor TEXT NOT NULL, action TEXT NOT NULL, document TEXT NOT NULL); CREATE TABLE users (username TEXT PRIMARY KEY, salt TEXT NOT NULL, hash TEXT NOT NULL); CREATE TABLE invitations (token_hash TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, expires INTEGER NOT NULL); CREATE TABLE sessions (token_hash TEXT PRIMARY KEY, username TEXT NOT NULL, expires INTEGER NOT NULL); CREATE TABLE attempts (username TEXT NOT NULL, attempted INTEGER NOT NULL); PRAGMA user_version=1;`);
        const json=JSON.stringify(defaults); db.prepare('INSERT INTO content VALUES(1,1,?,?)').run(json,json);
      } else if (version!==1 || JSON.stringify(names)!==JSON.stringify(TABLES)) throw new Error('Unknown CMS schema');
      if(initialize)db.exec('COMMIT');
    }catch(e){if(initialize){try{db.exec('ROLLBACK');}catch{}}throw e;}
    return {db,dir,file};
  }catch(e){db.close();throw e;}
}
export function readContent(options) {
  const {db}=openCms(options); try {const row=db.prepare('SELECT * FROM content WHERE id=1').get(); if(!row)throw new Error('CMS content missing');return {revision:row.revision,draft:JSON.parse(row.draft),published:JSON.parse(row.published)};}finally{db.close();}
}
export function writeContent(document, revision, actor, defaults, options) {
  validateDocument(document,defaults);
  return changeContent(revision,actor,'save',document,options);
}
export function publishContent(revision,actor,defaults,options) {return changeContent(revision,actor,'publish',null,options,defaults);}
function changeContent(revision,actor,action,document,options,defaults) {
  if(!Number.isSafeInteger(revision)||revision<1)throw new CmsError(400,'Invalid revision.');
  const {db}=openCms(options);
  try {
    db.exec('BEGIN IMMEDIATE'); const row=db.prepare('SELECT * FROM content WHERE id=1').get();
    if(!row || row.revision!==revision)throw new CmsError(409,'Someone saved newer changes. Reload before editing again.');
    if(db.prepare('SELECT count(*) n FROM revisions').get().n>=200)throw new CmsError(507,'Revision storage is full. Ask the site administrator to archive revisions.');
    const next=revision+1;
    const json=action==='save'?JSON.stringify(document):JSON.stringify(validateDocument(JSON.parse(row.draft),defaults));
    db.prepare('INSERT INTO revisions VALUES(?,?,?,?,?)').run(revision,new Date().toISOString(),actor,action,JSON.stringify({draft:JSON.parse(row.draft),published:JSON.parse(row.published)}));
    if(action==='save')db.prepare('UPDATE content SET revision=?,draft=? WHERE id=1').run(next,json);
    else db.prepare('UPDATE content SET revision=?,published=? WHERE id=1').run(next,json);
    db.exec('COMMIT'); return {revision:next,draft:JSON.parse(action==='save'?json:row.draft),published:JSON.parse(action==='publish'?json:row.published)};
  }catch(e){try{db.exec('ROLLBACK');}catch{}throw e;}finally{db.close();}
}
