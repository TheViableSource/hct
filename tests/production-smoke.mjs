// Run after npm run build. No real records or external connections.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import net from 'node:net';
import { openStore } from '../lib/forms/store.mjs';
const directory=fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()),'hct-production-synthetic-'));
fs.chmodSync(directory,0o700);openStore({directory,initialize:true}).db.close();
const probe=net.createServer();
probe.listen(0,'127.0.0.1');await once(probe,'listening');
const port=probe.address().port;await new Promise(resolve=>probe.close(resolve));
const origin=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',String(port)],{env:{...process.env,NODE_ENV:'production',HCT_FORM_DATA_DIR:directory,HCT_FORM_ORIGINS:origin,HCT_CMS_DATA_DIR:'',HCT_FORM_MAIL_QUEUE_ENABLED:'false',HCT_MAIL_DELIVERY_ENABLED:'false'},stdio:['ignore','pipe','pipe']});
let ready=false;server.stdout.on('data', chunk=>{if(chunk.toString().includes('Ready in'))ready=true;});
// Do not echo server logs or request data, even for synthetic tests.
server.stderr.resume();
try {
 for(let i=0;i<100&&!ready;i++) {if(server.exitCode!==null)throw new Error('Local server exited');await new Promise(r=>setTimeout(r,100));}
 assert.ok(ready,'Local server readiness');
 const input={form:'newsletter',email:'smoke@example.invalid',newsletterConsent:true,website:'',requestId:randomUUID()};
 const post=(data,from=origin)=>fetch(origin+'/api/forms',{method:'POST',headers:{origin:from,'content-type':'application/json'},body:JSON.stringify(data)});
 assert.equal((await post(input)).status,200);assert.equal((await post(input)).status,200);
 assert.equal((await post({...input,form:'donate'})).status,400);
 assert.equal((await post(input,'https://other.example.invalid')).status,403);
 assert.equal((await fetch(origin+'/api/forms')).status,405);
 const {db}=openStore({directory});assert.equal(db.prepare('SELECT count(*) n FROM submissions').get().n,1);db.close();
 for (const route of ['/', '/about', '/community', '/donate', '/get-involved']) {
   const response = await fetch(origin + route);
   assert.equal(response.status, 200, `HTML route ${route}`);
   const html = await response.text();
   const canonicalLinks = [...html.matchAll(/<link\b[^>]*>/gi)]
     .map(match => match[0])
     .filter(tag => /\brel=["']canonical["']/i.test(tag));
   assert.equal(canonicalLinks.length, 1, `One canonical link for ${route}`);
   const href = canonicalLinks[0].match(/\bhref=["']([^"']*)["']/i)?.[1];
   const expected = 'https://hillsborocivictheatre.com' + (route === '/' ? '' : route);
   assert.equal(href, expected, `Exact canonical href for ${route}`);
 }
 const donate=await (await fetch(origin+'/donate')).text();assert.ok(donate.includes('Online Giving Coming Soon'));assert.ok(!donate.includes('Send My Gift Details'));
 const sitemap=await (await fetch(origin+'/sitemap.xml')).text();assert.ok(sitemap.includes('https://hillsborocivictheatre.com'));assert.ok(!sitemap.includes('hillsborocivictheater.org'));
 const robots=await (await fetch(origin+'/robots.txt')).text();assert.ok(robots.includes('https://hillsborocivictheatre.com/sitemap.xml'));
 console.log('Compiled production route, retry, consent, donation rejection, wrong-origin rejection, disabled donation UI, canonical routes and all five exact HTML canonical links passed.');
} finally {
 if(server.exitCode===null){server.kill('SIGTERM');await once(server,'exit');}
 fs.rmSync(directory,{recursive:true,force:true});
}
