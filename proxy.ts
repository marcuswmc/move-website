import { NextResponse, type NextRequest } from "next/server";

const LEGACY_FILTERS = ["_ecossistema", "_segmento", "_servico"] as const;

/** URLs dos filtros do site anterior continuam a ser rastreadas. Normalizá-las
 * antes do SSR evita carregar o portfólio para cada combinação obsoleta. */
export function proxy(request: NextRequest) {
  if (request.method !== "GET" && request.method !== "HEAD") return NextResponse.next();

  const url = request.nextUrl.clone();
  if (!LEGACY_FILTERS.some((key) => url.searchParams.has(key))) return NextResponse.next();

  for (const key of LEGACY_FILTERS) url.searchParams.delete(key);
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: [
    { source: "/portfolio", has: [{ type: "query", key: "_ecossistema" }] },
    { source: "/portfolio", has: [{ type: "query", key: "_segmento" }] },
    { source: "/portfolio", has: [{ type: "query", key: "_servico" }] },
  ],
};
