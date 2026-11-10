import { getCmsContent } from "@/lib/cms/content";
import { SITE_URL } from "@/lib/constants";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const {document}=await getCmsContent();
  const routes = ["", "/about", "/community", "/donate", "/get-involved", "/blog", ...document.posts.filter(p=>p.published).map(p=>`/blog/${p.slug}`)];
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
