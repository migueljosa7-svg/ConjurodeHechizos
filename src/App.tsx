import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ClapboardIntro from "./components/ClapboardIntro.tsx";
import Cursor from "./components/Cursor.tsx";
import FilmStripReel from "./components/FilmStripReel.tsx";
import ProjectGrid from "./components/ProjectGrid.tsx";
import ProjectionRoom from "./components/ProjectionRoom.tsx";
import QuoteCalculator from "./components/QuoteCalculator.tsx";
import SchemaOrg from "./components/SchemaOrg.tsx";
import ShowreelTimeline from "./components/ShowreelTimeline.tsx";
import type { Project } from "./data/projects.ts";
import { CONTACT_EMAIL, SERVICES_LIST, SITE, TRIO } from "./data/site.ts";
import { loadThirdParties } from "./lib/analytics.ts";

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

export default function App() {
  const [open, setOpen] = useState<Project | null>(null);
  const close = useCallback(() => setOpen(null), []);
  useEffect(loadThirdParties, []);

  return (
    <>
      <SchemaOrg />
      <ClapboardIntro />
      <Cursor />
      <header className="nav">
        <a href="#top" className="brand">✦ {SITE.name}</a>
        <nav aria-label="Principal">
          <a href="#proyectos">Proyectos</a>
          <a href="#estudio">Estudio</a>
          <a href="#cotizador" data-cursor="COTIZAR">Cotizar</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero wrap">
          <motion.h1 {...reveal}>
            Conjuro de Hechizos
            <small>Cine, videoclips y spots desde Aragón</small>
          </motion.h1>
          <ShowreelTimeline onOpen={setOpen} />
        </section>

        <FilmStripReel />

        <section id="proyectos" className="wrap section">
          <motion.h2 {...reveal}>Proyectos</motion.h2>
          <ProjectGrid onOpen={setOpen} />
        </section>

        <section id="estudio" className="wrap section">
          <motion.h2 {...reveal}>El estudio</motion.h2>
          <motion.p className="lead" {...reveal}>{SITE.description}</motion.p>
          <div className="trio">
            {TRIO.map((t, i) => (
              <motion.article key={t.name} {...reveal} transition={{ ...reveal.transition, delay: i * 0.1 }}>
                <span className="mono">0{i + 1}</span>
                <h3>{t.name}</h3>
                <p>{t.role}</p>
              </motion.article>
            ))}
          </div>
          <ul className="services">
            {SERVICES_LIST.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </section>

        <section id="cotizador" className="wrap section">
          <motion.h2 {...reveal}>Cotizador de rodaje</motion.h2>
          <QuoteCalculator />
        </section>
      </main>

      <footer className="wrap foot">
        <p>© {new Date().getFullYear()} {SITE.name} · Aragón, España</p>
        <a href={`mailto:${CONTACT_EMAIL}`} data-cursor="COTIZAR">{CONTACT_EMAIL}</a>
      </footer>

      <AnimatePresence>{open && <ProjectionRoom key={open.id} project={open} onClose={close} />}</AnimatePresence>
    </>
  );
}
