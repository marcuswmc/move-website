# Documentação de desenvolvimento — Move Social

Guia para quem for manter, estender ou assumir o desenvolvimento deste site.

> **Para quem edita conteúdo**, nada aqui é necessário: texto, imagens, projetos,
> equipe e publicações são editados em `/admin`. Esta documentação é para quem
> mexe em **código**.

## Por onde começar

| Documento | O que responde |
| --- | --- |
| [Arquitetura](arquitetura.md) | Como as peças se encaixam, mapa de pastas, fluxo de dados de ponta a ponta |
| [Collections](payload-collections.md) | Criar e configurar uma collection no Payload |
| [Campos](payload-campos.md) | Catálogo de tipos de campo, helpers do repositório, quando criar um |
| [Globals](payload-globals.md) | Páginas de conteúdo único (Home, Contato, Teoria da Mudança…) |
| [Camada de conteúdo](camada-de-conteudo.md) | `lib/content.ts`, a única ponte entre o CMS e o site |
| [Páginas e rotas](paginas-e-rotas.md) | App Router, server/client components, SEO, cache |
| [Componentes e design](componentes-e-design.md) | Tokens da marca, paleta, animação, componentes base |
| [Carregamento e renderização](performance-renderizacao.md) | Melhorias, medições e operação das prévias de imagens |
| [Infra](infra.md) | MongoDB, Vercel Blob, variáveis de ambiente, deploy |
| [Receitas](receitas.md) | Passo a passo completo das tarefas mais comuns |
| [Troubleshooting](troubleshooting.md) | Erros conhecidos e o que os causa |
| [Guia de cores da marca](brand-guide-cores.md) | Tabela oficial de cores e contraste (documento do cliente) |

## Setup em cinco minutos

**Pré-requisitos**

- Node `^18.20.2 || >=20.9.0`
- pnpm **11.21.0** (está fixado em `packageManager` no `package.json`)
- Acesso ao cluster MongoDB Atlas e ao Blob store da Vercel

```bash
corepack enable && corepack prepare pnpm@11.21.0 --activate
```

**Instalar e rodar**

```bash
pnpm install
cp .env.example .env   # preencha as três variáveis
pnpm dev
```

- Site: <http://localhost:3000>
- Admin: <http://localhost:3000/admin>

Na primeira execução com um banco vazio, `/admin` abre a tela de criação do
primeiro usuário. Depois disso o Payload bloqueia essa rota sozinho.

**Variáveis de ambiente** (as três são obrigatórias, inclusive em dev — veja
[Infra](infra.md) para o porquê de cada uma):

```
DATABASE_URL=mongodb+srv://user:senha@cluster.xxxxx.mongodb.net/move-social?retryWrites=true&w=majority
PAYLOAD_SECRET=<string aleatória de 32+ bytes>
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_<store>_<hash>
```

## Comandos

| Comando | O que faz |
| --- | --- |
| `pnpm dev` | Servidor de desenvolvimento (site + admin) |
| `pnpm build` | `payload generate:importmap` seguido de `next build` |
| `pnpm start` | Serve o build de produção |
| `pnpm lint` | ESLint via `next lint` |
| `pnpm generate:types` | Regenera `payload-types.ts` a partir do config |
| `pnpm generate:importmap` | Regenera `app/(payload)/admin/importMap.js` |
| `pnpm seed` | **Apaga e recarrega** todo o conteúdo a partir de `data/site.ts` |
| `pnpm seed:theory` | Recarrega apenas o global da Teoria da Mudança |
| `pnpm migrate:media` | Sobe o conteúdo de `./media` para o Vercel Blob |

> ⚠️ `pnpm seed` é destrutivo. Ele existe para a **carga inicial** e sobrescreve
> qualquer edição feita no admin. Como dev e produção compartilham o mesmo banco
> Atlas, rodar em dev apaga o conteúdo de produção. Leia
> [Troubleshooting](troubleshooting.md#o-seed-apagou-conteúdo-de-produção) antes.

Não há suíte de testes neste projeto.

## As cinco regras que evitam 90% dos problemas

1. **Copy é conteúdo, não código.** Texto, número, imagem e ordem se mudam em
   `/admin`. Só se toca no código quando muda a *forma* do conteúdo (campo novo,
   seção nova). Ver [Arquitetura](arquitetura.md#a-regra-central).
2. **Componentes nunca importam do Payload.** Eles recebem props simples.
   `lib/content.ts` é o único arquivo que lê o CMS.
   Ver [Camada de conteúdo](camada-de-conteudo.md).
3. **Fundo e cor de texto são uma decisão só.** Use `SURFACES` em
   `lib/palette.ts`, nunca um `bg-move-*` com uma cor de texto escolhida na hora.
   Ver [Componentes e design](componentes-e-design.md#paleta-e-contraste).
4. **`BLOB_READ_WRITE_TOKEN` é obrigatório em dev.** Sem ele o Payload volta a
   gravar em disco **em silêncio**, e como o banco é compartilhado o site de
   produção passa a apontar para arquivos que não existem lá.
   Ver [Infra](infra.md#vercel-blob).
5. **Depois de mexer em collection, global ou campo, rode `pnpm generate:types`.**
   O `payload-types.ts` é o contrato de tipos de todo o resto.
