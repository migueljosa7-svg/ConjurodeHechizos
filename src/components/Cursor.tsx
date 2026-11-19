import { useEffect, useRef, useState } from "react";
import { useFinePointer, useReducedMotion } from "../lib/hooks.ts";

/** Cursor óptico: solo con puntero fino. Etiqueta desde [data-cursor]. */
export default function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!fine) return;
    document.documentElement.classList.add("has-cursor");
    let raf = 0;
    let x = -100;
    let y = -100;
    let cx = -100;
    let cy = -100;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const el = (e.target as Element | null)?.closest?.("[data-cursor]");
      setLabel(el?.getAttribute("data-cursor") ?? "");
    };
    const loop = () => {
      const k = reduced ? 1 : 0.22;
      cx += (x - cx) * k;
      cy += (y - cy) * k;
      if (ref.current) ref.current.style.transform = `translate3d(${cx}px,${cy}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, [fine, reduced]);

  if (!fine) return null;
  return (
    <div ref={ref} className={`cursor${label ? " has-label" : ""}`} aria-hidden="true">
      <span>{label}</span>
    </div>
  );
}
