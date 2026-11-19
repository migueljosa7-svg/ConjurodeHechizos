// Motor del cotizador (puro, sin dependencias). Todas las tarifas son EDITABLES en RATES.
export type ProjectType = "corto" | "largo" | "spot" | "videoclip" | "edicion" | "casting";
export type MealPlan = "none" | "bocata" | "menu" | "catering";
export type CastingLevel = "none" | "basico" | "completo";
export type MusicPlan = "none" | "libreria" | "original";
export type EditLevel = "basica" | "completa" | "premium";
export type Rights = "6m" | "1y" | "ilimitado";

export interface QuoteInput {
  type: ProjectType;
  // Rodaje
  days: number;
  night: boolean;
  locations: number;
  extraCrew: number; // técnicos adicionales al trío base
  drone: boolean;
  gimbal: boolean;
  lighting: boolean;
  proSound: boolean;
  grip: boolean; // grúa / travelling / slider
  // Actores
  leads: number;
  supporting: number;
  extras: number;
  casting: CastingLevel;
  // Logística y dietas
  meals: MealPlan;
  perDiem: boolean;
  km: number; // km totales ida y vuelta
  nights: number; // noches de alojamiento
  // Postproducción
  edit: EditLevel;
  color: boolean;
  mix: boolean;
  music: MusicPlan;
  motion: boolean;
  subtitles: boolean;
  extraVersions: number;
  // Entrega
  rights: Rights;
  express: boolean;
}

export interface Line {
  group: string;
  label: string;
  detail: string;
  amount: number;
}

export interface QuoteResult {
  lines: Line[];
  groups: { name: string; total: number }[];
  subtotal: number;
  contingency: number;
  base: number; // sin IVA
  vat: number;
  total: number;
  min: number;
  max: number;
  people: number;
}

export const RATES = {
  crewBase: 3,
  dayRate: { corto: 700, largo: 900, spot: 800, videoclip: 750, edicion: 0, casting: 0 } as Record<ProjectType, number>,
  dev: { corto: 400, largo: 2500, spot: 250, videoclip: 300, edicion: 0, casting: 0 } as Record<ProjectType, number>,
  extraCrewDay: 180,
  location: 150,
  nightFactor: 0.2,
  gear: { drone: 220, gimbal: 160, lighting: 200, proSound: 150, grip: 180 },
  lead: 180,
  supporting: 110,
  extra: 40,
  casting: { none: 0, basico: 250, completo: 600 } as Record<CastingLevel, number>,
  meal: { none: 0, bocata: 8, menu: 14, catering: 22 } as Record<MealPlan, number>,
  perDiem: 30,
  kmRate: 0.26,
  room: 55,
  insurance: 60,
  edit: { basica: 300, completa: 700, premium: 1400 } as Record<EditLevel, number>,
  color: 250,
  mix: 250,
  music: { none: 0, libreria: 120, original: 600 } as Record<MusicPlan, number>,
  motion: 300,
  subtitles: 80,
  version: 90,
  rights: { "6m": 0, "1y": 0.15, ilimitado: 0.4 } as Record<Rights, number>,
  expressFactor: 0.25,
  contingency: 0.08,
  vat: 0.21,
};

export const TYPE_LABEL: Record<ProjectType, string> = {
  corto: "Cortometraje",
  largo: "Largometraje",
  spot: "Spot / anuncio comercial",
  videoclip: "Videoclip musical",
  edicion: "Solo edición / postproducción",
  casting: "Solo casting y dirección de actores",
};

export const TYPE_HINT: Record<ProjectType, string> = {
  corto: "Historia de ficción de hasta 30 min.",
  largo: "Película completa; presupuesto muy variable según guion.",
  spot: "Anuncio para TV, redes o tienda. Ideal comercios y supermercados.",
  videoclip: "Concepto, rodaje y color para una canción.",
  edicion: "Ya tienes el material grabado y necesitas montaje, color y sonido.",
  casting: "Selección y dirección de actores para tu producción.",
};

/** Valores razonables al elegir un tipo, para que el cliente no parta de cero. */
export function defaultsFor(type: ProjectType): QuoteInput {
  const base: QuoteInput = {
    type, days: 2, night: false, locations: 1, extraCrew: 0,
    drone: false, gimbal: false, lighting: false, proSound: false, grip: false,
    leads: 1, supporting: 0, extras: 0, casting: "none",
    meals: "bocata", perDiem: false, km: 0, nights: 0,
    edit: "completa", color: true, mix: true, music: "libreria", motion: false, subtitles: false, extraVersions: 0,
    rights: "1y", express: false,
  };
  switch (type) {
    case "corto": return { ...base, days: 4, locations: 3, extraCrew: 2, proSound: true, lighting: true, leads: 2, supporting: 3, casting: "basico", edit: "premium", subtitles: true, rights: "6m" };
    case "largo": return { ...base, days: 20, locations: 10, extraCrew: 6, proSound: true, lighting: true, grip: true, drone: true, leads: 4, supporting: 8, extras: 20, casting: "completo", meals: "catering", nights: 10, edit: "premium", motion: true, subtitles: true, music: "original", rights: "6m" };
    case "spot": return { ...base, days: 1, extraCrew: 1, leads: 1, supporting: 1, rights: "1y", extraVersions: 1 };
    case "videoclip": return { ...base, days: 2, locations: 2, extraCrew: 1, lighting: true, gimbal: true, leads: 0, music: "none", rights: "6m" };
    case "edicion": return { ...base, days: 0, locations: 0, leads: 0, meals: "none", edit: "completa", rights: "6m" };
    case "casting": return { ...base, days: 1, locations: 0, leads: 0, casting: "completo", meals: "none", edit: "basica", color: false, mix: false, music: "none", rights: "6m" };
  }
}

const n = (v: number, min: number, max: number) => Math.max(min, Math.min(max, Math.round(Number.isFinite(v) ? v : 0)));
const round10 = (v: number) => Math.round(v / 10) * 10;

export function calcQuote(raw: QuoteInput): QuoteResult {
  const q: QuoteInput = {
    ...raw,
    days: n(raw.days, 0, 60), locations: n(raw.locations, 0, 40), extraCrew: n(raw.extraCrew, 0, 30),
    leads: n(raw.leads, 0, 30), supporting: n(raw.supporting, 0, 60), extras: n(raw.extras, 0, 300),
    km: n(raw.km, 0, 5000), nights: n(raw.nights, 0, 90), extraVersions: n(raw.extraVersions, 0, 10),
  };
  const R = RATES;
  const lines: Line[] = [];
  const add = (group: string, label: string, detail: string, amount: number) => {
    if (amount > 0) lines.push({ group, label, detail, amount: Math.round(amount) });
  };
  const shoots = q.days > 0 && q.type !== "edicion" && q.type !== "casting";
  const crew = R.crewBase + q.extraCrew;
  const actorsPeople = q.leads + q.supporting + q.extras;
  const people = shoots ? crew + actorsPeople : 0;

  // Preproducción
  add("Preproducción", "Desarrollo y guion / concepto", TYPE_LABEL[q.type], R.dev[q.type]);
  if (shoots) {
    add("Preproducción", "Localizaciones y permisos", `${q.locations} × ${R.location} €`, q.locations * R.location);
    add("Preproducción", "Seguros y gestión", "Seguro de rodaje y coordinación", R.insurance);
  }

  // Rodaje
  if (shoots) {
    const nightMul = q.night ? 1 + R.nightFactor : 1;
    add("Rodaje", "Equipo base (trío creativo)", `${q.days} día(s) × ${R.dayRate[q.type]} €${q.night ? " · +20 % nocturno" : ""}`, q.days * R.dayRate[q.type] * nightMul);
    add("Rodaje", "Técnicos adicionales", `${q.extraCrew} × ${q.days} día(s) × ${R.extraCrewDay} €`, q.extraCrew * q.days * R.extraCrewDay * nightMul);
    const gear: [boolean, string, number][] = [
      [q.drone, "Dron (piloto certificado)", R.gear.drone], [q.gimbal, "Estabilizador / steadicam", R.gear.gimbal],
      [q.lighting, "Iluminación profesional", R.gear.lighting], [q.proSound, "Sonido directo profesional", R.gear.proSound],
      [q.grip, "Grúa / travelling / slider", R.gear.grip],
    ];
    gear.forEach(([on, label, price]) => on && add("Equipo técnico", label, `${q.days} día(s) × ${price} €`, q.days * price));
  }

  // Actores
  if (shoots && actorsPeople > 0) {
    add("Actores", "Protagonistas", `${q.leads} × ${q.days} día(s) × ${R.lead} €`, q.leads * q.days * R.lead);
    add("Actores", "Secundarios", `${q.supporting} × ${q.days} día(s) × ${R.supporting} €`, q.supporting * q.days * R.supporting);
    add("Actores", "Figuración", `${q.extras} × ${q.days} día(s) × ${R.extra} €`, q.extras * q.days * R.extra);
  }
  if (q.casting !== "none") add("Actores", q.casting === "basico" ? "Casting básico" : "Casting completo", "Convocatoria, selección y ensayos", R.casting[q.casting]);

  // Logística y dietas
  if (shoots) {
    add("Logística y dietas", "Comidas", `${people} personas × ${q.days} día(s) × ${R.meal[q.meals]} €`, people * q.days * R.meal[q.meals]);
    if (q.perDiem) add("Logística y dietas", "Dietas del equipo", `${crew} × ${q.days} día(s) × ${R.perDiem} €`, crew * q.days * R.perDiem);
    const cars = Math.max(1, Math.ceil(people / 4));
    add("Logística y dietas", "Desplazamientos", `${q.km} km × ${cars} vehículo(s) × ${R.kmRate} €`, q.km * cars * R.kmRate);
    const rooms = Math.ceil(crew / 2);
    add("Logística y dietas", "Alojamiento", `${q.nights} noche(s) × ${rooms} habitación(es) × ${R.room} €`, q.nights * rooms * R.room);
  }

  // Postproducción
  if (q.type !== "casting") {
    add("Postproducción", "Edición y montaje", `Nivel ${q.edit}`, R.edit[q.edit]);
    if (q.color) add("Postproducción", "Corrección de color", "Look cinematográfico", R.color);
    if (q.mix) add("Postproducción", "Mezcla y diseño de sonido", "Mezcla final", R.mix);
    if (q.music !== "none") add("Postproducción", q.music === "libreria" ? "Música de librería" : "Música original", "Licencia incluida", R.music[q.music]);
    if (q.motion) add("Postproducción", "Motion graphics / títulos", "Rótulos y animación", R.motion);
    if (q.subtitles) add("Postproducción", "Subtítulos", "Un idioma", R.subtitles);
    add("Postproducción", "Versiones extra de formato", `${q.extraVersions} × ${R.version} € (vertical, cuadrado…)`, q.extraVersions * R.version);
  }

  const subtotal = lines.reduce((s, l) => s + l.amount, 0);
  const rightsAmt = q.type === "spot" ? subtotal * R.rights[q.rights] : 0;
  add("Entrega", "Cesión de derechos de emisión", q.rights === "ilimitado" ? "Sin límite de tiempo" : q.rights === "1y" ? "12 meses" : "6 meses", rightsAmt);
  const preExpress = lines.reduce((s, l) => s + l.amount, 0);
  if (q.express) add("Entrega", "Entrega urgente", "+25 %", preExpress * R.expressFactor);
  const sub = lines.reduce((s, l) => s + l.amount, 0);
  const contingency = Math.round(sub * R.contingency);
  const base = sub + contingency;
  const vat = Math.round(base * R.vat);
  const total = base + vat;

  const order: string[] = [];
  const map = new Map<string, number>();
  for (const l of lines) {
    if (!map.has(l.group)) order.push(l.group);
    map.set(l.group, (map.get(l.group) ?? 0) + l.amount);
  }
  return {
    lines, groups: order.map((name) => ({ name, total: map.get(name) ?? 0 })), subtotal: sub, contingency, base, vat, total,
    min: round10(base * 0.92), max: round10(base * 1.12), people,
  };
}
