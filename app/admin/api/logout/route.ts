import { cookies } from 'next/headers';
import { logout,COOKIE,PREVIEW_COOKIE,cookieOptions,checkOrigin } from '@/lib/cms/auth.mjs';
import { json,errorResponse } from '@/lib/cms/http';
export const runtime='nodejs'; export const dynamic='force-dynamic';
export async function POST(request:Request){try{checkOrigin(request);logout((await cookies()).get(COOKIE)?.value);const res=json({ok:true});for(const name of [COOKIE,PREVIEW_COOKIE])res.cookies.set(name,'',{...cookieOptions(),maxAge:0});return res;}catch(e){return errorResponse(e);}}
