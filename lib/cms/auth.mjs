import { randomBytes, createHash, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { openCms } from './store.mjs';
import { CmsError } from './schema.mjs';
const scrypt=promisify(scryptCallback);
const hashToken=token=>createHash('sha256').update(token).digest('hex');
export const COOKIE='hct_cms_session';
export const PREVIEW_COOKIE='hct_cms_preview';
export const SESSION_SECONDS=8*60*60;
export function cmsOrigin() {
  const origin=process.env.HCT_CMS_ORIGIN; let url;
  try{url=new URL(origin);}catch{throw new Error('CMS origin required');}
  if(url.origin!==origin || (url.protocol!=='https:' && !(url.protocol==='http:' && ['localhost','127.0.0.1'].includes(url.hostname))))throw new Error('Invalid CMS origin');
  return origin;
}
export function cookieOptions() {return {httpOnly:true,secure:cmsOrigin().startsWith('https:'),sameSite:'strict',path:'/',maxAge:SESSION_SECONDS};}
export function checkOrigin(request) {
  if(request.headers.get('origin')!==cmsOrigin() || (request.headers.get('sec-fetch-site') && request.headers.get('sec-fetch-site')!=='same-origin'))throw new CmsError(403,'Open the editor on this website.');
}
export async function createUser(username,password,options) {
  if(typeof username!=='string'||!/^[a-zA-Z0-9@._+-]{3,100}$/.test(username)||typeof password!=='string'||password.length<16||password.length>256)throw new CmsError(400,'Use a valid username and a password of at least 16 characters.');
  const salt=randomBytes(24).toString('hex'); const hash=(await scrypt(password,salt,64)).toString('hex');
  const {db}=openCms(options);try{db.prepare('INSERT INTO users VALUES(?,?,?)').run(username.toLowerCase(),salt,hash);}finally{db.close();}
}
export async function login(username,password,options) {
  if(typeof username!=='string'||username.length>100||typeof password!=='string'||password.length>256)throw new CmsError(401,'Sign-in details were not accepted.');
  username=username.toLowerCase(); const now=Date.now(); const {db}=openCms(options);let user;
  try {
    db.exec('BEGIN IMMEDIATE');
    db.prepare('DELETE FROM attempts WHERE attempted<?').run(now-900000);
    db.prepare('DELETE FROM sessions WHERE expires<?').run(now);
    const local=db.prepare('SELECT count(*) n FROM attempts WHERE username=?').get(username).n;
    const total=db.prepare('SELECT count(*) n FROM attempts').get().n;
    if(local>=5||total>=100)throw new CmsError(429,'Too many sign-in attempts. Wait 15 minutes and try again.');
    db.prepare('INSERT INTO attempts VALUES(?,?)').run(username,now);
    user=db.prepare('SELECT * FROM users WHERE username=?').get(username);
    db.exec('COMMIT');
  }catch(e){try{db.exec('ROLLBACK');}catch{}db.close();throw e;}
  try {
    const hash=await scrypt(password,user?.salt||'unconfigured-account-salt',64);
    const expected=Buffer.from(user?.hash||'00'.repeat(64),'hex');
    if(!timingSafeEqual(hash,expected)||!user)throw new CmsError(401,'Sign-in details were not accepted.');
    const token=randomBytes(32).toString('base64url');
    db.exec('BEGIN IMMEDIATE');
    if(db.prepare('SELECT count(*) n FROM sessions WHERE username=?').get(username).n>=20)throw new CmsError(429,'Too many active sessions. Sign out elsewhere or wait for them to expire.');
    db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(hashToken(token),username,now+SESSION_SECONDS*1000);
    db.prepare('DELETE FROM attempts WHERE username=?').run(username);
    db.exec('COMMIT');return token;
  }catch(e){try{db.exec('ROLLBACK');}catch{}throw e;}finally{db.close();}
}
export function sessionUser(token,options) {
  if(!token || typeof token!=='string' || !/^[a-zA-Z0-9_-]{43}$/.test(token))return null;
  const {db}=openCms(options);try{return db.prepare('SELECT username FROM sessions WHERE token_hash=? AND expires>?').get(hashToken(token),Date.now())?.username||null;}finally{db.close();}
}
export function logout(token,options) {if(!token)return;const {db}=openCms(options);try{db.prepare('DELETE FROM sessions WHERE token_hash=?').run(hashToken(token));}finally{db.close();}}

export function createInvitation(username, options) {
  if(typeof username!=='string'||!/^[a-zA-Z0-9@._+-]{3,100}$/.test(username))throw new CmsError(400,'Invalid editor username.');
  username=username.toLowerCase();const token=randomBytes(32).toString('base64url');const {db}=openCms(options);
  try{db.exec('BEGIN IMMEDIATE');if(db.prepare('SELECT username FROM users WHERE username=?').get(username))throw new CmsError(409,'This editor already exists.');
    db.prepare('DELETE FROM invitations WHERE username=?').run(username);
    db.prepare('INSERT INTO invitations VALUES(?,?,?)').run(hashToken(token),username,Date.now()+48*3600000);db.exec('COMMIT');return token;
  }catch(e){try{db.exec('ROLLBACK')}catch{}throw e;}finally{db.close();}
}
export async function activateInvitation(token,password,options) {
  if(typeof token!=='string'||!/^[a-zA-Z0-9_-]{43}$/.test(token)||typeof password!=='string'||password.length<16||password.length>256)throw new CmsError(400,'Use a valid setup link and a password with at least 16 characters.');
  const tokenHash=hashToken(token);const {db}=openCms(options);
  try{
    const invite=db.prepare('SELECT * FROM invitations WHERE token_hash=? AND expires>?').get(tokenHash,Date.now());
    if(!invite)throw new CmsError(400,'This setup link is invalid, expired or already used. Ask Jeremy for help.');
    const salt=randomBytes(24).toString('hex');const hash=(await scrypt(password,salt,64)).toString('hex');
    db.exec('BEGIN IMMEDIATE');
    const current=db.prepare('SELECT * FROM invitations WHERE token_hash=? AND expires>?').get(tokenHash,Date.now());
    if(!current)throw new CmsError(400,'This setup link is invalid, expired or already used. Ask Jeremy for help.');
    db.prepare('INSERT INTO users VALUES(?,?,?)').run(current.username,salt,hash);
    db.prepare('DELETE FROM invitations WHERE token_hash=?').run(tokenHash);db.exec('COMMIT');return current.username;
  }catch(e){try{db.exec('ROLLBACK')}catch{}throw e;}finally{db.close();}
}
