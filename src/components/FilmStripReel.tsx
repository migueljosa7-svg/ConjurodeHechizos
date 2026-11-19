import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PROJECTS } from "../data/projects.ts";
import { frameArt } from "../lib/art.ts";
import { useReducedMotion } from "../lib/hooks.ts";

export default function FilmStripReel() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["4%", "-38%"]);
  const frames = [...PROJECTS, ...PROJECTS];

  return (
    <section ref={ref} className="reel" aria-label="Tira de película con fotogramas de nuestras producciones">
      <motion.div className="strip" style={reduced ? undefined : { x }}>
        {frames.map((p, i) => (
          <figure className="cell" key={`${p.id}-${i}`}>
            <i className="perf" />
            <div className="cell-img" style={{ backgroundImage: `url("${frameArt(PROJECTS.indexOf(p) + 20, p.hue, 480, 300)}")` }} role="img" aria-label={p.title} />
            <figcaption className="mono">{String(i + 1).padStart(2, "0")} · {p.title}</figcaption>
            <i className="perf" />
          </figure>
        ))}
      </motion.div>
    </section>
  );
}
