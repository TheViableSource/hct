export class CmsError extends Error { constructor(status, message) { super(message); this.status = status; } }
export const PAGES = ['/', '/about', '/community', '/donate', '/get-involved'];
const record = value => value && typeof value === 'object' && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;
const fail = () => { throw new CmsError(400, 'Please check the content fields.'); };
const exact = (value, required, optional = []) => { if (!record(value) || required.some(k => !(k in value)) || Object.keys(value).some(k => ![...required, ...optional].includes(k))) fail(); };
const string = (v, max, min=0) => { if (typeof v !== 'string' || v.length < min || v.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v)) fail(); return v; };
export function safeUrl(value) {
  string(value, 2000);
  if (!value) return value;
  if (/[\s\\\u0000-\u001f]/.test(value)) fail();
  if (/^\/(?!\/)/.test(value) || /^#[a-zA-Z0-9_-]+$/.test(value)) return value;
  let url; try { url = new URL(value); } catch { fail(); }
  if (!['https:', 'mailto:', 'tel:'].includes(url.protocol) || url.username || url.password) fail();
  if (url.protocol === 'https:' && !url.hostname) fail();
  return value;
}
export function validateDocument(input, defaults) {
  exact(input, ['version','text','links','sections','posts','seo']);
  if (input.version !== 1) fail();
  for (const name of ['text','links']) {
    exact(input[name], Object.keys(defaults[name]));
    for (const value of Object.values(input[name])) name === 'links' ? safeUrl(value) : string(value,12000);
  }
  exact(input.sections, PAGES);
  const ids = new Set();
  for (const list of Object.values(input.sections)) {
    if (!Array.isArray(list) || list.length > 30) fail();
    for (const section of list) {
      exact(section,['id','title','body'],['buttonLabel','buttonHref']);
      string(section.id,80,1); if (!/^[a-zA-Z0-9_-]+$/.test(section.id) || ids.has(section.id)) fail(); ids.add(section.id);
      string(section.title,200,1); string(section.body,20000);
      if (section.buttonLabel !== undefined) string(section.buttonLabel,100);
      if (section.buttonHref !== undefined) safeUrl(section.buttonHref);
      if (Boolean(section.buttonLabel) !== Boolean(section.buttonHref)) fail();
    }
  }
  if (!Array.isArray(input.posts) || input.posts.length > 100) fail();
  const slugs=new Set();
  for (const post of input.posts) {
    exact(post,['id','slug','title','excerpt','body','published']);
    string(post.id,80,1); if (!/^[a-zA-Z0-9_-]+$/.test(post.id) || ids.has(post.id)) fail(); ids.add(post.id);
    string(post.slug,100,1); if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug) || slugs.has(post.slug)) fail(); slugs.add(post.slug);
    string(post.title,200,1); string(post.excerpt,500); string(post.body,40000); if (typeof post.published !== 'boolean') fail();
  }
  exact(input.seo,Object.keys(defaults.seo));
  for (const seo of Object.values(input.seo)) { exact(seo,['title','description']); string(seo.title,160,1); string(seo.description,500); }
  if (Buffer.byteLength(JSON.stringify(input)) > 750000) fail();
  return input;
}
