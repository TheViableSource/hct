import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validateDocument,safeUrl } from '../lib/cms/schema.mjs';
import {openCms,readContent,writeContent,publishContent} from '../lib/cms/store.mjs';
import {createUser,login,logout,sessionUser,checkOrigin,cookieOptions} from '../lib/cms/auth.mjs';
const defaults=JSON.parse(fs.readFileSync(new URL('../lib/cms/defaults.json',import.meta.url),'utf8'));
const clone=()=>structuredClone(defaults);
function fixture(){const directory=fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()),'hct-cms-test-'));fs.chmodSync(directory,0o700);const options={directory,initialize:true,defaults};const {db}=openCms(options);db.close();return {directory,options:{directory},clean:()=>fs.rmSync(directory,{recursive:true,force:true})};}
test('CMS document validates baseline and rejects unknown keys and unsafe URLs',()=>{
 assert.deepEqual(validateDocument(clone(),defaults),defaults);
 for(const url of ['javascript:alert(1)','data:text/html,x','//evil.example','/\\evil.example','https://user:pass@example.com','https://example.com/\nx','http://example.com'])assert.throws(()=>safeUrl(url));
 for(const url of ['/about','#section','https://example.com/page','mailto:hello@example.com','tel:+15035550123'])assert.equal(safeUrl(url),url);
 const bad=clone();bad.text.injected='x';assert.throws(()=>validateDocument(bad,defaults));
 const post=clone();post.posts=[{id:'p1',slug:'../secret',title:'T',excerpt:'',body:'',published:false}];assert.throws(()=>validateDocument(post,defaults));
 const section=clone();section.sections['/']=[{id:'s',title:'Title',body:'Body',buttonLabel:'Go'}];assert.throws(()=>validateDocument(section,defaults));
});
test('CMS draft is separate from published, revisions protect against stale saves and retain history',()=>{
 const f=fixture();try{
  const initial=readContent(f.options);assert.equal(initial.revision,1);
  const draft=clone();const key=Object.keys(draft.text)[0];draft.text[key]='Synthetic draft';
  const saved=writeContent(draft,1,'editor',defaults,f.options);assert.equal(saved.revision,2);assert.notEqual(saved.published.text[key],'Synthetic draft');
  assert.throws(()=>writeContent(draft,1,'editor',defaults,f.options),e=>e.status===409);
  const live=publishContent(2,'editor',defaults,f.options);assert.equal(live.revision,3);assert.equal(live.published.text[key],'Synthetic draft');
  const {db}=openCms(f.options);assert.equal(db.prepare('SELECT count(*) n FROM revisions').get().n,2);assert.equal(db.prepare('PRAGMA integrity_check').get().integrity_check,'ok');db.close();
 }finally{f.clean();}
});
test('CMS refuses unsafe directories and unrelated database without overwriting it',()=>{
 const f=fixture();try{fs.chmodSync(f.directory,0o755);assert.throws(()=>readContent(f.options));fs.chmodSync(f.directory,0o700);const {db}=openCms(f.options);db.exec('PRAGMA user_version=99');db.close();assert.throws(()=>openCms({...f.options,initialize:true,defaults}));}finally{f.clean();}
});
test('CMS passwords are hashed, sessions expire/logout, and failed login is limited',async()=>{
 const f=fixture();try{
  const password='synthetic-only-password-for-tests';await createUser('test@example.invalid',password,f.options);
  const {db}=openCms(f.options);const row=db.prepare('SELECT * FROM users').get();assert.notEqual(row.hash,password);assert.equal(row.hash.length,128);db.close();
  assert.equal(sessionUser('bad',f.options),null);
  const token=await login('test@example.invalid',password,f.options);assert.equal(sessionUser(token,f.options),'test@example.invalid');logout(token,f.options);assert.equal(sessionUser(token,f.options),null);
  for(let i=0;i<5;i++)await assert.rejects(login('nobody@example.invalid','wrong',f.options),e=>e.status===401);
  await assert.rejects(login('nobody@example.invalid','wrong',f.options),e=>e.status===429);
 }finally{f.clean();}
});
test('CMS mutations reject cross-origin requests and use secure cookies on HTTPS',()=>{
 const before=process.env.HCT_CMS_ORIGIN;process.env.HCT_CMS_ORIGIN='https://hillsborocivictheatre.com';try{
  checkOrigin(new Request('https://hillsborocivictheatre.com/admin',{headers:{origin:'https://hillsborocivictheatre.com','sec-fetch-site':'same-origin'}}));
  assert.throws(()=>checkOrigin(new Request('https://hillsborocivictheatre.com/admin',{headers:{origin:'https://evil.example'}})));
  assert.equal(cookieOptions().secure,true);assert.equal(cookieOptions().httpOnly,true);assert.equal(cookieOptions().sameSite,'strict');
 }finally{if(before===undefined)delete process.env.HCT_CMS_ORIGIN;else process.env.HCT_CMS_ORIGIN=before;}
});
test('CMS invitation expires, activates once, never stores raw token and grants only editor login',async()=>{
 const {createInvitation,activateInvitation}=await import('../lib/cms/auth.mjs');const f=fixture();try{
 const token=createInvitation('invited@example.invalid',f.options);const {db}=openCms(f.options);const row=db.prepare('SELECT * FROM invitations').get();assert.notEqual(row.token_hash,token);assert.ok(row.expires>Date.now());db.close();
 assert.equal(await activateInvitation(token,'synthetic-activation-password',f.options),'invited@example.invalid');
 await assert.rejects(activateInvitation(token,'another-synthetic-password',f.options));
 const session=await login('invited@example.invalid','synthetic-activation-password',f.options);assert.equal(sessionUser(session,f.options),'invited@example.invalid');
 const expired=createInvitation('expired@example.invalid',f.options);const conn=openCms(f.options);conn.db.prepare('UPDATE invitations SET expires=0').run();conn.db.close();await assert.rejects(activateInvitation(expired,'synthetic-activation-password',f.options));
 }finally{f.clean();}
});
