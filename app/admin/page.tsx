import { cookies } from 'next/headers';
import { COOKIE,sessionUser } from '@/lib/cms/auth.mjs';
import { readContent } from '@/lib/cms/store.mjs';
import AdminEditor from '@/components/cms/AdminEditor';
import LoginForm from './LoginForm';
export const dynamic='force-dynamic';
export const metadata={title:'HCT Content Editor',robots:{index:false,follow:false}};
export default async function AdminPage(){
 let user:string|null=null;let state;
 try{if(process.env.HCT_CMS_DATA_DIR)readContent();user=sessionUser((await cookies()).get(COOKIE)?.value);if(user)state=readContent();}catch{return <section className="max-w-4xl mx-auto px-6 pt-40 pb-20"><h1 className="text-3xl">Editor setup is not complete</h1><p className="mt-4">Ask Jeremy to check the private CMS configuration. Public content has not been changed.</p></section>;}
 return <section className="max-w-6xl mx-auto px-6 pt-40 pb-20">{user&&state?<AdminEditor initial={state}/>:<LoginForm/>}</section>;
}
