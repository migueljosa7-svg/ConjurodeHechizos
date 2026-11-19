// Utilidades puras (estándares web, sin APIs de Node) — compatibles con Deno.
export const pad2 = (n: number): string => String(Math.floor(n)).padStart(2, "0");

/** Timecode SMPTE HH:MM:SS:FF desde milisegundos. */
export function timecode(ms: number, fps = 24): string {
  const totalSec = Math.floor(ms / 1000);
  const frames = Math.floor(((ms % 1000) / 1000) * fps);
  return `${pad2(totalSec / 3600)}:${pad2((totalSec / 60) % 60)}:${pad2(totalSec % 60)}:${pad2(frames)}`;
}

export const formatEUR = (n: number): string =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export const formatDuration = (min: number): string =>
  min >= 60 ? `${Math.floor(min / 60)} h ${pad2(min % 60)} min` : `${min} min`;

export const clamp = (v: number, a: number, b: number): number => Math.min(b, Math.max(a, v));
