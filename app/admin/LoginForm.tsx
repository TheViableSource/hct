'use client';
import { useState } from 'react';
export default function LoginForm(){
 const [message,setMessage]=useState(''); const [busy,setBusy]=useState(false);
 return <form className="max-w-md mx-auto space-y-5" onSubmit={async event=>{event.preventDefault();if(busy)return;setBusy(true);setMessage('');const data=new FormData(event.currentTarget);try{const response=await fetch('/admin/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:data.get('username'),password:data.get('password')})});const result=await response.json();if(!response.ok)throw new Error(result.message);window.location.assign('/admin');}catch(error){setMessage(error instanceof Error?error.message:'Could not sign in.');setBusy(false);}}}>
 <h1 className="text-4xl font-display">HCT content editor</h1><p className="text-sm">Sign in to edit pages, add sections, and publish news.</p>
 <label className="block">Username<input name="username" autoComplete="username" required maxLength={100} className="block w-full mt-2 bg-white text-slate-900 rounded p-3" /></label>
 <label className="block">Password<input name="password" type="password" autoComplete="current-password" required maxLength={256} className="block w-full mt-2 bg-white text-slate-900 rounded p-3" /></label>
 {message&&<p role="alert" className="text-rose-200">{message}</p>}<button disabled={busy} className="rounded bg-white text-slate-900 px-5 py-3 disabled:opacity-50">{busy?'Signing in…':'Sign in'}</button>
 <p className="text-sm">Need access or a password reset? Contact Jeremy. Passwords are not sent by email.</p>
 </form>;
}
