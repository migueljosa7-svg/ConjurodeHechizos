// Lógica del cotizador (pura). Precios orientativos editables.
export type ServiceId = "corto" | "spot" | "videoclip" | "edicion" | "casting";

export interface Service {
  id: ServiceId;
  label: string;
  base: number;
  perDay: number;
  note: string;
}

export const SERVICES: Service[] = [
  { id: "corto", label: "Cortometraje / Largo", base: 1800, perDay: 900, note: "Dirección, fotografía, sonido directo" },
  { id: "spot", label: "Spot / Anuncio comercial", base: 900, perDay: 650, note: "Ideal para supermercados y comercios" },
  { id: "videoclip", label: "Videoclip musical", base: 1200, perDay: 750, note: "Concepto, rodaje y color" },
  { id: "edicion", label: "Edición y postproducción", base: 300, perDay: 220, note: "Montaje, color, mezcla" },
  { id: "casting", label: "Casting y dirección de actores", base: 250, perDay: 180, note: "Selección y ensayos" },
];

export interface QuoteInput {
  service: ServiceId;
  days: number;
  actors: number;
  express: boolean;
}

export function calcQuote(q: QuoteInput): { min: number; max: number } {
  const s = SERVICES.find((x) => x.id === q.service) ?? SERVICES[0];
  const days = Math.max(1, Math.min(30, Math.round(q.days) || 1));
  const actors = Math.max(0, Math.min(40, Math.round(q.actors) || 0));
  let total = s.base + s.perDay * days + actors * 60;
  if (q.express) total *= 1.25;
  return { min: Math.round((total * 0.9) / 10) * 10, max: Math.round((total * 1.15) / 10) * 10 };
}
