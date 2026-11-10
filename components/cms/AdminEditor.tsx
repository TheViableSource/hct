"use client";
import {useEffect,useState} from 'react';
import fields from '@/lib/cms/fields.json';
import {type CmsDocument,type CmsSection,type CmsPost} from './ContentProvider';
type Snapshot={draft:CmsDocument;published:CmsDocument;revision:number};
const pages=['/','/about','/community','/donate','/get-involved'];
const input='w-full rounded border border-slate-300 p-3 bg-white text-slate-950';
const button='rounded border border-slate-400 px-4 py-2 disabled:opacity-40 hover:bg-slate-100';
export default function AdminEditor({initial}:{initial:Snapshot}){
 const [snapshot,setSnapshot]=useState(initial),[document,setDocument]=useState(initial.draft),[tab,setTab]=useState('copy'),[group,setGroup]=useState('All'),[search,setSearch]=useState(''),[page,setPage]=useState('/'),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState(false);
 const dirty=JSON.stringify(document)!==JSON.stringify(snapshot.draft);
 const unpublished=JSON.stringify(snapshot.draft)!==JSON.stringify(snapshot.published);
 useEffect(()=>{const guard=(e:BeforeUnloadEvent)=>{if(dirty){e.preventDefault();e.returnValue='';}};window.addEventListener('beforeunload',guard);return()=>window.removeEventListener('beforeunload',guard);},[dirty]);
 function update<K extends keyof CmsDocument>(key:K,value:CmsDocument[K]){setDocument(d=>({...d,[key]:value}));setMessage('');}
 async function action(kind:'save'|'publish'|'preview'){
  setBusy(true);setMessage('');setError(false);
  try{
   if(kind==='publish'&&!confirm('Publish the saved draft to the public website?'))return;
   let current=snapshot;
   if(kind==='save'||(kind==='preview'&&dirty)){
    const r=await fetch('/admin/api/content',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({document,revision:snapshot.revision})});
    if(!r.ok)throw new Error(r.status===409?'Another session changed this draft. Copy your unsaved work before reloading the editor.':r.status===401?'Your session expired. Sign in again in a new tab, then retry.':'Could not save. Check field lengths and link formats, then retry.');
    current=await r.json();setSnapshot(current);setDocument(current.draft);
   }
   if(kind==='publish'){
    const r=await fetch('/admin/api/publish',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({revision:snapshot.revision})});
    if(!r.ok)throw new Error(r.status===409?'The draft changed in another session. Reload before publishing.':'Publishing failed. Your draft has not been confirmed published.');
    current=await r.json();setSnapshot(current);setDocument(current.draft);
   }
   if(kind==='preview'){
    const r=await fetch('/admin/api/preview',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({enabled:true})});
    if(!r.ok)throw new Error('Could not enable preview. Sign in again and retry.');
    window.location.assign(page);return;
   }
   setMessage(kind==='publish'?'Published. The website now uses this content.':'Draft saved. The public website is unchanged.');
  }catch(e){setError(true);setMessage(e instanceof Error?e.message:'Request failed.');}finally{setBusy(false);}
 }
 const registry=fields as Record<string,{group:string;label:string}>;
 const groups=['All',...Array.from(new Set(Object.values(registry).map(f=>f.group))).sort()];
 function sectionChange(index:number,patch:Partial<CmsSection>){update('sections',{...document.sections,[page]:(document.sections[page]??[]).map((s,i)=>i===index?{...s,...patch}:s)});}
 function moveSection(index:number,delta:number){const next=[...(document.sections[page]??[])];[next[index],next[index+delta]]=[next[index+delta],next[index]];update('sections',{...document.sections,[page]:next});}
 function postChange(index:number,patch:Partial<CmsPost>){update('posts',document.posts.map((p,i)=>i===index?{...p,...patch}:p));}
 return <div className="min-h-screen bg-slate-50 text-slate-950 font-sans py-8 rounded"><div className="max-w-5xl mx-auto px-5">
 <h1 className="text-3xl font-bold">HCT website editor</h1><p className="mt-2 text-slate-600">Edit, save a draft, preview, then publish. Plain text only. Consent wording stays fixed. Shared wording and link destinations update everywhere they are used.</p>
 <div className="flex gap-3 flex-wrap my-6"><button className={button} disabled={busy||!dirty} onClick={()=>action('save')}>Save draft</button><button className={button} disabled={busy} onClick={()=>action('preview')}>Save & preview</button><button className="rounded bg-slate-900 text-white px-4 py-2 disabled:opacity-40" disabled={busy||dirty||!unpublished} onClick={()=>action('publish')}>Publish saved draft</button><button className={button} disabled={busy} onClick={async()=>{if(dirty&&!confirm('Discard unsaved changes and sign out?'))return;const r=await fetch('/admin/api/logout',{method:'POST'});if(r.ok)location.assign('/admin');else{setError(true);setMessage('Sign out failed. Please retry.');}}}>Sign out</button></div>
 <p className="text-sm mb-3">{busy?'Working…':dirty?'Unsaved changes':unpublished?'Saved draft has unpublished changes':'All saved changes are published'}</p>
 {message&&<p role={error?'alert':'status'} className={`p-4 mb-4 rounded ${error?'bg-red-100 text-red-900':'bg-green-100 text-green-900'}`}>{message}</p>}
 <fieldset disabled={busy}><div className="flex flex-wrap gap-2 mb-6" aria-label="Editor categories">{[['copy','Page copy'],['links','Links'],['sections','Additional sections'],['posts','Blog posts'],['seo','Search titles']].map(([value,label])=><button key={value} className={`${button} ${tab===value?'bg-slate-200 font-bold':''}`} aria-pressed={tab===value} onClick={()=>setTab(value)}>{label}</button>)}</div>
 <label className="block mb-6">Preview / sections page<select className={input} value={page} onChange={e=>setPage(e.target.value)}>{pages.map(p=><option key={p}>{p}</option>)}</select></label>
 {(tab==='copy'||tab==='links')&&<><div className="grid md:grid-cols-2 gap-4 mb-6"><label>Find text<input className={input} value={search} onChange={e=>setSearch(e.target.value)}/></label><label>Page or section<select className={input} value={group} onChange={e=>setGroup(e.target.value)}>{groups.map(g=><option key={g}>{g}</option>)}</select></label></div><div className="space-y-6">{Object.entries(tab==='copy'?document.text:document.links).filter(([id,value])=>(group==='All'||registry[id]?.group===group)&&`${value} ${registry[id]?.label}`.toLowerCase().includes(search.toLowerCase())).map(([id,value])=><label key={id} className="block"><span className="block font-semibold">{registry[id]?.group??'Shared'} · {registry[id]?.label??id}</span>{tab==='copy'?<textarea className={input} rows={value.length>100?4:2} maxLength={12000} value={value} onChange={e=>update('text',{...document.text,[id]:e.target.value})}/>:<input className={input} maxLength={2000} value={value} onChange={e=>update('links',{...document.links,[id]:e.target.value})}/>}</label>)}</div></>}
 {tab==='sections'&&<><p className="mb-4">These sections appear after the existing page content. Use blank lines between paragraphs. You can add, reorder, or remove these sections without changing the page design.</p>{(document.sections[page]??[]).map((s,i)=><fieldset key={s.id} className="border p-5 rounded mb-5 space-y-3"><legend className="font-bold">Section {i+1}</legend><label className="block">Heading<input className={input} maxLength={200} value={s.title} onChange={e=>sectionChange(i,{title:e.target.value})}/></label><label className="block">Body<textarea rows={6} className={input} maxLength={20000} value={s.body} onChange={e=>sectionChange(i,{body:e.target.value})}/></label><label className="block">Button label (optional)<input className={input} maxLength={100} value={s.buttonLabel??''} onChange={e=>sectionChange(i,{buttonLabel:e.target.value})}/></label><label className="block">Button destination<input className={input} placeholder="/get-involved or https://…" maxLength={2000} value={s.buttonHref??''} onChange={e=>sectionChange(i,{buttonHref:e.target.value})}/></label><div className="flex gap-2"><button className={button} disabled={i===0} onClick={()=>moveSection(i,-1)}>Move up</button><button className={button} disabled={i===(document.sections[page]?.length??0)-1} onClick={()=>moveSection(i,1)}>Move down</button><button className={button} onClick={()=>{if(confirm('Remove this section from the draft?'))update('sections',{...document.sections,[page]:document.sections[page].filter((_,n)=>n!==i)});}}>Remove</button></div></fieldset>)}<button className={button} onClick={()=>update('sections',{...document.sections,[page]:[...(document.sections[page]??[]),{id:crypto.randomUUID(),title:'New section',body:''}]})}>Add section</button></>}
 {tab==='posts'&&<><p className="mb-4">Posts marked visible go live only when you publish the saved website draft. Plain text body, with blank lines between paragraphs.</p>{document.posts.map((p,i)=><fieldset key={p.id} className="border p-5 rounded mb-5 space-y-3"><legend className="font-bold">{p.title||'New post'}</legend>{(['title','slug','excerpt','body'] as const).map(key=><label className="block capitalize" key={key}>{key}{key==='body'?<textarea rows={10} maxLength={40000} className={input} value={p[key]} onChange={e=>postChange(i,{[key]:e.target.value})}/>:<input className={input} maxLength={key==='slug'?100:key==='excerpt'?500:200} value={p[key]} onChange={e=>postChange(i,{[key]:e.target.value})}/>}</label>)}<p className="text-sm">Slug uses lowercase letters, numbers and hyphens, for example first-show-news.</p><label className="block"><input type="checkbox" checked={p.published} onChange={e=>postChange(i,{published:e.target.checked})}/> Visible on published site</label><button className={button} onClick={()=>{if(confirm('Remove this post from the draft?'))update('posts',document.posts.filter((_,n)=>n!==i));}}>Remove post</button></fieldset>)}<button className={button} onClick={()=>update('posts',[...document.posts,{id:crypto.randomUUID(),title:'New post',slug:`new-post-${Date.now()}`,excerpt:'',body:'',published:false}])}>Add post</button></>}
 {tab==='seo'&&<div className="space-y-6">{Object.entries(document.seo).map(([route,seo])=><fieldset key={route} className="border rounded p-4"><legend>{route}</legend>{(['title','description'] as const).map(key=><label className="block capitalize mb-3" key={key}>{key}<textarea className={input} maxLength={key==='title'?160:500} value={seo[key]} onChange={e=>update('seo',{...document.seo,[route]:{...seo,[key]:e.target.value}})}/></label>)}</fieldset>)}</div>}
 </fieldset></div></div>;
}
