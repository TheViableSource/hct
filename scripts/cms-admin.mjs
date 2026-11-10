// Production provisioning requires explicit authorization. Never pass passwords as arguments.
import fs from 'node:fs';
import path from 'node:path';
import {DatabaseSync} from 'node:sqlite';
import { openCms,readContent,privateDirectory } from '../lib/cms/store.mjs';
import { createUser, createInvitation, cmsOrigin } from '../lib/cms/auth.mjs';
const defaults=JSON.parse(fs.readFileSync(new URL('../lib/cms/defaults.json',import.meta.url),'utf8'));
const [command,username]=process.argv.slice(2);
try {
 if(command==='init') {const {db}=openCms({initialize:true,defaults});db.close();console.log('CMS store initialized or verified. No user created.');}
 else if(command==='check'){const {db}=openCms();try{console.log(JSON.stringify({integrity:db.prepare('PRAGMA integrity_check').get().integrity_check,users:db.prepare('SELECT count(*) n FROM users').get().n,revision:readContent().revision}));}finally{db.close();}}
 else if(command==='backup'){
  const target=username;if(!target||!path.isAbsolute(target)||path.resolve(target)!==target)throw new Error('Absolute private backup path required');privateDirectory(path.dirname(target));
  const fd=fs.openSync(target,fs.constants.O_CREAT|fs.constants.O_EXCL|fs.constants.O_WRONLY|fs.constants.O_NOFOLLOW,0o600);fs.closeSync(fd);
  const {db}=openCms();try{db.exec("VACUUM INTO '"+target.replaceAll("'","''")+"'");}finally{db.close();}
  const copy=new DatabaseSync(target);try{if(copy.prepare('PRAGMA integrity_check').get().integrity_check!=='ok')throw new Error('Bad backup');}finally{copy.close();}
  const sync=fs.openSync(target,fs.constants.O_RDONLY|fs.constants.O_NOFOLLOW);fs.fsyncSync(sync);fs.closeSync(sync);console.log('Private CMS backup created and integrity verified.');
 }
 else if(command==='invite'){const token=createInvitation(username);console.log(cmsOrigin()+'/admin/activate#'+token);}
 else if(command==='create-user'){
  if(process.stdin.isTTY)throw new Error('Use approved secure stdin input. Passwords must not appear in command arguments or output.');
  let data='';for await(const chunk of process.stdin){data+=chunk;if(data.length>1024)throw new Error('Input too long');}
  const password=data.replace(/\r?\n$/,'');await createUser(username,password);console.log('CMS editor account created. Password was not printed.');
 }else throw new Error('Usage: cms-admin.mjs init | check | backup ABSOLUTE_PRIVATE_PATH | invite USERNAME | create-user USERNAME (password on secure stdin)');
}catch{console.error('CMS administration failed. Check the approved private directory, schema and secure input. No credentials are printed.');process.exitCode=1;}
