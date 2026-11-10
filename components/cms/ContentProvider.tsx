"use client";

import { createContext, useContext, type ReactNode, type ComponentProps } from "react";
import Link from "next/link";
import defaults from "@/lib/cms/defaults.json";

export type { Section as CmsSection, Post as CmsPost, ContentDocument as CmsDocument } from "@/lib/cms/types";
import type { ContentDocument as CmsDocument } from "@/lib/cms/types";
const Context = createContext<CmsDocument>(defaults as CmsDocument);
const normalize = (value:string) => value.replace(/\s+/g," ").trim();
const textIds = new Map(Object.entries(defaults.text).map(([id,value])=>[normalize(value),id]));
const linkIds = new Map(Object.entries(defaults.links).map(([id,value])=>[value,id]));
export function useContent(){return useContext(Context);}
export function ContentProvider({document,preview=false,children}:{document:CmsDocument;preview?:boolean;children:ReactNode}){
  return <Context.Provider value={document}>{preview && <div className="fixed bottom-0 inset-x-0 z-[100] bg-amber-200 text-black p-3 text-center text-sm" role="status">Draft preview. Visitors still see the published site. <button className="underline font-bold ml-3" onClick={async()=>{const r=await fetch('/admin/api/preview',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({enabled:false})});if(r.ok)location.reload();}}>Exit preview</button> <Link href="/admin" className="underline ml-3">Back to editor</Link></div>}{children}</Context.Provider>;
}
export function useText(){
 const {text}=useContent();
 return (value:string|undefined)=>{if(value===undefined)return value;const id=textIds.get(normalize(value));return id?text[id]??value:value;};
}
export function ContentText({children}:{children:ReactNode}){
  const {text}=useContent();
  if(typeof children !== 'string') return <>{children}</>;
  const id=textIds.get(normalize(children));
  return <>{id && Object.prototype.hasOwnProperty.call(text,id)?text[id]:children}</>;
}
export function safeHref(value:string){return /^(\/(?!\/)|#|https:\/\/|mailto:|tel:)/i.test(value)&& !/[\u0000-\u0020\\]/.test(value)?value:'#';}
export function CmsLink({href,...props}:ComponentProps<typeof Link>){
  const {links}=useContent();const original=typeof href==='string'?href:'';const id=linkIds.get(original);
  return <Link {...props} href={safeHref(id?links[id]??original:original)}/>;
}
export function ExtraSections({page}:{page:string}){
  const {sections}=useContent();
  return <>{(sections[page]??[]).map(section=><section key={section.id} className="bg-hct-navy py-20 border-t border-hct-silver/10"><div className="max-w-4xl mx-auto px-6 md:px-10"><h2 className="font-display text-4xl text-hct-cloud mb-6">{section.title}</h2><div className="text-hct-mist space-y-4 leading-relaxed">{section.body.split(/\n\s*\n/).map((paragraph,i)=><p className="whitespace-pre-line" key={i}>{paragraph}</p>)}</div>{section.buttonLabel&&section.buttonHref&&<Link className="inline-flex mt-8 px-6 py-3 border border-hct-silver text-hct-cloud" href={safeHref(section.buttonHref)}>{section.buttonLabel}</Link>}</div></section>)}</>;
}
