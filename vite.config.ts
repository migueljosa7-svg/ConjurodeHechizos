import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

const FALLBACK_SITE_URL = "https://conjurodehechizos.es";

/** Sustituye __SITE_URL__ en index.html con las variables de entorno (con fallback). */
function htmlEnv(env: Record<string, string>): Plugin {
  const site = (env.VITE_SITE_URL || FALLBACK_SITE_URL).replace(/\/+$/, "");
  return {
    name: "html-env",
    transformIndexHtml: { order: "pre", handler: (html: string) => html.split("__SITE_URL__").join(site) },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "VITE_");
  return {
    plugins: [react(), htmlEnv(env)],
    build: {
      outDir: "dist",
      target: "es2020",
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: { react: ["react", "react-dom"], motion: ["framer-motion"] },
        },
      },
    },
  };
});
