import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { COOKIE, checkOrigin, sessionUser } from './auth.mjs';
import { CmsError } from './schema.mjs';
export function json(data:unknown,status=200) {return NextResponse.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex, nofollow','Content-Security-Policy':"frame-ancestors 'none'"}});}
export function errorResponse(error:unknown) {return error instanceof CmsError?json({message:error.message},error.status):json({message:'The editor is not available. Ask the site administrator to check its private configuration.'},503);}
export async function requireUser() {const user=sessionUser((await cookies()).get(COOKIE)?.value);if(!user)throw new CmsError(401,'Please sign in again.');return user;}
export async function body(request:Request,max=800000):Promise<any> {
  checkOrigin(request);
  if(!/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(request.headers.get('content-type')||''))throw new CmsError(415,'Send JSON content.');
  const length=request.headers.get('content-length'); if(length && (!/^\d+$/.test(length)||Number(length)>max))throw new CmsError(413,'The content is too large.');
  if(!request.body)throw new CmsError(400,'Content required.');
  const reader=request.body.getReader(); const chunks:Uint8Array[]=[];let size=0;
  try {while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>max){await reader.cancel();throw new CmsError(413,'The content is too large.');}chunks.push(value);}}finally{reader.releaseLock();}
  try{return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(Buffer.concat(chunks)));}catch{throw new CmsError(400,'Invalid content.');}
}
