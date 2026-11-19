import { ADSENSE_CLIENT, GA_ID } from "../data/site.ts";

function addScript(src: string, attrs: Record<string, string> = {}) {
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
  document.head.appendChild(s);
}

/** Carga GA4 y AdSense solo si hay variables configuradas; tras la primera interacción o en idle. */
export function loadThirdParties() {
  if (!GA_ID && !ADSENSE_CLIENT) return;
  const run = () => {
    if (GA_ID) {
      addScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`);
      const w = window as unknown as { dataLayer: unknown[] };
      w.dataLayer = w.dataLayer || [];
      const gtag = (...a: unknown[]) => w.dataLayer.push(a);
      gtag("js", new Date());
      gtag("config", GA_ID);
    }
    if (ADSENSE_CLIENT) {
      addScript(`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(ADSENSE_CLIENT)}`, { crossorigin: "anonymous" });
    }
  };
  if ("requestIdleCallback" in window) window.requestIdleCallback(run, { timeout: 4000 });
  else setTimeout(run, 2500);
}
