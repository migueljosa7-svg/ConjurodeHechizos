import { useEffect, useState } from "react";
import { useReducedMotion } from "../lib/hooks.ts";

const KEY = "conjuro-intro-seen";

function alreadySeen(): boolean {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export default function ClapboardIntro() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(() => !alreadySeen());
  const [clapped, setClapped] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.documentElement.classList.add("intro-lock");
    const t1 = setTimeout(() => setClapped(true), reduced ? 100 : 900);
    const t2 = setTimeout(() => close(), reduced ? 700 : 2300);
    function close() {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* sin storage */
      }
      document.documentElement.classList.remove("intro-lock");
      setOpen(false);
    }
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.documentElement.classList.remove("intro-lock");
    };
  }, [open, reduced]);

  if (!open) return null;
  const skip = () => {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* sin storage */
    }
    setOpen(false);
  };

  return (
    <div className={`clap-overlay${clapped ? " is-clapped" : ""}`} role="dialog" aria-label="Introducción: claqueta">
      <div className="clap">
        <div className="clap-arm" aria-hidden="true" />
        <div className="clap-body">
          <p className="clap-row"><span>PROD</span> CONJURO DE HECHIZOS</p>
          <p className="clap-row"><span>ESCENA</span> 01 <span>TOMA</span> 01</p>
          <p className="clap-row"><span>LUGAR</span> ARAGÓN · ESPAÑA</p>
          <p className="clap-row"><span>FECHA</span> {new Date().toLocaleDateString("es-ES")}</p>
        </div>
      </div>
      <button className="clap-skip" onClick={skip} type="button">Saltar</button>
    </div>
  );
}
