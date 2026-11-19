// Validadores SEO puros (usables en Deno y en navegador).
export interface SeoIssue {
  field: string;
  message: string;
}

export function validateSeo(meta: { title: string; description: string; url: string }): SeoIssue[] {
  const issues: SeoIssue[] = [];
  if (meta.title.length < 15 || meta.title.length > 70) issues.push({ field: "title", message: "Título recomendado: 15–70 caracteres" });
  if (meta.description.length < 70 || meta.description.length > 170) issues.push({ field: "description", message: "Descripción recomendada: 70–170 caracteres" });
  try {
    if (new URL(meta.url).protocol !== "https:") issues.push({ field: "url", message: "Usa HTTPS" });
  } catch {
    issues.push({ field: "url", message: "URL inválida" });
  }
  return issues;
}

export const normalizeSiteUrl = (raw: string | undefined, fallback: string): string => {
  try {
    return new URL(raw || fallback).origin;
  } catch {
    return fallback;
  }
};
