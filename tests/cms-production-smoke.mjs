// Compiled HTTP tests. Local isolated stores only; never production credentials or mail.
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import net from 'node:net';import assert from 'node:assert/strict';import {once} from 'node:events';import {spawn} from 'node:child_process';
import {openCms} from '../lib/cms/store.mjs';import {createUser,createInvitation} from '../lib/cms/auth.mjs';
const defaults=JSON.parse(fs.readFileSync(new URL('../lib/cms/defaults.json',import.meta.url),'utf8'));
const directory=fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()),'hct-cms-http-test-'));fs.chmodSync(directory,0o700);openCms({directory,initialize:true,defaults}).db.close();await createUser('synthetic-editor','test-only-password-never-production',{directory});
const probe=net.createServer();probe.listen(0,'127.0.0.1');await once(probe,'listening');const port=probe.address().port;await new Promise(r=>probe.close(r));const origin=`http://127.0.0.1:${port}`;const invitation=createInvitation('invited-http@example.invalid',{directory});
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',String(port)],{env:{...process.env,NODE_ENV:'production',HCT_CMS_DATA_DIR:directory,HCT_CMS_ORIGIN:origin,HCT_FORM_MAIL_QUEUE_ENABLED:'false',HCT_MAIL_DELIVERY_ENABLED:'false'},stdio:['ignore','pipe','pipe']});let ready=false;server.stdout.on('data',c=>{if(c.toString().includes('Ready in'))ready=true});server.stderr.resume();
let cookie='';
const request=(route,method='GET',data,extra={})=>fetch(origin+route,{method,headers:{...(method==='GET'?{}:{origin,'content-type':'application/json'}),...(cookie?{cookie}:{}),...extra},...(data===undefined?{}:{body:JSON.stringify(data)})});
try{
 for(let i=0;i<100&&!ready;i++){if(server.exitCode!==null)throw new Error('Server exited');await new Promise(r=>setTimeout(r,100));}assert.ok(ready);
 assert.equal((await request('/admin/api/activate','POST',{token:invitation,password:'synthetic-http-activation-password'},{origin:'https://wrong.example'})).status,403);
 assert.equal((await request('/admin/api/activate','POST',{token:invitation,password:'synthetic-http-activation-password'})).status,200);
 assert.equal((await request('/admin/api/activate','POST',{token:invitation,password:'synthetic-http-activation-password'})).status,400);
 assert.equal((await request('/admin/api/content')).status,401);
 assert.equal((await request('/admin/api/content','PUT',{})).status,401);
 assert.equal((await request('/admin/api/publish','POST',{})).status,401);
 assert.equal((await request('/admin/api/login','POST',{username:'synthetic-editor',password:'test-only-password-never-production'},{origin:'https://wrong.example'})).status,403);
 const signed=await request('/admin/api/login','POST',{username:'synthetic-editor',password:'test-only-password-never-production'});assert.equal(signed.status,200);cookie=signed.headers.get('set-cookie').split(';')[0];assert.match(signed.headers.get('set-cookie'),/httponly/i);assert.match(signed.headers.get('set-cookie'),/samesite=strict/i);
 let state=await (await request('/admin/api/content')).json();let doc=structuredClone(state.draft);const key=Object.entries(doc.text).find(([,v])=>v==='Where Hillsboro')[0];doc.text[key]='Synthetic Draft Secret';doc.sections['/']=[{id:'test-section',title:'Synthetic Section',body:'One paragraph.\n\nAnother paragraph.'}];doc.posts=[{id:'p1',slug:'visible-test',title:'Synthetic Visible Post',excerpt:'A test',body:'Post body',published:true},{id:'p2',slug:'private-test',title:'PRIVATE_UNPUBLISHED_STORY',excerpt:'',body:'Private body',published:false}];
 let response=await request('/admin/api/content','PUT',{document:doc,revision:state.revision});assert.equal(response.status,200);state=await response.json();
 assert.equal((await request('/admin/api/content','PUT',{document:doc,revision:1})).status,409);
 const cookieOnlyPreview=await (await fetch(origin+'/',{headers:{cookie:'hct_cms_preview=1'}})).text();assert.ok(!cookieOnlyPreview.includes('Synthetic Draft Secret'));
 let publicHtml=await (await fetch(origin+'/')).text();assert.ok(!publicHtml.includes('Synthetic Draft Secret'));assert.ok(!publicHtml.includes('PRIVATE_UNPUBLISHED_STORY'));
 response=await request('/admin/api/preview','POST',{enabled:true});assert.equal(response.status,200);const previewCookie=response.headers.get('set-cookie').split(';')[0];
 const previewHtml=await (await request('/','GET',undefined,{cookie:cookie+'; '+previewCookie})).text();assert.ok(previewHtml.includes('Synthetic Draft Secret'));assert.ok(previewHtml.includes('Draft preview'));assert.match(previewHtml,/noindex/);
 response=await request('/admin/api/publish','POST',{revision:state.revision});assert.equal(response.status,200);
 publicHtml=await (await fetch(origin+'/')).text();assert.ok(publicHtml.includes('Synthetic Draft Secret'));assert.ok(publicHtml.includes('Synthetic Section'));assert.ok(!publicHtml.includes('PRIVATE_UNPUBLISHED_STORY'));
 const blog=await (await fetch(origin+'/blog')).text();assert.ok(blog.includes('Synthetic Visible Post'));assert.ok(!blog.includes('PRIVATE_UNPUBLISHED_STORY'));assert.equal((await fetch(origin+'/blog/private-test')).status,404);assert.equal((await fetch(origin+'/blog/visible-test')).status,200);
 const api=await request('/admin/api/content');assert.match(api.headers.get('cache-control'),/no-store/);
 assert.equal((await request('/admin/api/logout','POST')).status,200);assert.equal((await request('/admin/api/content')).status,401);
 const expiredPreview=await (await request('/','GET',undefined,{cookie:cookie+'; '+previewCookie})).text();assert.ok(!expiredPreview.includes('Draft preview'));assert.ok(!expiredPreview.includes('PRIVATE_UNPUBLISHED_STORY'));
 const unavailable=directory+'-unavailable';fs.renameSync(directory,unavailable);try{const fallback=await fetch(origin+'/');assert.equal(fallback.status,200);assert.ok((await fallback.text()).includes('Where Hillsboro'));assert.equal((await request('/admin/api/content')).status,503);}finally{fs.renameSync(unavailable,directory);}
 console.log('Compiled CMS login, CSRF, session cookies, draft isolation, preview, revision conflicts, publish, section render, blog visibility, no-cache, and logout passed.');
}finally{if(server.exitCode===null){server.kill('SIGTERM');await once(server,'exit')}fs.rmSync(directory,{recursive:true,force:true});}
