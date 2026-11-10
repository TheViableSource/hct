import { defaults } from '@/lib/cms/content';
import { publishContent } from '@/lib/cms/store.mjs';
import { body,json,errorResponse,requireUser } from '@/lib/cms/http';
export const runtime='nodejs'; export const dynamic='force-dynamic';
export async function POST(request:Request){try{const user=await requireUser();const input=await body(request,256);return json(publishContent(input.revision,user,defaults));}catch(e){return errorResponse(e);}}
