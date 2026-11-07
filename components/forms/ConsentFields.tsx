"use client";
import { CONSENT_TEXT } from '@/lib/forms/schema.mjs';
export default function ConsentFields({ disabled, required = false }: { disabled: boolean; required?: boolean }) {
  return <div className="space-y-3">
    <label className="flex min-h-11 items-start gap-3 text-sm text-hct-mist font-body cursor-pointer">
      <input className="mt-1 h-5 w-5 shrink-0 accent-hct-silver" type="checkbox" name="newsletterConsent" required={required} disabled={disabled} />
      <span>{CONSENT_TEXT}{!required && ' (optional)'}</span>
    </label>
    <p className="text-xs text-hct-silver font-body">We save this form on our website so our team can review it. Please do not include private financial or health details.</p>
    <div aria-hidden="true" className="hidden">
      <label>Leave this blank<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
    </div>
  </div>;
}
