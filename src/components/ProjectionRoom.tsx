import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CATEGORY_LABEL, PROJECTS, type Project } from "../data/projects.ts";
import { frameArt } from "../lib/art.ts";
import { formatDuration } from "../lib/format.ts";

export default function ProjectionRoom({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const seed = PROJECTS.indexOf(project) + 1;

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    document.documentElement.classList.add("modal-open");
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("modal-open");
      prevFocus?.focus?.();
    };
  }, [onClose]);

  return (
    <motion.div className="room" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className="room-panel"
        role="dialog"
        aria-modal="true"
        aria-label={`Sala de proyección: ${project.title}`}
        initial={{ clipPath: "inset(10% 10% 10% 10%)", opacity: 0 }}
        animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
        exit={{ clipPath: "inset(10% 10% 10% 10%)", opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeRef} type="button" className="room-close" onClick={onClose} aria-label="Cerrar">✕</button>
        <div className="room-screen" style={{ backgroundImage: `url("${frameArt(seed, project.hue, 1280, 720)}")` }}>
          <span className="rec"><b /> SALA DE PROYECCIÓN</span>
        </div>
        <div className="room-body">
          <p className="mono eyebrow">{CATEGORY_LABEL[project.category]} · {project.format} · {formatDuration(project.durationMin)} · {project.year}</p>
          <h3>{project.title}</h3>
          <p className="lead">{project.synopsis}</p>
          <div className="room-cols">
            <div>
              <h4 className="mono">Créditos</h4>
              <dl>
                {project.credits.map((c) => (
                  <div key={c.role}><dt>{c.role}</dt><dd>{c.name}</dd></div>
                ))}
              </dl>
            </div>
            <div>
              <h4 className="mono">Reparto</h4>
              <ul>{project.cast.map((a) => <li key={a}>{a}</li>)}</ul>
            </div>
          </div>
          <h4 className="mono">Fotogramas</h4>
          <div className="room-gallery">
            {[0, 1, 2].map((k) => (
              <i key={k} style={{ backgroundImage: `url("${frameArt(seed * 7 + k, project.hue, 400, 225)}")` }} />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
