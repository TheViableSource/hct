import 'server-only';
import { cookies } from 'next/headers';
import defaultsData from './defaults.json';
import type { ContentDocument } from './types';
import { readContent } from './store.mjs';
import { COOKIE, PREVIEW_COOKIE, sessionUser } from './auth.mjs';
export const defaults = defaultsData as ContentDocument;
export async function getCmsContent(): Promise<{document:ContentDocument;preview:boolean}> {
  // Reading cookies keeps public rendering dynamic, so publishing needs no rebuild.
  const jar=await cookies();
  if(!process.env.HCT_CMS_DATA_DIR)return {document:defaults,preview:false};
  let state;
  try { state=readContent(); } catch {
    console.error("HCT CMS unavailable; serving the immutable baseline. Editor writes remain disabled.");
    return {document:defaults,preview:false};
  }
  const preview=jar.get(PREVIEW_COOKIE)?.value==='1' && Boolean(sessionUser(jar.get(COOKIE)?.value));
  const document=preview?state.draft:state.published;
  return {document:{...document,posts:preview?document.posts:document.posts.filter(post=>post.published)},preview};
}
