import type { Project } from "../data/projects.ts";

/** Tira de película autónoma: se desplaza sola de izquierda a derecha (CSS puro, GPU). */
export default function FilmStripReel({ scenes, activeId, onSelect }: { scenes: Project[]; activeId: string; onSelect: (i: number) => void }) {
  const reps = Math.max(1, Math.ceil(6 / scenes.length));
  const half = Array.from({ length: reps }, () => scenes).flat();
  const duration = Math.max(24, half.length * 5);

  return (
    <div className="reel" role="group" aria-label="Fotogramas del capítulo">
      <div className="strip" style={{ animationDuration: `${duration}s` }}>
        {[0, 1].map((copy) =>
          half.map((p, i) => (
            <button
              key={`${copy}-${i}`}
              type="button"
              className={`cell${p.id === activeId ? " active" : ""}`}
              onClick={() => onSelect(scenes.indexOf(p))}
              aria-hidden={copy === 1}
              tabIndex={copy === 1 ? -1 : 0}
              aria-label={`Ver ${p.title}`}
              data-cursor="REPRODUCIR"
            >
              <i className="perf" />
              <img src={p.photo} alt="" loading="lazy" decoding="async" draggable={false} />
              <span className="mono">{String((i % half.length) + 1).padStart(2, "0")} · {p.title}</span>
              <i className="perf" />
            </button>
          )),
        )}
      </div>
    </div>
  );
}
