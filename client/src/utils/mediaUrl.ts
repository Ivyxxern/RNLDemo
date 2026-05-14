const DEFAULT_API_BASE =
  "http://localhost/RNLDemo/server/public/api";

/**
 * Laravel `public` folder origin (sibling of `/api`), used to resolve root-relative
 * `/storage/...` URLs from the API when the SPA runs on another host (e.g. Vite :5173).
 */
export function getServerPublicOrigin(): string {
  const base =
    (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ||
    DEFAULT_API_BASE;
  return base.replace(/\/?api\/?$/i, "");
}

/**
 * Turn API image hrefs into an absolute URL the browser can load from the SPA origin.
 */
export function toAbsoluteMediaUrl(
  href: string | null | undefined
): string | null {
  if (href == null || href === "") return null;
  const s = String(href).trim();
  if (/^https?:\/\//i.test(s)) {
    try {
      const u = new URL(s);
      if (u.pathname.startsWith("/storage/")) {
        return `${getServerPublicOrigin()}${u.pathname}${u.search}`;
      }
    } catch {
      /* ignore */
    }
    return s;
  }
  if (s.startsWith("//")) {
    const proto =
      typeof window !== "undefined" && window.location.protocol === "https:"
        ? "https:"
        : "http:";
    return `${proto}${s}`;
  }
  const origin = getServerPublicOrigin();
  if (s.startsWith("/")) return `${origin}${s}`;
  return `${origin}/${s.replace(/^\.\//, "")}`;
}
