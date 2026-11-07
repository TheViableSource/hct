export const CONSENT_TEXT = 'Yes, you may add me to the HCT newsletter. I can ask to leave the list at any time.';
export const CONSENT_VERSION = '2026-11-07';
export const INVOLVEMENT = ['Performer (singer/actor/dancer)', 'Musician / Orchestra', 'Director / Choreographer / Music Director', 'Production / Crew / Design', 'Volunteer', 'Audience Member / Supporter'];
export const INTENTS = ['Become a Founding Sponsor', 'Make a Donation', 'Perform (singer / actor / dancer)', 'Play in the Orchestra', 'Join as a Director / Choreographer / Music Director', 'Volunteer My Time', 'Offer In-Kind Support or Services', 'Just stay informed for now'];
export const SPONSOR_LEVELS = ['Community Sponsor ($250–$999)', 'Production Sponsor ($1,000–$4,999)', 'Season Sponsor ($5,000–$9,999)', 'Title Sponsor ($10,000+)', 'Not sure yet', 'N/A'];
export class FormFailure extends Error { constructor(status, message) { super(message); this.status = status; } }
export function validate(input) {
  const bad = () => { throw new FormFailure(400, 'Please check the form and try again.'); };
  if (!input || typeof input !== 'object' || Array.isArray(input)) bad();
  const source = { newsletter: '/', community: '/community', 'get-involved': '/get-involved' };
  if (typeof input.form !== "string" || !Object.hasOwn(source, input.form)) bad();
  const fields = input.form === 'newsletter' ? [] : input.form === 'community' ? ['name', 'cityZip', 'involvement', 'about'] : ['firstName', 'lastName', 'phone', 'organization', 'intent', 'sponsorLevel', 'about'];
  if (Object.keys(input).some(k => !['form', 'email', 'newsletterConsent', 'website', 'requestId', ...fields].includes(k))) bad();
  if (typeof input.newsletterConsent !== 'boolean' || input.website !== '' || typeof input.requestId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.requestId)) bad();
  if (input.form === 'newsletter' && !input.newsletterConsent) throw new FormFailure(400, 'Please check the newsletter box to join the list.');
  const data = {};
  for (const key of ['email', ...fields]) {
    const value = input[key];
    if (key === 'involvement' || key === 'intent') {
      const options = key === 'involvement' ? INVOLVEMENT : INTENTS;
      if (!Array.isArray(value) || value.length > options.length || new Set(value).size !== value.length || value.some(v => !options.includes(v))) bad();
      data[key] = value;
    } else {
      if (typeof value !== 'string' || value.length > (key === 'about' ? 4000 : key === 'email' ? 254 : 200) || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) bad();
      data[key] = value.trim();
      if (['email', 'name', 'firstName', 'lastName'].includes(key) && !data[key]) bad();
      if (key !== 'about' && /[\r\n]/.test(value)) bad();
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) bad();
  data.email = data.email.toLowerCase();
  if ('sponsorLevel' in data && data.sponsorLevel !== '' && !SPONSOR_LEVELS.includes(data.sponsorLevel)) bad();
  return { form: input.form, sourcePath: source[input.form], requestId: input.requestId, newsletterConsent: input.newsletterConsent, fields: data };
}
