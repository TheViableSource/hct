import { login, COOKIE, cookieOptions } from '@/lib/cms/auth.mjs';
import { body, json, errorResponse } from '@/lib/cms/http';
export const runtime='nodejs'; export const dynamic='force-dynamic';
export async function POST(request:Request){try{const input=await body(request,2048);const token=await login(input?.username,input?.password);const res=json({ok:true});res.cookies.set(COOKIE,token,cookieOptions());return res;}catch(e){return errorResponse(e);}}
