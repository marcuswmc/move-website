# Infraestrutura — MongoDB, Vercel Blob e deploy

[← Índice](README.md)

## Visão geral

```
GitHub (marcuswmc/move-website)
        │  push
        ▼
   Vercel (build + hosting)
        ├── MongoDB Atlas  ← documentos (texto, relações, metadados)
        └── Vercel Blob    ← arquivos (imagens, PDFs, documentos)
```

Documento e arquivo são armazenados **separadamente**. O registro da mídia vive
no Mongo; o binário vive no Blob. Quando os dois desencontram, o site mostra
imagem quebrada e `/api/media/file/*` responde erro — foi o bug mais custoso do
projeto, e a seção do Blob abaixo explica como evitá-lo.

## Variáveis de ambiente

As três são **obrigatórias em todos os ambientes, dev inclusive**.

| Variável | Onde obter | Sem ela |
| --- | --- | --- |
| `DATABASE_URL` | Atlas → Database → Connect → Drivers | o Payload não sobe |
| `PAYLOAD_SECRET` | gere você mesmo | tokens de sessão inválidos |
| `BLOB_READ_WRITE_TOKEN` | Vercel → Storage → o Blob store → aba `.env.local` | **falha silenciosa** — ver abaixo |

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

`.env` está no `.gitignore`. O modelo comentado é [`.env.example`](../.env.example).

---

## MongoDB

Adaptador `@payloadcms/db-mongodb` (Mongoose), cluster no **MongoDB Atlas**.

### A connection string precisa do nome do banco

```
mongodb+srv://USUARIO:SENHA@cluster.xxxxx.mongodb.net/move-social?retryWrites=true&w=majority
                                                    └──────────┘
                                                    obrigatório, antes do "?"
```

Sem o nome, o driver conecta no banco `test` e o site sobe **vazio, sem erro
nenhum**. É a causa número um de "perdi todo o conteúdo".

Senha com caractere especial precisa de URL-encoding (`@` → `%40`).

### Não há migrações

O Mongo é schemaless: a coleção nasce quando o primeiro documento é gravado, e
adicionar um campo ao config não exige nada no banco. Em compensação:

- **Renomear um campo** deixa o valor antigo órfão sob a chave velha; o campo
  novo nasce vazio.
- **Remover um campo** deixa o dado no documento, invisível.
- Limpeza, quando necessária, é script pontual em `scripts/`.

### Um banco só para dev e produção

Hoje o `.env` local e a Vercel apontam para o **mesmo cluster**. Isso tem
consequências que precisam estar na cabeça de quem desenvolve:

- Conteúdo criado em dev aparece em produção.
- `pnpm seed` rodado em dev **apaga o conteúdo de produção**.
- Upload feito em dev sem `BLOB_READ_WRITE_TOKEN` grava o documento no banco
  compartilhado com um arquivo que só existe na sua máquina.

Se for trabalhar em mudanças estruturais de conteúdo, o certo é criar um banco
separado no Atlas e apontar o `.env` local para ele — basta trocar o nome do
banco na connection string.

### Acesso de rede

No Atlas, **Network Access** precisa liberar os IPs da Vercel. Como as functions
não têm IP fixo, na prática se usa `0.0.0.0/0` — a proteção real é a credencial
da connection string. Não comite essa string.

### Índices

`index: true` num campo cria índice no Mongo. O projeto indexa o que participa de
filtro, busca ou ordenação: `client`, `slug`, `ecosystem`, `service`, `segment`,
`title`, `type`, `name`, `group`. Indexar por indexar custa escrita — só indexe o
que consulta.

---

## Vercel Blob

Configurado em [`payload.config.ts`](../payload.config.ts):

```ts
vercelBlobStorage({
  collections: { media: true },
  token: process.env.BLOB_READ_WRITE_TOKEN,
})
```

### Por que existe

A collection `media` nasceu com `staticDir: "media"`, gravando em disco local.
Isso **só funciona em dev**: o filesystem das functions da Vercel é efêmero e
somente-leitura. Em produção o documento existia no Mongo, o arquivo não existia
em lugar nenhum, e `/api/media/file/*` respondia 500.

### `disablePayloadAccessControl`

```ts
vercelBlobStorage({
  collections: { media: { disablePayloadAccessControl: true } },
  token: process.env.BLOB_READ_WRITE_TOKEN,
})
```

Sem esta opção, `doc.url` aponta para `/api/media/file/<arquivo>` — uma rota do
Payload. Cada imagem virava uma invocação que subia o Payload e abria conexão com
o Mongo para devolver bytes que já estavam no Blob. Medido em produção, um cache
MISS levava 4,3–4,5 s por arquivo; com ~30 logos pedidos de uma vez, o otimizador
do `next/image` desistia de parte deles com `400 INVALID_IMAGE_OPTIMIZE_REQUEST`.
Eram as imagens que apareciam aos poucos e as que só vinham ao recarregar.

Com o controlo de acesso desligado, `url` passa a ser o endereço público do store
(`https://<store>.public.blob.vercel-storage.com/<arquivo>`), servido pelo CDN sem
função e sem banco. O hook `afterRead` do plugin recalcula `url` a cada leitura a
partir do `filename`, então documentos já gravados não precisam de migração.

A rota antiga não some para quem já a tinha: `next.config.ts` mantém um 301 de
`/api/media/file/:path*` para o store, o que preserva as imagens de OG já
rastreadas. O acesso de leitura da collection já era `anyone`, então não há regra
de autorização a perder.

### ⚠️ O token é obrigatório em dev

> **Sem `BLOB_READ_WRITE_TOKEN` o plugin se desativa em silêncio e volta a gravar
> em disco local.** Não há erro, não há aviso.

E como dev e produção compartilham o banco, isso recria exatamente o bug
original: o registro chega ao Mongo de produção, o arquivo fica na sua máquina, e
a imagem quebra no site publicado.

O token precisa ser da forma `vercel_blob_rw_<store>_<hash>` — o adaptador extrai
o id do store dele. As variáveis OIDC que a Vercel injeta por padrão
(`BLOB_STORE_ID`, `VERCEL_OIDC_TOKEN`) **não servem**.

### Migrar arquivos locais para o store

```bash
pnpm migrate:media
```

Sobe o que estiver em `./media` para o Blob. É idempotente e conservador: pula
nomes que já existem, nunca sobrescreve — uma foto que a Move tenha subido pelo
admin não é revertida para o placeholder. O script não escreve no banco; ele só
coloca o binário no lugar de onde o site já lê.

`/media` está no `.gitignore` e hoje guarda apenas sobras da carga inicial.

### A collection `media`

Aceita imagens, PDF, Word, Excel, PowerPoint, CSV, TXT e ZIP. Para imagens gera
três tamanhos — `thumbnail` (480×640), `card` (900) e `hero` (1800) — com
`focalPoint` e `crop` habilitados no admin. O `alt` é obrigatório.

Documentos (PDF etc.) são servidos como estão; o `sharp` só processa imagens.

---

## Next.js

### Cache e revalidação

A invalidação é por tag, não por prazo. Cada leitura de `lib/content.ts` passa
por `cachedRead()` e declara de que collections e globals depende; cada collection
e global chama `revalidatesCollection` / `revalidatesGlobal` (ver
[`lib/revalidate.ts`](../lib/revalidate.ts)), que purga essas tags ao salvar. Uma
edição no admin aparece na requisição seguinte, **sem deploy e sem espera**.

`revalidate = 86400` nas páginas e o dia de `FALLBACK_TTL` em
[`lib/cache.ts`](../lib/cache.ts) são rede de segurança, para o caso de uma
invalidação se perder — uma edição feita direto no banco, um hook que falhou. Não
são o mecanismo de publicação.

### Imagens

Em [`next.config.ts`](../next.config.ts):

```ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "images.unsplash.com" },
    { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
  ],
  localPatterns: [{ pathname: "/api/media/file/**" }, { pathname: "/**" }],
  minimumCacheTTL: 31_536_000,
}
```

O host do Blob é de onde vêm as mídias da collection Media desde
`disablePayloadAccessControl`. O curinga cobre qualquer store, para preview e
produção não dependerem de um id fixo no arquivo de configuração.

`minimumCacheTTL` sobe do padrão de 4 horas do Next 16 para um ano: o nome do
arquivo é a chave do objeto no Blob, então trocar a imagem de um documento grava
outro nome — nenhuma URL muda de conteúdo, e não há o que revalidar.

O Unsplash está liberado porque os placeholders do redesign vêm de lá (ver
`imageField` em [Campos](payload-campos.md)). **Uma imagem de domínio não listado
não renderiza** — dá erro do `next/image`, não fallback. Ao introduzir uma fonte
externa nova, acrescente o host aqui.

### `withPayload`

O config é exportado por `withPayload(nextConfig, { devBundleServerPackages: false })`.
O `extensionAlias` no webpack existe para resolver os imports com extensão `.js`
que o Payload emite. Mexa nisso só com motivo.

---

## Deploy

### Fluxo

1. `git push` na branch de produção
2. A Vercel roda `pnpm build`, que é `payload generate:importmap && next build`
3. Deploy

O `generate:importmap` **precisa** rodar antes do `next build`: ele regenera
`app/(payload)/admin/importMap.js`, que lista os componentes customizados do
painel. Não altere o script de build para pular essa etapa.

### Antes de subir

```bash
pnpm generate:types    # se mexeu em collection, global ou campo
pnpm lint
pnpm build             # o build local pega o que o dev não pega
```

Confira também:

- [ ] As três variáveis existem no ambiente da Vercel (Production **e** Preview)
- [ ] `BLOB_READ_WRITE_TOKEN` na forma `vercel_blob_rw_…`
- [ ] `DATABASE_URL` com o nome do banco antes do `?`
- [ ] `payload-types.ts` commitado junto com a mudança de schema
- [ ] Se acrescentou um domínio de imagem, ele está em `next.config.ts`

### Configuração na Vercel

- **Install Command**: `pnpm install` (a versão vem de `packageManager`)
- **Build Command**: padrão do `package.json`
- **Node**: 20 ou superior (`engines` pede `^18.20.2 || >=20.9.0`)
- **Variáveis**: as três, em todos os ambientes que devem funcionar

### Deploys de preview

Compartilham o mesmo banco e o mesmo Blob de produção. Um preview **não é um
ambiente isolado**: conteúdo criado ali é conteúdo de produção.

### Rollback

O rollback da Vercel volta o **código**, não o conteúdo. Se o problema foi
editorial, a recuperação é pelo histórico de versões do documento no admin —
collections com drafts guardam as 20 últimas versões.

### pnpm

`node_modules` foi linkado por pnpm 11. Rodar `pnpm add` com uma versão mais
antiga falha com `ERR_PNPM_UNEXPECTED_STORE`. Use a versão de `packageManager`:

```bash
corepack enable && corepack prepare pnpm@11.21.0 --activate
```
