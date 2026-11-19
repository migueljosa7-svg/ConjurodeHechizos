// Datos centrales del sitio: edita aquí.
export const FALLBACK_SITE_URL = "https://conjurodehechizos.es";
export const SITE_URL: string = (import.meta.env.VITE_SITE_URL || FALLBACK_SITE_URL).replace(/\/+$/, "");
export const CONTACT_EMAIL: string = import.meta.env.VITE_CONTACT_EMAIL || "hola@conjurodehechizos.es";
export const GA_ID: string = import.meta.env.VITE_GA_MEASUREMENT_ID || "";
export const ADSENSE_CLIENT: string = import.meta.env.VITE_ADSENSE_CLIENT || "";

export const SITE = {
  name: "Conjuro de Hechizos",
  tagline: "Cine, música y marcas contadas con magia.",
  description:
    "Trío creativo de Aragón: cortometrajes, largometrajes, videoclips, sello discográfico y spots para empresas, supermercados y comercios.",
};

export const TRIO = [
  { name: "Dirección", role: "Guion y puesta en escena" },
  { name: "Fotografía & Edición", role: "Imagen, montaje y color" },
  { name: "Producción & Casting", role: "Actores, localizaciones y producción" },
];

export const SERVICES_LIST = [
  "Cortometrajes y largometrajes",
  "Videoclips y sello discográfico",
  "Spots para empresas, supermercados y comercios",
  "Edición y postproducción",
  "Dirección y casting de actores",
];
