// Genera el texto del briefing que se envía al estudio: claro, ordenado y accionable.
import { formatEUR } from "./format.ts";
import { TYPE_LABEL, type QuoteInput, type QuoteResult } from "./quote.ts";

export interface Contact {
  name: string;
  email: string;
  phone: string;
  company: string;
  date: string;
  notes: string;
}

export const isEmail = (s: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());

const yn = (b: boolean) => (b ? "Sí" : "No");
const MEAL = { none: "No incluida", bocata: "Bocadillo y bebida", menu: "Menú completo", catering: "Catering en set" } as const;

/** Lo que el cliente debe tener preparado antes del primer encuentro, según lo que ha elegido. */
export function clientChecklist(q: QuoteInput): string[] {
  const out = ["Idea o guion (aunque sea un párrafo) y 2–3 referencias visuales que os gusten."];
  if (q.type === "spot") out.push("Logo en vectorial, productos a mostrar y mensaje principal (qué quieres que la gente haga al verlo).");
  if (q.type === "videoclip") out.push("Canción en WAV/MP3 final y letra.");
  if (q.type === "edicion") out.push("Todo el material en bruto (enlace de descarga) y una referencia del ritmo deseado.");
  if (q.type !== "edicion" && q.type !== "casting") out.push("Localizaciones posibles y permisos del propietario, si ya los tienes.");
  if (q.leads + q.supporting + q.extras > 0 || q.type === "casting") out.push("Perfil de los personajes (edad, rasgos, idioma) para el casting.");
  out.push("Fechas posibles (mejor tres opciones) y fecha límite de entrega.");
  out.push("Dónde se va a emitir o publicar (TV, redes, tienda, festivales).");
  return out;
}

export function buildBrief(q: QuoteInput, r: QuoteResult, c: Contact): string {
  const L: string[] = [];
  L.push("CONJURO DE HECHIZOS · SOLICITUD DE PRESUPUESTO", "=".repeat(46), "");
  L.push("1. DATOS DE CONTACTO");
  L.push(`   Nombre:    ${c.name || "—"}`, `   Empresa:   ${c.company || "—"}`, `   Email:     ${c.email || "—"}`, `   Teléfono:  ${c.phone || "—"}`, `   Fecha deseada: ${c.date || "Por definir"}`, "");
  L.push("2. RESUMEN DEL PROYECTO");
  L.push(`   Tipo: ${TYPE_LABEL[q.type]}`);
  if (q.type !== "edicion") {
    L.push(`   Rodaje: ${q.days} día(s)${q.night ? " (con nocturnos)" : ""} en ${q.locations} localización(es)`);
    L.push(`   Equipo: trío creativo + ${q.extraCrew} técnico(s). Dron: ${yn(q.drone)} · Estabilizador: ${yn(q.gimbal)} · Iluminación: ${yn(q.lighting)} · Sonido pro: ${yn(q.proSound)} · Grúa/travelling: ${yn(q.grip)}`);
    L.push(`   Actores: ${q.leads} protagonista(s), ${q.supporting} secundario(s), ${q.extras} figurante(s). Casting: ${q.casting}`);
    L.push(`   Comidas: ${MEAL[q.meals]} · Dietas: ${yn(q.perDiem)} · ${q.km} km · ${q.nights} noche(s) de alojamiento`);
  }
  L.push(`   Postproducción: edición ${q.edit} · color ${yn(q.color)} · mezcla ${yn(q.mix)} · música ${q.music} · motion ${yn(q.motion)} · subtítulos ${yn(q.subtitles)} · ${q.extraVersions} versión(es) extra`);
  if (q.type === "spot") L.push(`   Derechos de emisión: ${q.rights}`);
  L.push(`   Entrega urgente: ${yn(q.express)}`, "");
  L.push("3. DESGLOSE ECONÓMICO (orientativo)");
  let g = "";
  for (const l of r.lines) {
    if (l.group !== g) { g = l.group; L.push(`   ${g.toUpperCase()}`); }
    L.push(`     · ${l.label.padEnd(36)} ${formatEUR(l.amount).padStart(10)}   (${l.detail})`);
  }
  L.push("", `   Subtotal ............ ${formatEUR(r.subtotal)}`, `   Imprevistos (8 %) ... ${formatEUR(r.contingency)}`, `   Base imponible ...... ${formatEUR(r.base)}`, `   IVA (21 %) .......... ${formatEUR(r.vat)}`, `   TOTAL ............... ${formatEUR(r.total)}`);
  L.push(`   Horquilla estimada (sin IVA): ${formatEUR(r.min)} – ${formatEUR(r.max)}`, "");
  L.push("4. QUÉ NECESITAMOS DE TI");
  clientChecklist(q).forEach((x, i) => L.push(`   ${i + 1}. ${x}`));
  if (c.notes.trim()) L.push("", "5. NOTAS DEL CLIENTE", `   ${c.notes.trim().replace(/\n/g, "\n   ")}`);
  L.push("", "PRÓXIMOS PASOS", "   1) Revisamos tu solicitud en 24–48 h laborables.", "   2) Te llamamos para afinar la idea y cerrar el presupuesto.", "   3) Firmamos, planificamos fechas y empezamos el conjuro.", "", "* Estimación no vinculante. El presupuesto final se confirma tras la reunión inicial.");
  return L.join("\n");
}
