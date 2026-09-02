import type { MetadataRoute } from "next";

/**
 * ANTIDOTE is a private, single-user application: everything behind
 * authentication must stay out of search indexes. Only the landing page
 * and login screen are public.
 */
const PRIVATE_ROUTES = [
  "/home",
  "/dashboard",
  "/today",
  "/tasks",
  "/projects",
  "/goals",
  "/finances",
  "/freelance",
  "/clients",
  "/opportunities",
  "/notes",
  "/habits",
  "/routines",
  "/calendar",
  "/reviews",
  "/energy",
  "/decisions",
  "/brain-dump",
  "/agent",
  "/analytics",
  "/marriage",
  "/relationship",
  "/settings",
  "/guide",
  "/auth",
];

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://smart-antidote.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login"],
        disallow: PRIVATE_ROUTES,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
