import { PROJECTS } from "../data/projects.ts";
import { CONTACT_EMAIL, SITE, SITE_URL } from "../data/site.ts";

export default function SchemaOrg() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": `${SITE_URL}/#org`,
        name: SITE.name,
        url: SITE_URL,
        logo: `${SITE_URL}/icon.svg`,
        image: `${SITE_URL}/og-image.svg`,
        description: SITE.description,
        email: CONTACT_EMAIL,
        areaServed: { "@type": "AdministrativeArea", name: "Aragón" },
        address: { "@type": "PostalAddress", addressRegion: "Aragón", addressCountry: "ES" },
        knowsAbout: ["Cortometrajes", "Largometrajes", "Videoclips", "Spots publicitarios", "Casting de actores", "Edición de vídeo"],
      },
      {
        "@type": "ItemList",
        name: "Producciones de Conjuro de Hechizos",
        itemListElement: PROJECTS.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item:
            p.category === "cortometraje" || p.category === "largometraje"
              ? {
                  "@type": "Movie",
                  name: p.title,
                  description: p.synopsis,
                  dateCreated: String(p.year),
                  duration: `PT${p.durationMin}M`,
                  genre: p.category,
                  productionCompany: { "@id": `${SITE_URL}/#org` },
                }
              : {
                  "@type": "VideoObject",
                  name: p.title,
                  description: p.synopsis,
                  uploadDate: `${p.year}-01-01`,
                  duration: `PT${p.durationMin}M`,
                  thumbnailUrl: `${SITE_URL}/og-image.svg`,
                  publisher: { "@id": `${SITE_URL}/#org` },
                },
        })),
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />;
}
