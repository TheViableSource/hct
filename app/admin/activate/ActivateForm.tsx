'use client';
import {useEffect,useState,useRef} from 'react';
export default function ActivateForm(){
 const token=useRef('');const initialized=useRef(false);const [ready,setReady]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[username,setUsername]=useState('');
 useEffect(()=>{if(initialized.current)return;initialized.current=true;token.current=window.location.hash.slice(1);history.replaceState(null,'','/admin/activate');setReady(Boolean(token.current));},[]);
 if(username)return <div className="space-y-5"><h1 className="font-display text-4xl">Your editor access is ready</h1><p>Sign in with {username} and the password you just chose.</p><a href="/admin" className="underline">Open the content editor</a></div>;
 return <form className="space-y-5" onSubmit={async event=>{event.preventDefault();if(busy)return;const data=new FormData(event.currentTarget);if(data.get('password')!==data.get('confirm')){setMessage('The passwords do not match.');return;}setBusy(true);setMessage('');try{const r=await fetch('/admin/api/activate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:token.current,password:data.get('password')})});const value=await r.json();if(!r.ok)throw new Error(value.message);token.current='';setUsername(value.username);}catch(error){setMessage(error instanceof Error?error.message:'Setup did not finish. Please retry.');}finally{setBusy(false);}}}>
 <h1 className="font-display text-4xl">Set up your HCT editor access</h1><p>Choose a unique password with at least 16 characters. Save it in your password manager. This setup link works once and expires after 48 hours.</p>
 {!ready&&<p role="alert">Open the complete setup link from your invitation. If you have already used it, sign in at /admin.</p>}
 <label className="block">New password<input type="password" name="password" minLength={16} maxLength={256} autoComplete="new-password" required className="block w-full mt-2 p-3 rounded text-slate-900 bg-white"/></label>
 <label className="block">Confirm password<input type="password" name="confirm" minLength={16} maxLength={256} autoComplete="new-password" required className="block w-full mt-2 p-3 rounded text-slate-900 bg-white"/></label>
 {message&&<p role="alert" className="text-rose-200">{message}</p>}<button disabled={!ready||busy} className="rounded px-5 py-3 bg-white text-slate-900 disabled:opacity-50">{busy?'Setting up…':'Create my editor access'}</button><p className="text-sm">If setup finished but this page was interrupted, <a href="/admin" className="underline">try signing in</a> with your new password.</p>
 </form>;
}
