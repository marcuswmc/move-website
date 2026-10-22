---
type: decision
status: done
date: 18-09-2026
tags: [claude/decision]
---
# Nenhuma página pública lê searchParams

Context: [[CLAUDE]]

## Context

A conta estourou o Fluid Active CPU do plano Hobby (4 h 26 s de 4 h). Nos logs de
runtime, 34% das requisições invocavam função — e uma rota respondia por quase tudo:

```
10x  /portfolio    cache=MISS   source=serverless
```

**Toda** visita a `/portfolio`, inclusive a maioria que não filtrava nada. Todas as
outras páginas saíam do CDN (`static`, `HIT`/`PRERENDER`).

A causa era uma linha: a página lia `searchParams` para aplicar o `?cliente=` do
carrossel de parceiros. Basta ler `searchParams` para o Next marcar a rota como
dinâmica — e aí cada visitante paga um boot do Payload.

O guia da Vercel sobre Active CPU esclarece o mecanismo: espera de I/O e consultas a
banco **não contam**; o que conta é execução de código. O custo era o boot do Payload
e a renderização, não a espera do Mongo.

## Decision

Nenhuma página pública lê `searchParams`.

O filtro por cliente virou `/portfolio/cliente/[slug]`, pré-renderizada uma vez por
cliente via `generateStaticParams()` sobre `getClientSlugs()` — 74 páginas. A
filtragem continua no servidor, então os cards certos estão no HTML inicial, sem
piscar e sem depender de JavaScript. O `?cliente=` antigo redireciona com 301 na
camada de roteamento, sem invocar função.

Regra geral para filtros novos: se o conjunto de valores é conhecido no build, vire
rota; se não é, filtre no cliente.

## Alternatives considered

- **Ler o parâmetro no componente cliente (`useSearchParams`).** Deixaria
  `/portfolio` estática, mas o filtro só aplicaria depois da hidratação: lista
  inteira piscando antes de filtrar, e nada sem JavaScript. Um trabalho anterior de
  performance tinha corrigido exatamente esse CLS; seria regressão.
- **Aceitar o custo.** Não cabia: a conta já estava acima do limite.

## Consequences

- `/portfolio` passou de `ƒ` (dinâmica) para `○` (estática) no build. Verificado em
  produção: 0 de 9 requisições invocaram função, contra 10 de 10 antes.
- Cada cliente ganhou um endereço canônico e indexável, melhor que um parâmetro de
  query, e entrou no `sitemap.ts`.
- `/portfolio/cliente/[slug]` depende de `getClientSlugs()`, que precisa das tags
  `projects` e `partners` para não ficar preso quando um parceiro muda.
- As únicas rotas `ƒ` restantes são `/admin/*`, `/api/*` (o Payload, inevitável) e
  `/conteudo-removido` (ver [[decisions/0003-urls-legadas-301-para-o-migrado-410-para-o-resto]]).
