/**
 * Destino dos endereços do WordPress que não têm equivalente no site novo. Os
 * `rewrites()` de next.config.ts mandam para cá sem mudar a URL da barra de
 * endereços, e a resposta é 410.
 *
 * Um 410 é a única resposta que faz um buscador tirar o endereço do índice em vez de
 * o manter na fila e voltar. Um 301 para a listagem seria lido como soft 404 e o
 * rastreamento continuaria — foi exatamente o que aconteceu com os filtros antigos
 * do portfólio antes da correção (ver output/investigacao-crawlers/relatorio.md).
 *
 * O corpo é texto curto de propósito: sem HTML e sem link, para não oferecer ao
 * rastreador um próximo endereço a pedir. Nada aqui toca no CMS.
 */
const BODY = "Esta página não existe mais. O site da Move está em https://move.social.";

const HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "X-Robots-Tag": "noindex, nofollow",
  "Cache-Control": "public, max-age=86400",
};

export function GET() {
  return new Response(BODY, { status: 410, headers: HEADERS });
}

export function HEAD() {
  return new Response(null, { status: 410, headers: HEADERS });
}
