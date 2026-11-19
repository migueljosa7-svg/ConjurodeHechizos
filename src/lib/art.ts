// Fotogramas procedurales (SVG): sin imágenes externas, ligeros y nítidos a cualquier resolución.
export function frameArt(seed: number, hue: number, w = 800, h = 450): string {
  const r = (n: number) => {
    const x = Math.sin(seed * 9301 + n * 49297) * 233280;
    return x - Math.floor(x);
  };
  const h2 = (hue + 40 + r(1) * 40) % 360;
  const cx = 150 + r(2) * (w - 300);
  const horizon = h * (0.55 + r(3) * 0.15);
  const figs = [0, 1, 2]
    .map((i) => {
      const x = 120 + r(10 + i) * (w - 240);
      const fh = 70 + r(20 + i) * 110;
      return `<rect x="${x.toFixed(0)}" y="${(horizon - fh).toFixed(0)}" width="${(18 + r(30 + i) * 22).toFixed(0)}" height="${fh.toFixed(0)}" rx="8" fill="#050507" opacity="0.85"/>`;
    })
    .join("");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><defs>` +
    `<linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="hsl(${hue} 55% 22%)"/><stop offset="1" stop-color="hsl(${h2.toFixed(0)} 60% 9%)"/></linearGradient>` +
    `<radialGradient id="l" cx="${(cx / w).toFixed(2)}" cy="0.35" r="0.5"><stop offset="0" stop-color="hsl(${hue} 90% 70%)" stop-opacity="0.55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>` +
    `<rect width="${w}" height="${h}" fill="url(#g)"/><rect width="${w}" height="${h}" fill="url(#l)"/>` +
    `<rect y="${horizon.toFixed(0)}" width="${w}" height="${h}" fill="#050507" opacity="0.75"/>${figs}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
