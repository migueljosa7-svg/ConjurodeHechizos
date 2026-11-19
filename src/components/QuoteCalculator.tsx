import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CONTACT_EMAIL } from "../data/site.ts";
import { buildBrief, clientChecklist, isEmail, type Contact } from "../lib/brief.ts";
import { formatEUR } from "../lib/format.ts";
import { calcQuote, defaultsFor, TYPE_HINT, TYPE_LABEL, type ProjectType, type QuoteInput } from "../lib/quote.ts";

const STEPS = ["Proyecto", "Rodaje", "Actores", "Logística y dietas", "Postproducción", "Tus datos"] as const;
const TYPES = Object.keys(TYPE_LABEL) as ProjectType[];

function NumberField({ label, hint, value, min = 0, max, step = 1, onChange }: { label: string; hint?: string; value: number; min?: number; max: number; step?: number; onChange: (v: number) => void }) {
  const set = (v: number) => onChange(Math.min(max, Math.max(min, v)));
  return (
    <div className="field">
      <span className="field-l">{label}{hint && <small>{hint}</small>}</span>
      <span className="stepper">
        <button type="button" aria-label={`Menos ${label}`} onClick={() => set(value - step)}>−</button>
        <input aria-label={label} inputMode="numeric" value={value} onChange={(e) => set(parseInt(e.target.value.replace(/\D/g, ""), 10) || 0)} />
        <button type="button" aria-label={`Más ${label}`} onClick={() => set(value + step)}>+</button>
      </span>
    </div>
  );
}

function Toggle({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className={`toggle${checked ? " on" : ""}`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span><b>{label}</b>{hint && <small>{hint}</small>}</span>
    </label>
  );
}

function Choice<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <fieldset className="choice">
      <legend>{label}</legend>
      <div>
        {options.map(([v, l]) => (
          <button key={v} type="button" className={value === v ? "on" : ""} aria-pressed={value === v} onClick={() => onChange(v)}>{l}</button>
        ))}
      </div>
    </fieldset>
  );
}

/** Cifra que cuenta hasta su valor (barato: un setState por frame solo mientras cambia). */
function useCount(target: number): number {
  const [v, setV] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setV(target); from.current = target; return; }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / 450);
      const cur = a + (target - a) * (1 - Math.pow(1 - k, 3));
      setV(cur);
      from.current = cur;
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return Math.round(v);
}

export default function QuoteCalculator() {
  const [q, setQ] = useState<QuoteInput>(() => defaultsFor("spot"));
  const [step, setStep] = useState(0);
  const [c, setC] = useState<Contact>({ name: "", email: "", phone: "", company: "", date: "", notes: "" });
  const [copied, setCopied] = useState(false);
  const r = useMemo(() => calcQuote(q), [q]);
  const brief = useMemo(() => buildBrief(q, r, c), [q, r, c]);
  const total = useCount(r.total);
  const set = <K extends keyof QuoteInput>(k: K, v: QuoteInput[K]) => setQ((p) => ({ ...p, [k]: v }));
  const onlyPost = q.type === "edicion";
  const castingOnly = q.type === "casting";
  const emailOk = isEmail(c.email);
  const mail = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Presupuesto: ${TYPE_LABEL[q.type]}${c.name ? " · " + c.name : ""}`)}&body=${encodeURIComponent(brief.slice(0, 1800) + (brief.length > 1800 ? "\n[…] Adjunto el resumen completo (descargado)." : ""))}`;

  const copy = async () => {
    try { await navigator.clipboard.writeText(brief); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* sin permiso */ }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([brief], { type: "text/plain;charset=utf-8" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: `presupuesto-conjuro-${q.type}.txt` });
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  let body: ReactNode;
  switch (step) {
    case 0:
      body = (
        <>
          <p className="hint">Elige qué necesitas. Te rellenamos valores habituales; luego los ajustas.</p>
          <div className="types">
            {TYPES.map((t) => (
              <button key={t} type="button" className={q.type === t ? "on" : ""} aria-pressed={q.type === t} onClick={() => setQ(defaultsFor(t))}>
                <b>{TYPE_LABEL[t]}</b><small>{TYPE_HINT[t]}</small>
              </button>
            ))}
          </div>
        </>
      );
      break;
    case 1:
      body = onlyPost || castingOnly ? <p className="hint">Este tipo de proyecto no necesita rodaje. Pasa al siguiente paso.</p> : (
        <>
          <NumberField label="Días de rodaje" hint="Un día = unas 10 h" value={q.days} min={1} max={60} onChange={(v) => set("days", v)} />
          <NumberField label="Localizaciones" hint="Sitios distintos donde se graba" value={q.locations} max={40} onChange={(v) => set("locations", v)} />
          <NumberField label="Técnicos adicionales" hint="Además del trío creativo" value={q.extraCrew} max={30} onChange={(v) => set("extraCrew", v)} />
          <Toggle label="Rodaje nocturno" hint="+20 % en jornada y técnicos" checked={q.night} onChange={(v) => set("night", v)} />
          <div className="toggles">
            <Toggle label="Dron" checked={q.drone} onChange={(v) => set("drone", v)} />
            <Toggle label="Estabilizador / steadicam" checked={q.gimbal} onChange={(v) => set("gimbal", v)} />
            <Toggle label="Iluminación profesional" checked={q.lighting} onChange={(v) => set("lighting", v)} />
            <Toggle label="Sonido directo profesional" checked={q.proSound} onChange={(v) => set("proSound", v)} />
            <Toggle label="Grúa / travelling" checked={q.grip} onChange={(v) => set("grip", v)} />
          </div>
        </>
      );
      break;
    case 2:
      body = (
        <>
          {!onlyPost && !castingOnly && (
            <>
              <NumberField label="Protagonistas" hint="Aparecen en casi todo el rodaje" value={q.leads} max={30} onChange={(v) => set("leads", v)} />
              <NumberField label="Secundarios" value={q.supporting} max={60} onChange={(v) => set("supporting", v)} />
              <NumberField label="Figuración" hint="Extras de fondo" value={q.extras} max={300} step={5} onChange={(v) => set("extras", v)} />
            </>
          )}
          <Choice label="Casting y dirección de actores" value={q.casting} onChange={(v) => set("casting", v)} options={[["none", "Ya tengo actores"], ["basico", "Básico"], ["completo", "Completo + ensayos"]]} />
        </>
      );
      break;
    case 3:
      body = onlyPost || castingOnly ? <p className="hint">Sin rodaje no hay logística. Pasa al siguiente paso.</p> : (
        <>
          <Choice label="Comidas del equipo y actores" value={q.meals} onChange={(v) => set("meals", v)} options={[["none", "Ninguna"], ["bocata", "Bocadillo"], ["menu", "Menú"], ["catering", "Catering"]]} />
          <Toggle label="Dietas del equipo" hint="30 € por persona y día si rodamos fuera de Aragón o lejos de base" checked={q.perDiem} onChange={(v) => set("perDiem", v)} />
          <NumberField label="Kilómetros totales (ida y vuelta)" value={q.km} max={5000} step={50} onChange={(v) => set("km", v)} />
          <NumberField label="Noches de alojamiento" value={q.nights} max={90} onChange={(v) => set("nights", v)} />
          <p className="hint">Personas en rodaje estimadas: <b>{r.people}</b></p>
        </>
      );
      break;
    case 4:
      body = castingOnly ? <p className="hint">Solo casting: no hay postproducción.</p> : (
        <>
          <Choice label="Edición y montaje" value={q.edit} onChange={(v) => set("edit", v)} options={[["basica", "Básica"], ["completa", "Completa"], ["premium", "Premium"]]} />
          <div className="toggles">
            <Toggle label="Corrección de color" checked={q.color} onChange={(v) => set("color", v)} />
            <Toggle label="Mezcla y diseño de sonido" checked={q.mix} onChange={(v) => set("mix", v)} />
            <Toggle label="Motion graphics / títulos" checked={q.motion} onChange={(v) => set("motion", v)} />
            <Toggle label="Subtítulos" checked={q.subtitles} onChange={(v) => set("subtitles", v)} />
          </div>
          <Choice label="Música" value={q.music} onChange={(v) => set("music", v)} options={[["none", "La pongo yo"], ["libreria", "Librería"], ["original", "Original"]]} />
          <NumberField label="Versiones extra" hint="Vertical, cuadrado, 15 s…" value={q.extraVersions} max={10} onChange={(v) => set("extraVersions", v)} />
          {q.type === "spot" && <Choice label="Derechos de emisión" value={q.rights} onChange={(v) => set("rights", v)} options={[["6m", "6 meses"], ["1y", "12 meses"], ["ilimitado", "Sin límite"]]} />}
          <Toggle label="Entrega urgente" hint="+25 % si la necesitas en menos de 2 semanas" checked={q.express} onChange={(v) => set("express", v)} />
        </>
      );
      break;
    default:
      body = (
        <>
          <div className="form">
            <label>Nombre<input autoComplete="name" value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} /></label>
            <label>Email<input type="email" autoComplete="email" aria-invalid={c.email !== "" && !emailOk} value={c.email} onChange={(e) => setC({ ...c, email: e.target.value })} /></label>
            <label>Teléfono<input type="tel" autoComplete="tel" value={c.phone} onChange={(e) => setC({ ...c, phone: e.target.value })} /></label>
            <label>Empresa / marca<input autoComplete="organization" value={c.company} onChange={(e) => setC({ ...c, company: e.target.value })} /></label>
            <label>Fecha deseada<input type="date" value={c.date} onChange={(e) => setC({ ...c, date: e.target.value })} /></label>
            <label className="wide">Cuéntanos tu idea<textarea rows={4} value={c.notes} onChange={(e) => setC({ ...c, notes: e.target.value })} placeholder="Qué quieres contar, para quién y dónde se verá." /></label>
          </div>
          <div className="checklist">
            <h4 className="mono">Qué tendrás que preparar</h4>
            <ul>{clientChecklist(q).map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        </>
      );
  }

  return (
    <div className="quote">
      <div className="quote-main">
        <ol className="steps" aria-label="Pasos del cotizador">
          {STEPS.map((s, i) => (
            <li key={s}>
              <button type="button" className={i === step ? "on" : i < step ? "done" : ""} aria-current={i === step ? "step" : undefined} onClick={() => setStep(i)}>
                <span>{i + 1}</span>{s}
              </button>
            </li>
          ))}
        </ol>
        <div className="steps-bar" aria-hidden="true"><i style={{ transform: `scaleX(${(step + 1) / STEPS.length})` }} /></div>
        <div className="step-body" key={step}>{body}</div>
        <div className="step-nav">
          <button type="button" className="btn ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>← Atrás</button>
          {step < STEPS.length - 1 && <button type="button" className="btn" onClick={() => setStep(step + 1)}>Siguiente →</button>}
        </div>
      </div>

      <aside className="quote-result" aria-live="polite">
        <p className="mono eyebrow">Tu estimación</p>
        <p className="price">{formatEUR(total)}<small> IVA incl.</small></p>
        <p className="note">Horquilla sin IVA: {formatEUR(r.min)} – {formatEUR(r.max)}</p>
        <div className="lines">
          {r.groups.map((g) => (
            <details key={g.name}>
              <summary><span>{g.name}</span><b>{formatEUR(g.total)}</b></summary>
              <ul>{r.lines.filter((l) => l.group === g.name).map((l) => <li key={l.label}><span>{l.label}<small>{l.detail}</small></span><b>{formatEUR(l.amount)}</b></li>)}</ul>
            </details>
          ))}
          <p className="sub"><span>Imprevistos (8 %)</span><b>{formatEUR(r.contingency)}</b></p>
          <p className="sub"><span>IVA (21 %)</span><b>{formatEUR(r.vat)}</b></p>
        </div>
        <div className="actions">
          <a className={`btn${emailOk ? "" : " disabled"}`} href={emailOk ? mail : undefined} aria-disabled={!emailOk} data-cursor="COTIZAR" onClick={(e) => { if (!emailOk) { e.preventDefault(); setStep(STEPS.length - 1); } }}>
            {emailOk ? "Enviar solicitud" : "Añade tu email para enviar"}
          </a>
          <button type="button" className="btn ghost" onClick={copy}>{copied ? "¡Copiado!" : "Copiar resumen"}</button>
          <button type="button" className="btn ghost" onClick={download}>Descargar .txt</button>
          <button type="button" className="btn ghost" onClick={() => window.print()}>Imprimir / PDF</button>
        </div>
        <p className="note">Estimación no vinculante. El presupuesto final se cierra tras hablar contigo.</p>
      </aside>
      <pre className="print-sheet">{brief}</pre>
    </div>
  );
}
