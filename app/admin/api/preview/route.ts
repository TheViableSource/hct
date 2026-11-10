import { PREVIEW_COOKIE,cookieOptions } from '@/lib/cms/auth.mjs';
import { body,json,errorResponse,requireUser } from '@/lib/cms/http';
import { CmsError } from '@/lib/cms/schema.mjs';
export const runtime='nodejs'; export const dynamic='force-dynamic';
export async function POST(request:Request){try{await requireUser();const input=await body(request,256);if(typeof input.enabled!=='boolean')throw new CmsError(400,'Choose preview mode.');const res=json({ok:true});res.cookies.set(PREVIEW_COOKIE,input.enabled?'1':'',{...cookieOptions(),maxAge:input.enabled?3600:0});return res;}catch(e){return errorResponse(e);}}
