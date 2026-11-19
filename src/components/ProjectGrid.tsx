import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { CATEGORY_LABEL, PROJECTS, type Category, type Project } from "../data/projects.ts";
import { formatDuration } from "../lib/format.ts";

const FILTERS = ["todos", "cortometraje", "largometraje", "videoclip", "spot"] as const;

export default function ProjectGrid({ onOpen }: { onOpen: (p: Project) => void }) {
  const [filter, setFilter] = useState<Category | "todos">("todos");
  const list = filter === "todos" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <>
      <div className="filters" role="group" aria-label="Filtrar proyectos">
        {FILTERS.map((f) => (
          <button key={f} type="button" className={filter === f ? "on" : ""} aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {CATEGORY_LABEL[f]}
          </button>
        ))}
      </div>
      <p className="count mono" aria-live="polite">{list.length} proyecto(s)</p>
      <ul className="grid">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <m.li key={p.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.45 } }} exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}>
              <button type="button" className="card" data-cursor="VER PROYECTO" onClick={() => onOpen(p)}>
                <span className="card-img">
                  <img src={p.photo} alt={`Fotograma de ${p.title}`} loading="lazy" decoding="async" />
                  <span className="card-play" aria-hidden="true">▶</span>
                </span>
                <span className="card-meta mono"><b>{CATEGORY_LABEL[p.category]}</b><span>{p.format} · {formatDuration(p.durationMin)}</span></span>
                <span className="card-title">{p.title}</span>
                <span className="card-log">{p.logline}</span>
              </button>
            </m.li>
          ))}
        </AnimatePresence>
      </ul>
    </>
  );
}
