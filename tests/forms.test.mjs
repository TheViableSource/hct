import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { DatabaseSync } from 'node:sqlite';
import { validate } from '../lib/forms/schema.mjs';
import { openStore, saveSubmission } from '../lib/forms/store.mjs';
import { handleForm } from '../lib/forms/handler.mjs';
import { backup, exportCsv, csvCell } from '../lib/forms/admin.mjs';
const root = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), 'hct-synthetic-'));
fs.chmodSync(root, 0o700);
let seq = 0;
function store() { const directory = path.join(root, String(++seq)); fs.mkdirSync(directory, { mode: 0o700 }); openStore({ initialize: true, directory }).db.close(); return directory; }
function data(extra = {}) { return { form:'community', name:'Example Person', email:'person@example.invalid', cityZip:'', involvement:[], about:'', website:'', newsletterConsent:false, requestId:randomUUID(), ...extra }; }
function count(directory) { const { db } = openStore({ directory }); try { return db.prepare('SELECT count(*) n FROM submissions').get().n; } finally { db.close(); } }
function child(directory, input) { return new Promise((resolve, reject) => { const p = spawn(process.execPath, ['--input-type=module', '-e', `import {validate} from './lib/forms/schema.mjs'; import {saveSubmission} from './lib/forms/store.mjs'; try {saveSubmission(validate(JSON.parse(process.env.INPUT)),{directory:process.env.DIR});}catch(e){process.exitCode=e.status===429?29:1;}`], { cwd:process.cwd(), env:{...process.env, DIR:directory, INPUT:JSON.stringify(input)}, stdio:'ignore' }); p.on('error',reject); p.on('exit',resolve); }); }
test.after(() => fs.rmSync(root, { recursive:true, force:true }));
test('consent, provenance, durable reopen and idempotency', () => {
 const directory=store(); const input=data(); saveSubmission(validate(input),{directory}); saveSubmission(validate(input),{directory});
 saveSubmission(validate(data({newsletterConsent:true,email:'yes@example.invalid'})),{directory});
 const {db}=openStore({directory}); const rows=db.prepare('SELECT * FROM submissions ORDER BY created_at').all(); db.close();
 assert.equal(rows.length,2); assert.equal(rows[0].consent_at,null); assert.equal(rows[0].newsletter_consent,0); assert.ok(rows[1].consent_at); assert.equal(rows[1].newsletter_consent,1); assert.equal(rows[0].source_path,'/community'); assert.match(rows[0].id,/^[a-f0-9-]{36}$/); assert.ok(rows[0].consent_text); assert.ok(rows[0].consent_version);
 assert.throws(()=>saveSubmission(validate({...input,name:'Changed'}),{directory}),e=>e.status===409);
});
test('strict fields, enum, types, honeypot, donations and newsletter consent',()=>{
 for(const change of [{form:'donate'},{form:'toString'},{form:['newsletter']},{form:{}},{newsletterConsent:'true'},{newsletterConsent:undefined},{website:'bot'},{email:'bad'},{name:'x'.repeat(201)},{name:'line\nbreak'},{involvement:['made up']},{involvement:'Volunteer'},{extra:'forbidden'},{requestId:'bad'}]) assert.throws(()=>validate(data(change)));
 assert.throws(()=>validate({form:'newsletter',email:'n@example.invalid',newsletterConsent:false,website:'',requestId:randomUUID()}));
 assert.equal(validate({form:'newsletter',email:'n@example.invalid',newsletterConsent:true,website:'',requestId:randomUUID()}).newsletterConsent,true);
 assert.equal(validate({form:'get-involved',firstName:'Example',lastName:'Person',email:'i@example.invalid',phone:'',organization:'',intent:[],sponsorLevel:'',about:'',website:'',newsletterConsent:false,requestId:randomUUID()}).sourcePath,'/get-involved');
});
test('POST-only origin, bounded streamed body, donation rejection and fail closed',async()=>{
 process.env.HCT_FORM_DATA_DIR=store(); process.env.HCT_FORM_ORIGINS='https://hct.example.invalid';
 const request=(body,headers={})=>new Request('https://hct.example.invalid/api/forms',{method:'POST',headers:{origin:process.env.HCT_FORM_ORIGINS,'content-type':'application/json',...headers},body:typeof body==='string'?body:JSON.stringify(body)});
 assert.equal((await handleForm(request(data()))).status,200);
 process.env.HCT_FORM_ORIGINS += ',https://staging.example.invalid';
 assert.equal((await handleForm(request(data(),{origin:'https://staging.example.invalid'}))).status,200);
 process.env.HCT_FORM_ORIGINS='https://hct.example.invalid';
 assert.equal((await handleForm(new Request('https://hct.example.invalid/api/forms'))).status,405);
 assert.equal((await handleForm(request(data(),{origin:'https://evil.example.invalid'}))).status,403);
 assert.equal((await handleForm(request(data(),{'content-type':'text/plain'}))).status,415);
 assert.equal((await handleForm(request(data({form:'donate'})))).status,400);
 assert.equal((await handleForm(request('{bad'))).status,400);
 assert.equal((await handleForm(request('x'.repeat(17000)))).status,413);
 const stream=new ReadableStream({start(c){c.enqueue(new Uint8Array(9000));c.enqueue(new Uint8Array(9000));c.close();}});
 assert.equal((await handleForm(new Request('https://hct.example.invalid/api/forms',{method:'POST',headers:{origin:process.env.HCT_FORM_ORIGINS,'content-type':'application/json'},body:stream,duplex:'half'}))).status,413);
 delete process.env.HCT_FORM_DATA_DIR; assert.equal((await handleForm(request(data()))).status,503);
 process.env.HCT_FORM_DATA_DIR=store(); delete process.env.HCT_FORM_ORIGINS; assert.equal((await handleForm(request(data()))).status,503);
});
test('cross-process duplicate requests and persistent rate limits',async()=>{
 const directory=store(); const input=data(); assert.deepEqual(await Promise.all(Array.from({length:8},()=>child(directory,input))),Array(8).fill(0)); assert.equal(count(directory),1);
 const codes=await Promise.all(Array.from({length:8},()=>child(directory,data()))); assert.equal(codes.filter(c=>c===0).length,4); assert.equal(codes.filter(c=>c===29).length,4); assert.equal(count(directory),5);
 assert.throws(()=>saveSubmission(validate(data()),{directory}),e=>e.status===429);
});
test('global rate and storage ceilings',()=>{
 const directory=store(); for(let i=0;i<100;i++)saveSubmission(validate(data({email:`p${i}@example.invalid`})),{directory});
 assert.throws(()=>saveSubmission(validate(data({email:'new@example.invalid'})),{directory}),e=>e.status===429);
 const other=store(); const fd=fs.openSync(path.join(other,'ceiling-test'),'wx',0o600); fs.ftruncateSync(fd,128*1024*1024);fs.closeSync(fd);assert.throws(()=>saveSubmission(validate(data()),{directory:other}));assert.equal(count(other),0);
});
test('permissions and symlink targets fail closed',()=>{
 const directory=store();fs.chmodSync(directory,0o755); assert.throws(()=>openStore({directory}));fs.chmodSync(directory,0o700);
 const link=path.join(root,'link');fs.symlinkSync(directory,link);assert.throws(()=>openStore({directory:link}));
 const sidecar=path.join(directory,'submissions.sqlite-journal');fs.symlinkSync(path.join(root,'missing'),sidecar);assert.throws(()=>openStore({directory}));fs.unlinkSync(sidecar);
 fs.chmodSync(path.join(directory,'submissions.sqlite'),0o644);assert.throws(()=>openStore({directory}));
 assert.throws(()=>openStore({directory:process.cwd()})); assert.throws(()=>openStore({directory:'relative'}));
});
test('consistent backup, safe export, opt-out exclusion and no overwrite',()=>{
 const directory=store();saveSubmission(validate(data({name:'  =SUM(1,2)',about:'quote " and\nnewline'})),{directory});saveSubmission(validate(data({email:'yes@example.invalid',newsletterConsent:true})),{directory});
 const csv=path.join(root,'export.csv');exportCsv(csv,true,{directory});const text=fs.readFileSync(csv,'utf8');assert.ok(text.includes('yes@example.invalid'));assert.ok(!text.includes('person@example.invalid'));assert.equal(fs.statSync(csv).mode&0o777,0o600);assert.throws(()=>exportCsv(csv,true,{directory}));
 for(const v of ['=1','  =1','\t+1','\u00a0@x','-1'])assert.ok(csvCell(v).startsWith('"\''));assert.equal(csvCell('a"b'),'"a""b"');
 const dest=path.join(root,'backup.sqlite');backup(dest,{directory});assert.equal(fs.statSync(dest).mode&0o777,0o600);
 const restore=path.join(root,'restore');fs.mkdirSync(restore,{mode:0o700});fs.copyFileSync(dest,path.join(restore,'submissions.sqlite'));assert.equal(count(restore),2);assert.throws(()=>backup(dest,{directory}));
});

test('init is idempotent and rejects unknown versions or unrelated schemas unchanged',()=>{
 const directory=store();saveSubmission(validate(data()),{directory});
 openStore({directory,initialize:true}).db.close();assert.equal(count(directory),1);
 for(const sql of ['PRAGMA user_version=2', 'CREATE TABLE unrelated (value TEXT); INSERT INTO unrelated VALUES (\'synthetic\')', 'CREATE TABLE unrelated (value TEXT); PRAGMA user_version=1']) {
   const dir=path.join(root,String(++seq));fs.mkdirSync(dir,{mode:0o700});
   const file=path.join(dir,'submissions.sqlite');fs.closeSync(fs.openSync(file,'wx',0o600));
   const db=new DatabaseSync(file);db.exec(sql);db.close();
   const before=fs.readFileSync(file);
   assert.throws(()=>openStore({directory:dir,initialize:true}));
   assert.deepEqual(fs.readFileSync(file),before);
 }
 const {db}=openStore({directory});db.exec('CREATE TABLE unrelated (value TEXT)');db.close();
 const before=fs.readFileSync(path.join(directory,'submissions.sqlite'));
 assert.throws(()=>openStore({directory,initialize:true}));
 assert.deepEqual(fs.readFileSync(path.join(directory,'submissions.sqlite')),before);
});
