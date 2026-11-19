// Proyectos DEMO: sustituye por tus producciones reales.
export type Category = "cortometraje" | "largometraje" | "videoclip" | "spot";
export type Chapter = "cine" | "disco" | "spots";

export interface Project {
  id: string;
  title: string;
  category: Category;
  chapter: Chapter;
  format: string;
  durationMin: number;
  year: number;
  hue: number;
  photo: string;
  gallery: string[];
  video?: string;
  logline: string;
  synopsis: string;
  credits: { role: string; name: string }[];
  cast: string[];
}

const credits = [
  { role: "Dirección", name: "Miembro 1" },
  { role: "Fotografía y edición", name: "Miembro 2" },
  { role: "Producción y casting", name: "Miembro 3" },
];

export const CATEGORY_LABEL: Record<Category | "todos", string> = {
  todos: "Todos",
  cortometraje: "Cortometrajes",
  largometraje: "Largometrajes",
  videoclip: "Videoclips & Sello",
  spot: "Spots & Empresas",
};

export const CHAPTERS: { id: Chapter; label: string }[] = [
  { id: "cine", label: "Cortos & Cine" },
  { id: "disco", label: "Discográfica & Clips" },
  { id: "spots", label: "Spots & Marcas" },
];

export const PROJECTS: Project[] = [
  { id: "la-ultima-toma", photo: "/media/p1.jpg", gallery: ["/media/p3.jpg", "/media/p5.jpg", "/media/p1.jpg"], title: "La última toma", category: "cortometraje", chapter: "cine", format: "2K · 2.39:1", durationMin: 14, year: 2025, hue: 42, logline: "Un técnico de sonido oye algo que no estaba en el guion.", synopsis: "Durante el último día de rodaje de una película de terror rural, el técnico de sonido descubre una voz en las grabaciones que nadie ha pronunciado.", credits, cast: ["Actor/Actriz 1", "Actor/Actriz 2", "Actor/Actriz 3"] },
  { id: "pueblo-sin-mapa", photo: "/media/p4.jpg", gallery: ["/media/p2.jpg", "/media/p6.jpg", "/media/p4.jpg"], title: "Pueblo sin mapa", category: "largometraje", chapter: "cine", format: "4K · 2.39:1", durationMin: 92, year: 2026, hue: 18, logline: "Un cartógrafo vuelve a un pueblo aragonés que ya no existe.", synopsis: "Una road movie íntima por el Aragón vaciado, rodada con equipo mínimo y vecinos como reparto coral.", credits, cast: ["Actor/Actriz 1", "Actor/Actriz 2", "Vecinos de la comarca"] },
  { id: "hojas-de-sal", photo: "/media/p3.jpg", gallery: ["/media/p4.jpg", "/media/p1.jpg", "/media/p3.jpg"], title: "Hojas de sal", category: "cortometraje", chapter: "cine", format: "4K · 1.85:1", durationMin: 9, year: 2024, hue: 200, logline: "Dos hermanas heredan una salina y un secreto.", synopsis: "Un retrato sensorial sobre la herencia, el silencio y el trabajo de la tierra.", credits, cast: ["Actor/Actriz 1", "Actor/Actriz 2"] },
  { id: "luz-de-neon", photo: "/media/p2.jpg", gallery: ["/media/p8.jpg", "/media/p6.jpg", "/media/p2.jpg"], title: "Luz de neón", category: "videoclip", chapter: "disco", format: "4K · 16:9", durationMin: 4, year: 2025, hue: 320, logline: "Videoclip nocturno para una banda de synth-pop zaragozana.", synopsis: "Planos largos, neón y coreografía mínima. Producido para nuestro sello discográfico.", credits, cast: ["Banda invitada"] },
  { id: "ecos-del-ebro", photo: "/media/p8.jpg", gallery: ["/media/p4.jpg", "/media/p3.jpg", "/media/p8.jpg"], title: "Ecos del Ebro", category: "videoclip", chapter: "disco", format: "4K · 2.39:1", durationMin: 5, year: 2026, hue: 160, logline: "Folk electrónico junto al río.", synopsis: "Una pieza de atmósfera para el primer EP del sello.", credits, cast: ["Artista del sello"] },
  { id: "fresco-cada-dia", photo: "/media/p7.jpg", gallery: ["/media/p2.jpg", "/media/p1.jpg", "/media/p7.jpg"], title: "Fresco cada día", category: "spot", chapter: "spots", format: "FHD · 16:9 y 9:16", durationMin: 1, year: 2026, hue: 95, logline: "Spot de 30 s para un supermercado de barrio.", synopsis: "Campaña para TV local y redes: producto, cercanía y humor. Versiones 16:9 y vertical.", credits, cast: ["Vecinos y personal de la tienda"] },
  { id: "el-comercio-late", photo: "/media/p6.jpg", gallery: ["/media/p2.jpg", "/media/p7.jpg", "/media/p6.jpg"], title: "El comercio late", category: "spot", chapter: "spots", format: "4K · 16:9", durationMin: 2, year: 2025, hue: 28, logline: "Pieza corporativa para el comercio local.", synopsis: "Retrato cinematográfico de tres negocios familiares de Aragón.", credits, cast: ["Comerciantes locales"] },
  { id: "sombras-de-papel", photo: "/media/p5.jpg", gallery: ["/media/p3.jpg", "/media/p1.jpg", "/media/p5.jpg"], title: "Sombras de papel", category: "cortometraje", chapter: "cine", format: "2K · 4:3", durationMin: 12, year: 2023, hue: 265, logline: "Una autora y su personaje se niegan a despedirse.", synopsis: "Metaficción en blanco y negro, rodada en una sola localización.", credits, cast: ["Actor/Actriz 1", "Actor/Actriz 2"] },
];
