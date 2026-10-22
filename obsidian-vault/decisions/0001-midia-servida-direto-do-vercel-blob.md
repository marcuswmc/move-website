---
type: decision
status: done
date: 18-09-2026
tags: [claude/decision]
---
# Mídia servida direto do Vercel Blob

Context: [[CLAUDE]]

## Context

A collection Media publicava todo arquivo em `/api/media/file/<nome>`, uma rota do
Payload. Cada imagem virava uma invocação de função que subia o Payload inteiro e
abria conexão com o Mongo só para devolver bytes que já estavam no Blob.

Medido em produção antes da mudança:

| | cache HIT | cache MISS |
|---|---|---|
| `/api/media/file/*` | 70 ms | **4,3–4,5 s** |
| store do Blob, direto | — | ~400 ms |

Com ~30 logos pedidos de uma vez na home, o otimizador do `next/image` desistia de
parte deles: **13 de 42** requisições a `/_next/image` voltavam
`400 INVALID_IMAGE_OPTIMIZE_REQUEST`. Era a causa das imagens que apareciam aos
poucos e das que só surgiam ao recarregar.

## Decision

`disablePayloadAccessControl: true` na collection `media`, em `payload.config.ts`.
`doc.url` passa a ser o endereço público do store
(`https://<store>.public.blob.vercel-storage.com/<arquivo>`), servido pelo CDN sem
função e sem banco.

O hook `afterRead` do plugin recalcula `url` a cada leitura a partir do `filename`,
então os documentos já gravados não precisaram de migração. Um 301 de
`/api/media/file/:path*` para o store preserva as imagens de OG já rastreadas.

## Alternatives considered

- **Aumentar o cache da rota do Payload.** Não resolve o MISS, que era o caso caro,
  e o primeiro visitante de cada imagem continuaria esperando 4 s.
- **Aumentar a memória da função.** Ataca o sintoma; a rota continuaria a subir o
  Payload e a abrir conexão com o Mongo por arquivo.

## Consequences

- O acesso de leitura da collection já era `anyone`, então não houve regra de
  autorização perdida.
- `images.remotePatterns` precisa do host do Blob — está com curinga
  (`*.public.blob.vercel-storage.com`) para preview e produção não dependerem de um
  id fixo.
- O ETag longo que o handler do Payload montava deixou de existir: o Blob devolve um
  MD5 curto, e o problema de `ENAMETOOLONG` no cache de imagem foi embora junto.
- Verificado em produção depois do deploy: 38 imagens da home, todas 200, zero 400.
