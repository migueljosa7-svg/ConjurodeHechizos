import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m, useScroll, useSpring } from "framer-motion";
import ClapboardIntro from "./components/ClapboardIntro.tsx";
import Cursor from "./components/Cursor.tsx";
import ProjectGrid from "./components/ProjectGrid.tsx";
import SchemaOrg from "./components/SchemaOrg.tsx";
import ShowreelTimeline from "./components/ShowreelTimeline.tsx";
import type { Project } from "./data/projects.ts";
import { FAQ, PROCESS } from "./data/faq.ts";
import { CONTACT_EMAIL, SERVICES_LIST, SITE, TRIO } from "./data/site.ts";
import { loadThirdParties } from "./lib/analytics.ts";

const ProjectionRoom = lazy(() => import("./components/ProjectionRoom.tsx"));
const QuoteCalculator = lazy(() => import("./components/QuoteCalculator.tsx"));

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

export default function App() {
  const [open, setOpen] = useState<Project | null>(null);
  const [top, setTop] = useState(false);
  const close = useCallback(() => setOpen(null), []);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });
  useEffect(loadThirdParties, []);
  useEffect(() => {
    const on = () => setTop(window.scrollY > 900);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      <SchemaOrg />
      <ClapboardIntro />
      <Cursor />
      <m.div className="progress" style={{ scaleX: progress }} aria-hidden="true" />
      <a className="skip" href="#proyectos">Saltar al contenido</a>
      <header className="nav">
        <a href="#top" className="brand">✦ {SITE.name}</a>
        <nav aria-label="Principal">
          <a href="#proyectos">Proyectos</a>
          <a href="#estudio">Estudio</a>
          <a href="#proceso">Proceso</a>
          <a href="#cotizador" className="nav-cta" data-cursor="COTIZAR">Cotizar</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero wrap">
          <m.h1 {...reveal}>
            Conjuro de Hechizos
            <small>Cine, videoclips y spots desde Aragón</small>
          </m.h1>
          <ShowreelTimeline onOpen={setOpen} />
        </section>

        <section id="proyectos" className="wrap section lazy-section">
          <m.h2 {...reveal}>Proyectos</m.h2>
          <ProjectGrid onOpen={setOpen} />
        </section>

        <section id="estudio" className="wrap section lazy-section">
          <m.h2 {...reveal}>El estudio</m.h2>
          <m.p className="lead" {...reveal}>{SITE.description}</m.p>
          <div className="trio">
            {TRIO.map((t, i) => (
              <m.article key={t.name} {...reveal} transition={{ ...reveal.transition, delay: i * 0.1 }}>
                <span className="mono">0{i + 1}</span>
                <h3>{t.name}</h3>
                <p>{t.role}</p>
              </m.article>
            ))}
          </div>
          <ul className="services">{SERVICES_LIST.map((s) => <li key={s}>{s}</li>)}</ul>
        </section>

        <section id="proceso" className="wrap section lazy-section">
          <m.h2 {...reveal}>Del conjuro al estreno</m.h2>
          <ol className="process">
            {PROCESS.map((p, i) => (
              <m.li key={p.t} {...reveal} transition={{ ...reveal.transition, delay: i * 0.08 }}>
                <span className="mono">Plano {i + 1}</span>
                <h3>{p.t}</h3>
                <p>{p.d}</p>
              </m.li>
            ))}
          </ol>
        </section>

        <section id="cotizador" className="wrap section lazy-section">
          <m.h2 {...reveal}>Cotizador de rodaje</m.h2>
          <p className="lead">Elige, ajusta y recibe un presupuesto desglosado: rodaje, actores, comidas, dietas, desplazamientos y postproducción.</p>
          <Suspense fallback={<p className="hint">Cargando cotizador…</p>}>
            <QuoteCalculator />
          </Suspense>
        </section>

        <section id="faq" className="wrap section lazy-section">
          <m.h2 {...reveal}>Preguntas frecuentes</m.h2>
          <div className="faq">
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="wrap foot">
        <p>© {new Date().getFullYear()} {SITE.name} · Aragón, España</p>
        <a href={`mailto:${CONTACT_EMAIL}`} data-cursor="COTIZAR">{CONTACT_EMAIL}</a>
      </footer>

      {top && <button type="button" className="to-top" aria-label="Volver arriba" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑</button>}

      <AnimatePresence>
        {open && (
          <Suspense fallback={null}>
            <ProjectionRoom key="room" project={open} onClose={close} onNav={setOpen} />
          </Suspense>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
