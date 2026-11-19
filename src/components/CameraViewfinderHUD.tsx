import { useEffect, useRef } from "react";
import { timecode } from "../lib/format.ts";
import { useFinePointer, useReducedMotion } from "../lib/hooks.ts";

/** HUD de cámara. El timecode y el retículo se actualizan por ref (sin re-renders de React). */
export default function CameraViewfinderHUD() {
  const tcRef = useRef<HTMLSpanElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();

  useEffect(() => {
    let raf = 0;
    let last = 0;
    const start = performance.now();
    const tick = (now: number) => {
      if (now - last > 41 && tcRef.current) {
        tcRef.current.textContent = `TC ${timecode(now - start)}`;
        last = now;
      }
      raf = requestAnimationFrame(tick);
    };
    if (reduced) {
      if (tcRef.current) tcRef.current.textContent = "TC 00:00:00:00";
    } else {
      raf = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  useEffect(() => {
    if (!fine || reduced) return;
    const parent = reticleRef.current?.parentElement;
    if (!parent) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    const move = (e: PointerEvent) => {
      const r = parent.getBoundingClientRect();
      tx = e.clientX - r.left - r.width / 2;
      ty = e.clientY - r.top - r.height / 2;
    };
    const loop = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      if (reticleRef.current) reticleRef.current.style.transform = `translate3d(${cx}px,${cy}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    parent.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      parent.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, [fine, reduced]);

  return (
    <div className="hud" aria-hidden="true">
      <i className="hud-c tl" />
      <i className="hud-c tr" />
      <i className="hud-c bl" />
      <i className="hud-c br" />
      <div className="hud-top">
        <span className="rec"><b /> REC 4K</span>
        <span ref={tcRef} className="mono">TC 00:00:00:00</span>
      </div>
      <div className="hud-meter">
        {Array.from({ length: 8 }, (_, i) => (
          <b key={i} style={{ animationDelay: `${i * -0.23}s` }} />
        ))}
      </div>
      <div ref={reticleRef} className={`reticle${fine ? "" : " auto"}`} />
      <div className="hud-bottom mono">ISO 800 · 24 FPS · 180° · T2.8</div>
    </div>
  );
}
