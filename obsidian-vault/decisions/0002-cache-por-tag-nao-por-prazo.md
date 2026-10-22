---
type: decision
status: done
date: 18-09-2026
tags: [claude/decision]
---
# Cache por tag, não por prazo

Context: [[CLAUDE]]

## Context

Todas as páginas usavam `revalidate = 60`. O prazo curto existia porque era o
**único** mecanismo de publicação: quem editasse no `/admin` esperava até um minuto
para ver a mudança. O preço disso é trabalho repetido — uma página com visita
constante era recalculada até 144 vezes por dia para produzir HTML byte a byte
idêntico, e cada recálculo sobe o Payload e abre conexão com o Mongo.

Isso apareceu como consumo de Fluid Active CPU: as revalidações em background
aparecem nos logs como `source: serverless, cache: STALE`.

## Decision

Separar frescura de prazo.

Toda leitura de `lib/content.ts` passa por `cachedRead()` (em `lib/cache.ts`), que
empilha `cache()` do React (dedup por request) sobre `unstable_cache` (entre
requests) e declara uma tag por collection/global. Cada collection e global chama
`revalidatesCollection` / `revalidatesGlobal` (`lib/revalidate.ts`) e purga suas tags
ao salvar.

Resultado: a edição aparece **na requisição seguinte**, e o prazo pôde subir de
60 s para 86400 s (um dia), onde é só rede de segurança para uma invalidação perdida.

`TAG.media` entra em quase toda leitura, porque uma imagem trocada muda o `src`
resolvido em qualquer página que a exiba sem que o documento que a referencia seja
salvo.

## Alternatives considered

- **Só aumentar o prazo.** Atrasaria a publicação na mesma proporção — inaceitável
  para quem edita no admin.
- **`revalidatePath` nos hooks.** Exigiria enumerar à mão quais rotas cada documento
  afeta, e um projeto novo quebraria a lista em silêncio. A tag é declarada na
  leitura, onde a dependência de fato existe.
- **`revalidate = false`.** Sem rede de segurança: uma invalidação perdida ou uma
  edição feita direto no banco ficaria presa até o próximo deploy.

## Consequences

- `revalidateTag` exige segundo argumento desde o Next 16. Usa-se `"max"`, que é a
  purga imediata. `updateTag` não serve: recusa-se a rodar fora de uma Server Action,
  e o admin do Payload escreve por route handlers.
- Os hooks rodam dentro de um request do Next. Pelo CLI do Payload (seed, importação)
  a chamada estoura, daí o `try/catch` — ali não há cache a invalidar.
- Leitura nova → precisa de chave e das tags de que depende. Collection nova →
  precisa de `revalidatesCollection(...)`. Esquecer qualquer um dos dois faz o
  conteúdo ficar preso até o prazo de um dia.
