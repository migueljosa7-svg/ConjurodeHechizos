import { useEffect, useState } from "react";
import { useReducedMotion } from "../lib/hooks.ts";

const HERO = "/media/p1.jpg";

/** Claqueta de carga: se muestra en CADA carga de la página y se cierra cuando hay plano principal listo. */
export default function ClapboardIntro() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(true);
  const [clapped, setClapped] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("intro-lock");
    const min = reduced ? 600 : 2400;
    const t0 = performance.now();
    let ready = false;
    let minDone = false;
    const finish = () => {
      if (!(ready && minDone)) return;
      setLeaving(true);
      setTimeout(() => {
        document.documentElement.classList.remove("intro-lock");
        setOpen(false);
      }, 500);
    };
    const img = new Image();
    img.onload = img.onerror = () => { ready = true; finish(); };
    img.src = HERO;
    const clap = setTimeout(() => setClapped(true), reduced ? 100 : 1000);
    const wait = setTimeout(() => { minDone = true; finish(); }, Math.max(0, min - (performance.now() - t0)));
    const safety = setTimeout(() => { ready = true; minDone = true; finish(); }, 6000);
    return () => { clearTimeout(clap); clearTimeout(wait); clearTimeout(safety); };
  }, [reduced]);

  if (!open) return null;
  const skip = () => {
    document.documentElement.classList.remove("intro-lock");
    setOpen(false);
  };

  return (
    <div className={`clap-overlay${clapped ? " is-clapped" : ""}${leaving ? " leaving" : ""}`} role="dialog" aria-label="Cargando: claqueta">
      <div className="clap-flash" aria-hidden="true" />
      <div className="clap">
        <div className="clap-arm" aria-hidden="true" />
        <div className="clap-body">
          <p className="clap-row"><span>PROD</span> CONJURO DE HECHIZOS</p>
          <p className="clap-row"><span>ESCENA</span> 01 <span>TOMA</span> 01</p>
          <p className="clap-row"><span>LUGAR</span> ARAGÓN · ESPAÑA</p>
          <p className="clap-row"><span>FECHA</span> {new Date().toLocaleDateString("es-ES")}</p>
        </div>
        <div className="clap-load" aria-hidden="true"><i /></div>
        <p className="clap-cue mono">¡Luces, cámara…!</p>
      </div>
      <button className="clap-skip" onClick={skip} type="button">Saltar</button>
    </div>
  );
}
