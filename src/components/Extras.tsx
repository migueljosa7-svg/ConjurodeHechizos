import { useEffect, useRef, useState } from "react";
import { LAURELS, MARQUEE, STATS, TESTIMONIALS } from "../data/extras.ts";
import { useReducedMotion } from "../lib/hooks.ts";

/** Banda de texto gigante en movimiento continuo (CSS puro). */
export function TextMarquee() {
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <div className="tmarquee" aria-hidden="true">
      <div>
        {[0, 1].map((c) => (
          <span key={c}>{items.map((t, i) => <b key={i}>{t} <i>✦</i> </b>)}</span>
        ))}
      </div>
    </div>
  );
}

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [v, setV] = useState(reduced ? to : 0);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) { setV(to); return; }
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / 1400);
        setV(Math.round(to * (1 - Math.pow(1 - k, 3))));
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, reduced]);
  return <span ref={ref}>{v}{suffix}</span>;
}

export function Stats() {
  return (
    <ul className="stats">
      {STATS.map((s) => (
        <li key={s.label}><b><Counter to={s.n} suffix={s.suffix} /></b><span>{s.label}</span></li>
      ))}
    </ul>
  );
}

export function Testimonials() {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => setI((x) => (x + 1) % TESTIMONIALS.length), 7000);
    return () => clearTimeout(t);
  }, [i, reduced]);
  const t = TESTIMONIALS[i];
  return (
    <div className="testi">
      <blockquote key={i}>
        <p>“{t.q}”</p>
        <footer><b>{t.by}</b> · {t.org}</footer>
      </blockquote>
      <div className="dots" role="tablist" aria-label="Testimonios">
        {TESTIMONIALS.map((_, k) => <button key={k} type="button" role="tab" aria-selected={k === i} aria-label={`Testimonio ${k + 1}`} className={k === i ? "on" : ""} onClick={() => setI(k)} />)}
      </div>
      <ul className="laurels">{LAURELS.map((l) => <li key={l}>❦ {l}</li>)}</ul>
    </div>
  );
}
