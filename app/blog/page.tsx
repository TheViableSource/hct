import Link from 'next/link';
import { getCmsContent } from '@/lib/cms/content';
import { ContentText } from '@/components/cms/ContentProvider';
import type { Metadata } from 'next';
export async function generateMetadata(): Promise<Metadata> { const {document,preview}=await getCmsContent(); return {...document.seo["/blog"], alternates:{canonical:"/blog"}, ...(preview?{robots:{index:false,follow:false}}:{})}; }
export default async function BlogPage(){
 const {document}=await getCmsContent();
 return <div className="pt-36 pb-24 max-w-5xl mx-auto px-6"><h1 className="font-display text-5xl text-hct-cloud mb-12"><ContentText>News from HCT</ContentText></h1>{document.posts.length===0?<p className="text-hct-mist"><ContentText>Our story is just getting started. Check back for news from HCT.</ContentText></p>:<div className="space-y-10">{document.posts.map(post=><article key={post.id} className="border-b border-hct-silver/20 pb-8"><h2 className="font-display text-3xl text-hct-cloud mb-3"><Link href={`/blog/${post.slug}`} className="hover:underline">{post.title}</Link></h2><p className="text-hct-mist leading-relaxed">{post.excerpt}</p><Link className="inline-block text-hct-cloud underline mt-4" href={`/blog/${post.slug}`}><ContentText>Read story</ContentText></Link></article>)}</div>}</div>;
}
