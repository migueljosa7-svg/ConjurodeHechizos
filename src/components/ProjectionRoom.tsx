import { useEffect, useRef, useState } from "react";
import { m } from "framer-motion";
import { CATEGORY_LABEL, PROJECTS, type Project } from "../data/projects.ts";
import { formatDuration } from "../lib/format.ts";

export default function ProjectionRoom({ project, onClose, onNav }: { project: Project; onClose: () => void; onNav: (p: Project) => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [shot, setShot] = useState(0);
  const i = PROJECTS.indexOf(project);
  const prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(i + 1) % PROJECTS.length];
  const shots = Array.from(new Set([project.photo, ...project.gallery]));

  useEffect(() => { setShot(0); panelRef.current?.scrollTo({ top: 0 }); }, [project.id]);

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    document.documentElement.classList.add("modal-open");
    panelRef.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(next);
      if (e.key === "ArrowLeft") onNav(prev);
      if (e.key === "Tab" && panelRef.current) {
        const f = Array.from(panelRef.current.querySelectorAll<HTMLElement>("button, a[href]"));
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("modal-open");
      prevFocus?.focus?.();
    };
  }, [onClose, onNav, next, prev]);

  return (
    <m.div className="room" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <m.div ref={panelRef} className="room-panel" role="dialog" aria-modal="true" aria-label={`Sala de proyección: ${project.title}`}
        initial={{ clipPath: "inset(10% 10% 10% 10%)", opacity: 0 }} animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }} exit={{ clipPath: "inset(10% 10% 10% 10%)", opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="room-close" onClick={onClose} aria-label="Cerrar">✕</button>
        <div className="room-screen">
          <img key={shots[shot]} src={shots[shot]} alt={`Fotograma de ${project.title}`} decoding="async" />
          <span className="rec"><b /> SALA DE PROYECCIÓN</span>
        </div>
        <div className="room-body">
          <p className="mono eyebrow">{CATEGORY_LABEL[project.category]} · {project.format} · {formatDuration(project.durationMin)} · {project.year}</p>
          <h3>{project.title}</h3>
          <p className="lead">{project.synopsis}</p>
          <div className="room-cols">
            <div><h4 className="mono">Créditos</h4><dl>{project.credits.map((c) => <div key={c.role}><dt>{c.role}</dt><dd>{c.name}</dd></div>)}</dl></div>
            <div><h4 className="mono">Reparto</h4><ul>{project.cast.map((a) => <li key={a}>{a}</li>)}</ul></div>
          </div>
          <h4 className="mono">Fotogramas</h4>
          <div className="room-gallery">
            {shots.map((s, k) => (
              <button key={k} type="button" className={k === shot ? "on" : ""} onClick={() => setShot(k)} aria-label={`Fotograma ${k + 1}`} aria-pressed={k === shot}>
                <img src={s} alt="" loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
          <div className="room-nav">
            <button type="button" className="btn ghost" onClick={() => onNav(prev)}>← {prev.title}</button>
            <button type="button" className="btn ghost" onClick={() => onNav(next)}>{next.title} →</button>
          </div>
        </div>
      </m.div>
    </m.div>
  );
}
