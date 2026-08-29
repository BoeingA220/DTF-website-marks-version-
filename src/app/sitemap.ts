import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

const ROUTES = [
  "",
  "/shop",
  "/gang-sheets",
  "/apparel",
  "/sublimation",
  "/stickers",
  "/posters",
  "/canvas",
  "/storefront-lettering",
  "/vinyl-printing",
  "/vehicle-wraps",
  "/pricing",
  "/about",
  "/faq",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
