// Contenido DEMO editable (cifras, testimonios, festivales, redes).
export const MARQUEE = ["Cortometrajes", "Largometrajes", "Videoclips", "Spots", "Casting", "Edición", "Aragón"];

export const STATS = [
  { n: 40, suffix: "+", label: "Piezas producidas" },
  { n: 12, suffix: "", label: "Festivales y selecciones" },
  { n: 25, suffix: "+", label: "Marcas y comercios" },
  { n: 3, suffix: "", label: "Creativos, una visión" },
];

export const TESTIMONIALS = [
  { q: "Nos entendieron a la primera. El spot dobló las visitas a la tienda en un mes.", by: "Responsable de marketing", org: "Supermercado local (demo)" },
  { q: "Dirigieron a mis actores con una delicadeza enorme. El corto se vio en tres festivales.", by: "Autora y guionista", org: "Cine independiente (demo)" },
  { q: "Del concepto al videoclip en tres semanas, y sonaba y se veía de otro nivel.", by: "Cantante", org: "Artista emergente (demo)" },
];

export const LAURELS = ["Selección oficial", "Mejor corto aragonés", "Premio del público", "Finalista videoclip", "Mención de la crítica"];

export const SOCIALS: { name: string; url: string }[] = [
  { name: "Instagram", url: import.meta.env.VITE_INSTAGRAM || "" },
  { name: "YouTube", url: import.meta.env.VITE_YOUTUBE || "" },
  { name: "Vimeo", url: import.meta.env.VITE_VIMEO || "" },
];

/** Número en formato internacional sin "+" (ej. 34600123456). Vacío = sin botón de WhatsApp. */
export const WHATSAPP: string = import.meta.env.VITE_WHATSAPP || "";
