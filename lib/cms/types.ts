export type Section = { id: string; title: string; body: string; buttonLabel?: string; buttonHref?: string };
export type Post = { id: string; slug: string; title: string; excerpt: string; body: string; published: boolean };
export type ContentDocument = { version: 1; text: Record<string, string>; links: Record<string, string>; sections: Record<string, Section[]>; posts: Post[]; seo: Record<string, { title: string; description: string }> };
export type ContentState = { draft: ContentDocument; published: ContentDocument; revision: number };
