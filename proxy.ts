import { NextResponse, type NextRequest } from "next/server";

const LEGACY_FILTERS = ["_ecossistema", "_segmento", "_servico"] as const;

/** Os filtros do WordPress foram desativados. Uma resposta terminal evita que
 * crawlers sigam um redirecionamento e provoquem outra renderização do portfólio. */
export function proxy(request: NextRequest) {
  if (request.method !== "GET" && request.method !== "HEAD") return NextResponse.next();

  if (!LEGACY_FILTERS.some((key) => request.nextUrl.searchParams.has(key))) return NextResponse.next();

  return new NextResponse(
    request.method === "HEAD" ? null : "Estes filtros antigos foram desativados. O portfólio está disponível em /portfolio.",
    {
      status: 410,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}

export const config = {
  matcher: [
    { source: "/portfolio", has: [{ type: "query", key: "_ecossistema" }] },
    { source: "/portfolio", has: [{ type: "query", key: "_segmento" }] },
    { source: "/portfolio", has: [{ type: "query", key: "_servico" }] },
  ],
};
