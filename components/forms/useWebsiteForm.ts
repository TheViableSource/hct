"use client";
import { useRef, useState } from 'react';
export function useWebsiteForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const requestId = useRef<string>();
  const pending = useRef(false);
  async function submit(data: Record<string, unknown>) {
    if (pending.current) return;
    pending.current = true;
    requestId.current ??= crypto.randomUUID();
    setStatus('submitting'); setError('');
    try {
      const res = await fetch('/api/forms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, requestId: requestId.current }) });
      if (!res.ok) {
        const result = await res.json();
        setError(typeof result.message === 'string' ? result.message : 'We could not save your form. Please try again.');
        // A rejected request was not stored. A network/503 error may have committed, so keep its key.
        if ([400, 403, 409, 413, 415, 429].includes(res.status)) requestId.current = undefined;
        setStatus('error');
      } else setStatus('success');
    } catch { setError('We could not confirm your form was saved. Please try again.'); setStatus('error'); }
    finally { pending.current = false; }
  }
  return { status, submit, error };
}
