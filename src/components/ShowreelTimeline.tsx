import { useEffect, useState } from "react";
import CameraViewfinderHUD from "./CameraViewfinderHUD.tsx";
import { CHAPTERS, PROJECTS, type Chapter, type Project } from "../data/projects.ts";
import { frameArt } from "../lib/art.ts";
import { useReducedMotion } from "../lib/hooks.ts";

const SCENE_MS = 6000;

export default function ShowreelTimeline({ onOpen }: { onOpen: (p: Project) => void }) {
  const reduced = useReducedMotion();
  const [chapter, setChapter] = useState<Chapter>("cine");
  const [idx, setIdx] = useState(0);
  const scenes = PROJECTS.filter((p) => p.chapter === chapter);
  const current = scenes[idx % scenes.length];

  useEffect(() => {
    if (reduced || scenes.length < 2) return;
    const t = setTimeout(() => setIdx((i) => (i + 1) % scenes.length), SCENE_MS);
    return () => clearTimeout(t);
  }, [idx, chapter, reduced, scenes.length]);

  return (
    <div className="showreel">
      <div className="screen" data-cursor="REPRODUCIR">
        {/* key fuerza reinicio de Ken Burns y barra de progreso al cambiar de escena */}
        <button
          key={current.id}
          type="button"
          className="screen-frame"
          style={{ backgroundImage: `url("${frameArt(PROJECTS.indexOf(current) + 1, current.hue, 1280, 720)}")` }}
          onClick={() => onOpen(current)}
          aria-label={`Abrir sala de proyección: ${current.title}`}
        />
        <div className="letterbox top" />
        <div className="letterbox bottom" />
        <CameraViewfinderHUD />
        <div className="screen-caption">
          <span className="mono">{current.format} · {current.year}</span>
          <strong>{current.title}</strong>
          <em>{current.logline}</em>
        </div>
        <div className="scene-bar" aria-hidden="true">
          <i key={`${current.id}-${chapter}`} style={{ animationDuration: `${SCENE_MS}ms`, animationPlayState: reduced ? "paused" : "running" }} />
        </div>
      </div>
      <div className="chapters" role="tablist" aria-label="Capítulos del showreel">
        {CHAPTERS.map((c) => (
          <button
            key={c.id}
            role="tab"
            type="button"
            aria-selected={chapter === c.id}
            className={chapter === c.id ? "on" : ""}
            onClick={() => {
              setChapter(c.id);
              setIdx(0);
            }}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
