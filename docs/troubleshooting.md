# Troubleshooting

[← Índice](README.md)

Erros já vistos neste projeto e o que os causa.

---

## Conteúdo e CMS

### O conteúdo publicado não aparece no site

Três causas, nesta ordem de frequência:

1. **O documento está como rascunho.** Collections com `versions.drafts: true`
   nascem em `draft` e só entram no site depois de **Publicar**.
2. **A invalidação por tag não chegou.** O normal é a edição aparecer na
   requisição seguinte, porque a collection purga suas tags ao salvar (ver
   `lib/revalidate.ts`). Se não apareceu, confira se a collection tem
   `revalidatesCollection(...)` em `hooks` e se a leitura correspondente em
   `lib/content.ts` declara a mesma tag. No pior caso o conteúdo sai sozinho em
   um dia, pelo `FALLBACK_TTL`.
3. **A função de leitura não filtra o que você espera.** Confira `where`, `sort`
   e principalmente `limit` em `lib/content.ts`.

### A listagem para no décimo item

Falta `limit: 0` na consulta. O padrão do Payload é 10.

```ts
payload.find({ collection: "projects", where: PUBLISHED, sort: "order", limit: 0 })
```

### O site subiu vazio, sem erro nenhum

A `DATABASE_URL` está sem o nome do banco antes do `?` — o driver conectou no
banco `test`.

```
mongodb+srv://user:senha@cluster.xxxxx.mongodb.net/move-social?retryWrites=true&w=majority
                                                  └──────────┘
```

### Um campo novo não chega ao componente

Ele precisa passar por três lugares: declarado na collection → incluído no
`return` da função em `lib/content.ts` → passado como prop. Pular o segundo é o
esquecimento mais comum.

E rode `pnpm generate:types` — sem isso o TypeScript nem enxerga o campo.

### Renomeei um campo e o conteúdo sumiu

O Mongo não migra. O valor antigo continua no documento sob a chave velha e o
campo novo nasceu vazio. Opções: repreencher no admin, ou escrever um script
pontual em `scripts/`. Prefira renomear só o `label`.

### O global volta vazio

Um global nunca salvo devolve um objeto praticamente sem campos — `required` não
protege a leitura. Abra `/admin`, preencha e salve uma vez. Na camada de
conteúdo, trate campos opcionais com `??`.

### O seed apagou conteúdo de produção

`pnpm seed` é destrutivo por design e o banco é compartilhado entre dev e
produção. Recuperação:

- Collections com drafts guardam as **20 últimas versões** por documento — dá
  para restaurar documento a documento pelo histórico no admin.
- Se houver backup do Atlas (depende do tier do cluster), restaure por lá.

Prevenção: aponte o `.env` local para outro banco antes de rodar qualquer script
destrutivo.

---

## Imagens e uploads

### A imagem quebra em produção mas funciona em dev

Quase sempre `BLOB_READ_WRITE_TOKEN` ausente ou errado em algum ambiente. **Sem
o token o plugin se desativa em silêncio** e grava em disco local; o documento
chega ao banco compartilhado e o arquivo fica só na sua máquina.

Verifique:

1. O token existe em dev **e** na Vercel (Production e Preview).
2. O formato é `vercel_blob_rw_<store>_<hash>`. `BLOB_STORE_ID` e
   `VERCEL_OIDC_TOKEN` **não servem**.
3. Para os arquivos que já ficaram para trás: `pnpm migrate:media`.

### Imagem do CMS responde 404 no store

O documento existe no Mongo, o arquivo não existe no Blob. Mesmo diagnóstico
acima. `pnpm migrate:media` sobe o que estiver em `./media` (idempotente, nunca
sobrescreve).

Desde `disablePayloadAccessControl` o endereço público é o do store
(`https://<store>.public.blob.vercel-storage.com/<arquivo>`), não mais
`/api/media/file/*` — teste direto no store para separar "arquivo não está lá" de
"a aplicação não está a servir".

### `/_next/image` responde `400 INVALID_IMAGE_OPTIMIZE_REQUEST`

O otimizador não conseguiu buscar a origem. Foi o sintoma de quando as mídias
ainda passavam por `/api/media/file/*`: a rota subia o Payload e abria conexão com
o Mongo a cada arquivo, levava 4 s em cache MISS, e um lote de imagens pedidas de
uma vez estourava. Se voltar a acontecer, confira que `payload.config.ts` mantém
`disablePayloadAccessControl: true` e que o host do store está em
`images.remotePatterns`.

### `Invalid src prop … hostname is not configured`

Erro do `next/image`. O domínio precisa estar em `remotePatterns` no
[`next.config.ts`](../next.config.ts). Hoje só `images.unsplash.com` está
liberado.

### Subi uma foto e o placeholder continua aparecendo

O upload tem prioridade sobre a URL externa, então isso normalmente é cache —
espere a revalidação (60s). Se persistir, confira se o upload foi no campo
**Imagem** do grupo, e não em outro lugar.

---

## Build e tipos

### `Property 'x' does not exist on type …`

`pnpm generate:types`. Sempre que mexer em collection, global ou campo.

### O build falha na Vercel e passa localmente

- Variáveis de ambiente faltando no ambiente da Vercel.
- `payload-types.ts` não commitado depois de uma mudança de schema.
- Build command alterado: precisa ser
  `payload generate:importmap && next build` — o `importMap.js` do admin é
  gerado nessa etapa.

### `ERR_PNPM_UNEXPECTED_STORE`

`node_modules` foi linkado por pnpm 11 e você está usando uma versão mais antiga.

```bash
corepack enable && corepack prepare pnpm@11.21.0 --activate
```

### Erro de tipo envolvendo `sharp`

O `.d.ts` do Payload traz uma cópia própria dos tipos do sharp, cujas sobrecargas
não batem com o sharp 0.34 instalado. Por isso o config tem
`sharp: sharp as unknown as SharpDependency`. É divergência só de tipagem — não
"conserte" removendo o cast.

### Mudei um componente do admin e ele não aparece

```bash
pnpm generate:importmap
```

O `app/(payload)/admin/importMap.js` é gerado. Também roda automaticamente no
`pnpm build`.

---

## Layout e animação

### A pilha de cards da home parou de grudar

`PortfolioStack` usa `position: sticky`. **Algum ancestral ganhou
`overflow-hidden`** — sticky para de funcionar em silêncio, sem erro no console.
Procure a classe subindo a árvore a partir da seção.

### Scroll travando, pin escapando, marcadores fora de lugar

Sintoma clássico de **duas instâncias de Lenis**. A única legítima é a de
`SmoothScroll`, montada no layout. Para rolagem programática use `getLenis()`.

### A página ganhou rolagem horizontal no mobile

Controles de formulário (`input`, `select`, `textarea`) carregam largura
intrínseca própria — um `input` pede cerca de 20 caracteres. Como item de grid ou
flex isso vira o piso da coluna (`min-width: auto`), a coluna estica além do
container e a página inteira rola. O `globals.css` já zera esse piso; se
reaparecer, procure um elemento novo com largura mínima implícita.

### Texto ilegível sobre um fundo colorido

Fundo e cor de texto foram escolhidos separadamente. Use `SURFACES` em
`lib/palette.ts` — ver [Componentes e design](componentes-e-design.md#paleta-e-contraste).

### A cor não aplica, a classe existe no código

Tailwind não enxerga nomes de classe montados em runtime: `bg-move-${cor}` não
gera CSS. É por isso que `SURFACES` escreve as classes por extenso. Se criou um
mapa novo, escreva as classes completas.

Confira também `content` em `tailwind.config.ts` — `lib/` está incluído
justamente porque `palette.ts` guarda classes.

---

## Admin

### `/admin` pede para criar o primeiro usuário de novo

O banco está vazio ou é outro. Confira a `DATABASE_URL` — em especial o nome do
banco.

### Não consigo entrar no admin

`PAYLOAD_SECRET` mudou: os tokens de sessão emitidos com o segredo anterior ficam
inválidos. Limpe os cookies e entre de novo. **Não troque o segredo em produção
sem necessidade.**

### O painel está em inglês

`i18n: { supportedLanguages: { pt }, fallbackLanguage: "pt" }` em
`payload.config.ts`. Se voltou ao inglês, essa configuração foi alterada.

---

## Diagnóstico rápido

```bash
pnpm lint
pnpm generate:types
pnpm build                       # o build local pega o que o dev não pega
```

Para inspecionar o que o CMS realmente devolve, a API REST responde direto:

```
http://localhost:3000/api/projects?limit=1&depth=1
http://localhost:3000/api/globals/site-settings
```

Há também o GraphQL playground em `/api/graphql-playground`.

> Leituras anônimas nessas rotas respeitam o access control — rascunho não
> aparece, do mesmo jeito que no site.
