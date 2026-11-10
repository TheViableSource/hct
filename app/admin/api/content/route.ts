import { defaults } from '@/lib/cms/content';
import { readContent,writeContent } from '@/lib/cms/store.mjs';
import { body,json,errorResponse,requireUser } from '@/lib/cms/http';
export const runtime='nodejs'; export const dynamic='force-dynamic';
export async function GET(){try{await requireUser();return json(readContent());}catch(e){return errorResponse(e);}}
export async function PUT(request:Request){try{const user=await requireUser();const input=await body(request);return json(writeContent(input.document,input.revision,user,defaults));}catch(e){return errorResponse(e);}}
