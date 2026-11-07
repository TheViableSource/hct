import { FormFailure, validate } from './schema.mjs';
import { saveSubmission } from './store.mjs';
const LIMIT = 16384;
export async function handleForm(request) {
  const response = (status, message) => Response.json({ message }, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
  if (request.method !== 'POST') return response(405, 'Use POST.');
  try {
    const origins = (process.env.HCT_FORM_ORIGINS || '').split(',').map(value => value.trim());
    if (!origins.length || origins.some(origin => !origin || new URL(origin).origin !== origin || !['https:', 'http:'].includes(new URL(origin).protocol))) throw new Error('Expected origins required');
    if (!origins.includes(request.headers.get('origin')) || (request.headers.get('sec-fetch-site') && request.headers.get('sec-fetch-site') !== 'same-origin')) throw new FormFailure(403, 'Please send this form from our website.');
    if (!/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(request.headers.get('content-type') || '')) throw new FormFailure(415, 'Please use the website form.');
    const length = request.headers.get('content-length');
    if (length && (!/^\d+$/.test(length) || Number(length) > LIMIT)) throw new FormFailure(413, 'Your message is too long. Please shorten it.');
    if (!request.body) throw new FormFailure(400, 'Please check the form.');
    const reader = request.body.getReader();
    const chunks = []; let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > LIMIT) { await reader.cancel(); throw new FormFailure(413, 'Your message is too long. Please shorten it.'); }
        chunks.push(value);
      }
    } finally { reader.releaseLock(); }
    let input;
    try { input = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks))); }
    catch { throw new FormFailure(400, 'Please check the form.'); }
    saveSubmission(validate(input));
    return response(200, 'Your form was saved. Thank you.');
  } catch (error) {
    return error instanceof FormFailure ? response(error.status, error.message) : response(503, 'We could not save your form. Please try again later.');
  }
}
