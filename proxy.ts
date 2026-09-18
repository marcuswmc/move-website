import { NextResponse, type NextRequest } from "next/server";

const LEGACY_FILTERS = ["_ecossistema", "_segmento", "_servico"] as const;

/**
 * Os filtros do plugin Filter Everything do WordPress anterior foram a origem do
 * rastreamento em massa: cada combinação era um endereço rastreável, e a fila do
 * crawler sobreviveu à migração. A resposta é terminal — sem `Location`, sem HTML,
 * sem link — para não entregar ao rastreador um próximo endereço a pedir. O
 * portfólio e as consultas ao CMS dessa página não chegam a ser executados.
 *
 * O resto do acervo herdado do WordPress não passa por aqui: os endereços com
 * equivalente são resolvidos pelos 301 de next.config.ts e os sem equivalente pelos
 * `rewrites()` para /conteudo-removido, ambos na camada de roteamento.
 */
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
