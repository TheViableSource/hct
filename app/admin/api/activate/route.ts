import { activateInvitation } from '@/lib/cms/auth.mjs';
import { body,json,errorResponse } from '@/lib/cms/http';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function POST(request:Request){try{const input=await body(request,2048);const username=await activateInvitation(input?.token,input?.password);return json({username});}catch(e){return errorResponse(e);}}
