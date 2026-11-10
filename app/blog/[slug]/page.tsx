import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCmsContent } from '@/lib/cms/content';
import { ContentText } from '@/components/cms/ContentProvider';
import type { Metadata } from 'next';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;
 const {document,preview}=await getCmsContent(); const post=document.posts.find(p=>p.slug===slug);
 return post?{title:post.title,description:post.excerpt,alternates:{canonical:`/blog/${post.slug}`},...(preview?{robots:{index:false,follow:false}}:{})}:{title:'Story not found'};
}
export default async function BlogPostPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const post=(await getCmsContent()).document.posts.find(p=>p.slug===slug);if(!post)notFound();
 return <article className="max-w-3xl mx-auto px-6 pt-36 pb-24"><Link href="/blog" className="text-hct-silver underline"><ContentText>Back to news</ContentText></Link><h1 className="font-display text-5xl text-hct-cloud my-8">{post.title}</h1><p className="text-xl text-hct-silver mb-10">{post.excerpt}</p><div className="text-hct-mist leading-relaxed space-y-5">{post.body.split(/\n\s*\n/).map((paragraph,index)=><p className="whitespace-pre-line" key={index}>{paragraph}</p>)}</div></article>;
}
