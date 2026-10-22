---
type: decision
status: done
date: 18-09-2026
tags: [claude/decision]
---
# URLs legadas: 301 para o migrado, 410 para o resto

Context: [[CLAUDE]]

## Context

O site anterior era WordPress no mesmo domínio. O plugin *Filter Everything*
publicava links rastreáveis para combinações de filtros do portfólio, e a fila do
rastreador sobreviveu à migração: meses depois, ainda chegavam ~790 pedidos/dia a
esses endereços.

Uma primeira mitigação trocou os filtros antigos por **301 para `/portfolio`**. Não
funcionou: numa amostra de 50 pedidos, 22 pares mostraram o rastreador seguindo o
redirecionamento em 35–313 ms e provocando a renderização do portfólio assim mesmo.
O 301 deu a ele um próximo endereço válido para pedir.

O acervo completo de endereços antigos foi recuperado do Wayback Machine: 1.059
caminhos, entre `/case/<slug>/`, `/projeto/<slug>/`, permalinks de post na raiz,
taxonomias (`/tag/`, `/cat/`, `/category/`, `/author/`, `/ecossistema/`, `/servico/`,
`/segmento/`), arquivos por data e uma versão em inglês (`/en/`).

## Decision

Separar pelo que sobreviveu à migração. As duas listas vivem em `lib/legacy-urls.ts`
e são ligadas em `next.config.ts`:

- **`LEGACY_REDIRECTS` → 301** para o endereço real novo. 157 entradas: 90
  `/case/<slug>/`, 51 permalinks de publicação e os apelidos de seção (`/blog/`,
  `/casos/`, `/sobre/`, `/teoria-de-mudanca/`, `/contato-2/`).
- **`LEGACY_GONE` / `LEGACY_GONE_PREFIXES` → 410** via `rewrites()` para
  `/conteudo-removido`. Taxonomias, arquivos por data, `/en/` e os ~93 posts que não
  vieram.

O 410 é o ponto. Um 301 para a listagem é lido como *soft 404*: o buscador mantém o
endereço na fila e continua pedindo. O 410 é a única resposta que o tira do índice.

`app/sitemap.ts` publica o conjunto real de URLs — é o que dá ao rastreador um motivo
para trocar a lista herdada pela verdadeira. Antes disso `/sitemap.xml` dava 404.

## Alternatives considered

- **301 para a listagem em tudo.** Já tinha sido tentado e falhou, pelo motivo acima.
- **Deixar cair no 404 estático.** Para o Google equivale ao 410 (a doc diz que o 410
  é processado um pouco mais rápido) e sairia de graça, porque `/_not-found` é
  pré-renderizado. Foi escolha deliberada do usuário priorizar o sinal mais forte.
- **Tudo no `proxy.ts`.** O `matcher` do middleware exige literais estáticos no
  build, e a lista tem 88 entradas — duplicá-la à mão em dois lugares seria uma
  divergência esperando para acontecer. Por isso os 410 saem de `rewrites()`.

## Consequences

- `proxy.ts` ficou só com os filtros `_ecossistema`/`_segmento`/`_servico`, que
  nenhuma regra por caminho consegue pegar.
- Em produção esses filtros respondem **403, não 410**: a regra do WAF (`Legacy
  portfolio filter URLs`, ação Deny) roda antes da aplicação. É mais barato — tráfego
  mitigado pelo WAF é grátis — mas um 403 não tira a URL do índice. Trade-off aceito.
- `/conteudo-removido` custa uma invocação por pedido. `force-static` não resolve: o
  Next não pré-renderiza route handler que responde fora da faixa 2xx — foi testado.
  Na amostra de logs esses endereços não recebiam tráfego orgânico. Se mudar, o
  caminho barato é acrescentar os prefixos à regra do firewall.
