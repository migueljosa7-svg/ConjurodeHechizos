import { useEffect, useState } from "react";
import CameraViewfinderHUD from "./CameraViewfinderHUD.tsx";
import FilmStripReel from "./FilmStripReel.tsx";
import { CHAPTERS, PROJECTS, type Chapter, type Project } from "../data/projects.ts";
import { useReducedMotion } from "../lib/hooks.ts";

const SCENE_MS = 6000;

export default function ShowreelTimeline({ onOpen }: { onOpen: (p: Project) => void }) {
  const reduced = useReducedMotion();
  const [chapter, setChapter] = useState<Chapter>("cine");
  const [idx, setIdx] = useState(0);
  const [hover, setHover] = useState(false);
  const scenes = PROJECTS.filter((p) => p.chapter === chapter);
  const current = scenes[idx % scenes.length];

  useEffect(() => {
    if (reduced || hover || scenes.length < 2) return;
    const t = setTimeout(() => setIdx((i) => (i + 1) % scenes.length), SCENE_MS);
    return () => clearTimeout(t);
  }, [idx, chapter, reduced, hover, scenes.length]);

  return (
    <div className="showreel">
      <div className="chapters" role="tablist" aria-label="Capítulos del showreel">
        {CHAPTERS.map((c) => (
          <button key={c.id} role="tab" type="button" aria-selected={chapter === c.id} className={chapter === c.id ? "on" : ""} onClick={() => { setChapter(c.id); setIdx(0); }}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="screen" data-cursor="REPRODUCIR" onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
        <button key={current.id} type="button" className={`screen-frame kb-${idx % 2}`} onClick={() => onOpen(current)} aria-label={`Abrir sala de proyección: ${current.title}`}>
          <img src={current.photo} alt={`Fotograma de ${current.title}`} fetchPriority={idx === 0 ? "high" : "auto"} decoding="async" />
        </button>
        <div className="grain" aria-hidden="true" />
        <div className="flicker" aria-hidden="true" />
        <div className="letterbox top" />
        <div className="letterbox bottom" />
        <CameraViewfinderHUD />
        <div className="screen-caption" key={`cap-${current.id}`}>
          <span className="mono">{current.format} · {current.year}</span>
          <strong>{current.title}</strong>
          <em>{current.logline}</em>
        </div>
        <div className="scene-bar" aria-hidden="true">
          <i key={`${current.id}-${chapter}-${hover}`} style={{ animationDuration: `${SCENE_MS}ms`, animationPlayState: reduced || hover ? "paused" : "running" }} />
        </div>
      </div>

      <FilmStripReel key={chapter} scenes={scenes} activeId={current.id} onSelect={setIdx} />
    </div>
  );
}
