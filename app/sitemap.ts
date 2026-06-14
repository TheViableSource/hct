import type { MetadataRoute } from "next";

const BASE_URL = "https://hillsborocivictheater.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/community", "/donate", "/get-involved"];
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
