---
type: decision
status: done
date: 22-10-2026
tags: [claude/decision]
---
# Segmentos viraram collection editável

Context: [[CLAUDE]]

## Context

Segmento era lista fechada em `lib/taxonomy.ts`, alimentando um `select` em
`collections/Projects.ts`. As `options` de um select do Payload são fixas no build:
criar um segmento novo exigia um deploy. A Move pediu para criar e editar os seus.

## Decision

Collection `project-segments` (`collections/ProjectSegments.ts`), espelhando
`PublicationCategories` — mesmo precedente, mesma estrutura. `Projects.segments` virou
`relationship` com `hasMany`.

Como o projeto guarda a referência e não o texto, **renomear vale para todos de uma
vez** — conferido em "Governo", onde uma edição mudou os 5 projetos que o usavam.

`PortfolioBrowser` deixou de importar a constante e passou a receber a lista por prop,
de um `getSegments()` novo que lê a collection — e não deriva as opções dos projetos
existentes. Isso preserva o comportamento deliberado de listar segmento com zero
projetos (ver o comentário em `components/FilterGroup.tsx`).

## Alternatives considered

- **Ecossistema e serviço também.** Ecossistema não pode: cada valor tem cor
  (`ECOSYSTEM_SURFACE`) e grafismo (`ECOSYSTEM_ICON`) presos a ele, e um valor fora dos
  mapas cairia num fallback silencioso cor de Açaí. Segmento não tem nenhum dos dois —
  é só rótulo de filtro. Serviço já é texto livre.
- **Manter o select e gerar as options de uma collection no build.** Continuaria
  exigindo deploy a cada segmento novo, que é exatamente o problema.

## Consequences

- Migração de **129 projetos e 438 versões** (`scripts/migrate-segments-to-collection.ts`).
  As versões entram porque guardam o documento inteiro: sem elas, restaurar uma versão
  antiga no admin gravaria texto num campo que espera id.
- **A migração escreve pelo driver, não por `payload.create`.** O Atlas M0 aborta as
  transações do Payload de forma intermitente (`TransientTransactionError` — aconteceu
  na primeira tentativa). Escrever direto também garante que a referência entre como
  ObjectId, que é o que o campo de relação espera na leitura. Vale para qualquer
  migração em massa neste projeto, enquanto o banco estiver no M0.
- O scalar legado `segment` e o espelho dele no `beforeValidate` saíram: guardariam um
  ObjectId num select. `segmentNames()` em `lib/content.ts` ainda aceita string, então
  um documento que escapasse da migração cai para o rótulo antigo em vez de quebrar.
- **Ordem importa num próximo caso assim:** migrar antes do deploy. Código novo lendo
  texto num campo de relação dá erro de cast; código antigo lendo ids só mostra rótulo
  feio no filtro, e as páginas são estáticas.
