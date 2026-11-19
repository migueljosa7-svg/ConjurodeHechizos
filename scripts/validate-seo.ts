// Validación ligera para Deno: deno task test:seo
const sitemap = await Deno.readTextFile("public/sitemap.xml");
const robots = await Deno.readTextFile("public/robots.txt");
if (!sitemap.includes("<urlset")) throw new Error("sitemap.xml inválido");
if (!/^Sitemap: https?:\/\//m.test(robots)) throw new Error("robots.txt sin Sitemap");
console.log("SEO OK");
