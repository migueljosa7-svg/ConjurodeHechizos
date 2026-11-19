// Genera public/sitemap.xml y public/robots.txt con VITE_SITE_URL (fallback al dominio de producción).
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";

let site = process.env.VITE_SITE_URL;
if (!site && existsSync(".env.local")) {
  const m = readFileSync(".env.local", "utf8").match(/^VITE_SITE_URL=(.+)$/m);
  if (m) site = m[1].trim();
}
site = (site || "https://conjurodehechizos.es").replace(/\/+$/, "");
const today = new Date().toISOString().slice(0, 10);
mkdirSync("public", { recursive: true });
writeFileSync(
  "public/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${site}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="es-ES" href="${site}/"/>
    <xhtml:link rel="alternate" hreflang="es" href="${site}/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${site}/"/>
  </url>
</urlset>
`,
);
writeFileSync("public/robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);
console.log(`[seo] sitemap.xml + robots.txt -> ${site}`);
