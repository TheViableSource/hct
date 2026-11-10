// Synthetic browser QA harness, binds loopback only and removes its test store on exit.
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {spawn} from 'node:child_process';import {once} from 'node:events';import {openCms} from '../lib/cms/store.mjs';import {createUser} from '../lib/cms/auth.mjs';import {openStore} from '../lib/forms/store.mjs';
const base=fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()),'hct-cms-browser-test-'));fs.chmodSync(base,0o700);const cms=path.join(base,'cms'),forms=path.join(base,'forms');fs.mkdirSync(cms,{mode:0o700});fs.mkdirSync(forms,{mode:0o700});
const defaults=JSON.parse(fs.readFileSync(new URL('../lib/cms/defaults.json',import.meta.url),'utf8'));openCms({directory:cms,initialize:true,defaults}).db.close();openStore({directory:forms,initialize:true}).db.close();await createUser('synthetic-editor','test-only-password-never-production',{directory:cms});
const origin='http://127.0.0.1:3417';console.log('Synthetic HCT CMS browser QA: '+origin+'/admin');
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3417'],{env:{...process.env,NODE_ENV:'production',HCT_CMS_DATA_DIR:cms,HCT_CMS_ORIGIN:origin,HCT_FORM_DATA_DIR:forms,HCT_FORM_ORIGINS:origin,HCT_FORM_MAIL_QUEUE_ENABLED:'false',HCT_MAIL_DELIVERY_ENABLED:'false'},stdio:'inherit'});
for(const sig of ['SIGINT','SIGTERM'])process.on(sig,()=>child.kill('SIGTERM'));
await once(child,'exit');fs.rmSync(base,{recursive:true,force:true});
