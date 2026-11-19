import { useMemo, useState } from "react";
import { CONTACT_EMAIL } from "../data/site.ts";
import { formatEUR } from "../lib/format.ts";
import { SERVICES, calcQuote, type ServiceId } from "../lib/quote.ts";

export default function QuoteCalculator() {
  const [service, setService] = useState<ServiceId>("spot");
  const [days, setDays] = useState(2);
  const [actors, setActors] = useState(2);
  const [express, setExpress] = useState(false);
  const { min, max } = useMemo(() => calcQuote({ service, days, actors, express }), [service, days, actors, express]);
  const label = SERVICES.find((s) => s.id === service)?.label ?? "";
  const mail = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Presupuesto: " + label)}&body=${encodeURIComponent(
    `Hola, me interesa: ${label}\nDías de rodaje: ${days}\nActores: ${actors}\nUrgente: ${express ? "sí" : "no"}\nEstimación: ${formatEUR(min)} – ${formatEUR(max)}`,
  )}`;

  return (
    <div className="quote">
      <div className="quote-form">
        <label>
          Tipo de proyecto
          <select value={service} onChange={(e) => setService(e.target.value as ServiceId)}>
            {SERVICES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </label>
        <label>
          Días de rodaje: <b>{days}</b>
          <input type="range" min={1} max={30} value={days} onChange={(e) => setDays(+e.target.value)} />
        </label>
        <label>
          Actores: <b>{actors}</b>
          <input type="range" min={0} max={40} value={actors} onChange={(e) => setActors(+e.target.value)} />
        </label>
        <label className="check">
          <input type="checkbox" checked={express} onChange={(e) => setExpress(e.target.checked)} />
          Entrega urgente (+25 %)
        </label>
      </div>
      <div className="quote-result" aria-live="polite">
        <p className="mono eyebrow">Estimación orientativa</p>
        <p className="price">{formatEUR(min)} – {formatEUR(max)}</p>
        <p className="note">{SERVICES.find((s) => s.id === service)?.note}. IVA no incluido.</p>
        <a className="btn" href={mail} data-cursor="COTIZAR">Pedir presupuesto</a>
      </div>
    </div>
  );
}
