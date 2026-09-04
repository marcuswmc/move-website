# Campos

[← Índice](README.md)

Como escolher, escrever e agrupar campos — e os três helpers que o projeto criou
para não repetir decisões.

## Anatomia

```ts
{
  name: "summary",              // chave no documento (inglês, camelCase)
  type: "textarea",
  label: "Resumo",              // o que o editor lê (português)
  required: true,
  index: true,                  // cria índice no Mongo — para filtro/busca/ordenação
  maxLength: 240,
  defaultValue: "",
  admin: {
    description: "Uma a duas linhas para o card da listagem.",
    position: "sidebar",        // tira do corpo principal
    condition: (data) => data?.type === "download",
  },
}
```

Duas convenções que valem sempre:

- **`name` em inglês, `label` em português.** O código fica legível e o admin
  fica em pt-BR.
- **`admin.description` é documentação para quem publica.** Escreva o que
  acontece na tela — inclusive o que acontece se o campo ficar vazio. Compare:

  > ❌ "Resumo do projeto."
  > ✅ "Uma a duas linhas para o card da listagem e para a abertura da página do
  > projeto. Se ficar vazio, o card usa o começo do Desafio e a abertura da
  > página não exibe nada."

  A segunda versão evita um chamado de suporte. É o padrão do repositório.

## Tipos em uso

| Tipo | Onde é usado | Observações |
| --- | --- | --- |
| `text` | títulos, nomes, URLs, ano | `maxLength` quando o layout depende disso |
| `textarea` | resumos, descrições curtas | preferir a `text` para tudo que passa de uma linha |
| `richText` | corpo de projeto e publicação | Lexical; renderizar com `<RichText />` |
| `number` | `order` | sempre com `defaultValue: 0` |
| `checkbox` | `featured` em publicações | |
| `select` | tom, ecossistema, tipo, grupo, cor | **listas fechadas** — ver abaixo |
| `date` | `publishedAt` | com `admin.date.pickerAppearance` |
| `email` | contato | valida formato |
| `upload` | arquivo de publicação | `relationTo: "media"` |
| `relationship` | projeto→parceiro, publicação→categorias | `hasMany` quando for lista |
| `join` | parceiro→projetos | só leitura, não é armazenado |
| `group` | `hero`, `contact`, `social` | agrupa campos sob uma chave |
| `array` | `nav`, `metrics`, `showcase`, `affiliations` | lista repetível ordenável |
| `row` | pares lado a lado | só layout, não cria nível no documento |
| `tabs` | Projects, Publications, Home | só layout |

### `select` — sempre lista fechada

Nenhum `select` do projeto aceita texto livre, e a razão é sempre a mesma: **cada
valor corresponde a algo já escrito no código.** Um tom fora da lista renderiza
um card sem estilo; um ecossistema fora da lista cai no fallback roxo.

Quando as opções também são necessárias fora do CMS (por exemplo no filtro de
`/portfolio`, que precisa listar todas as opções mesmo as que ainda não têm
projeto), a lista mora em `lib/`:

```ts
// lib/taxonomy.ts
export const ECOSYSTEMS = ["Meio Ambiente", "Educação", /* … */] as const;

// collections/Projects.ts
options: ECOSYSTEMS.map((value) => ({ label: value, value })),
```

Um componente cliente não pode importar `collections/Projects.ts` sem arrastar o
Payload para o bundle do navegador — daí a lista viver em `lib/taxonomy.ts`.

**Ao acrescentar um ecossistema**, mexa em três lugares ou ele fica sem
identidade visual:

1. `ECOSYSTEMS` em [`lib/taxonomy.ts`](../lib/taxonomy.ts)
2. `ECOSYSTEM_SURFACE` em [`lib/palette.ts`](../lib/palette.ts) (cor)
3. `ECOSYSTEM_ICON` em [`lib/filterIcons.ts`](../lib/filterIcons.ts) (grafismo)

O ecossistema define a cor **padrão** do card. O campo "Cor do card"
(`projectCardColorField()` em [`fields/toneField.ts`](../fields/toneField.ts))
fica na barra lateral do projeto e sobrepõe essa escolha caso a caso; suas
opções saem de `SURFACE_OPTIONS`, então cada cor de fundo já chega com a cor de
tipografia que o guia manda usar.

### `group` vs `array` vs `row` vs `tabs`

- **`group`** cria um nível no documento: `hero.title`, `contact.email`. Use
  quando os campos formam uma unidade conceitual.
- **`array`** é lista repetível que a Move ordena arrastando. Use `maxRows`
  quando o layout tem limite real (`showcase` tem `maxRows: 6`).
- **`row`** é **só layout**: coloca campos lado a lado no admin sem criar nível
  no documento. `{ type: "row", fields: [...] }` — repare que não tem `name`.
- **`tabs`** é **só layout**: separa um formulário longo em abas. Também sem
  `name`. Vale a partir de ~8 campos; `Projects` separa "Projeto" de
  "Classificação", e o plugin de SEO acrescenta a aba "SEO" sozinho.

Campos de metadado (ordem, tom, tipo, destaque) vão para
`admin: { position: "sidebar" }` — ficam fora das abas, sempre visíveis.

## Os três helpers do projeto

Ficam em [`fields/`](../fields/) e retornam um objeto de campo. São a forma de
não repetir uma decisão que já foi tomada uma vez.

### `imageField()` — imagem em duas vias

```ts
import { imageField } from "@/fields/imageField";

imageField()                                            // grupo "image"
imageField({ required: true })
imageField({ name: "cover", label: "Capa", required: true })
imageField({ name: "photo", label: "Retrato", required: true })
imageField({ name: "logo", label: "Logo", required: true,
             description: "Prefira SVG ou PNG com fundo transparente." })
```

Gera um `group` com três campos: `media` (upload), `externalUrl` (texto,
escondido quando há upload) e `alt`.

**Por que duas vias:** o redesign ainda usa fotografia do Unsplash como
placeholder. Em vez de baixar dezenas de placeholders para o repositório, o campo
aceita a URL enquanto for provisória — e no dia em que a Move subir a fotografia
própria, **o upload passa a ter prioridade sobre a URL**, sem ninguém tocar no
código. Quem aplica essa regra é `resolveImage()`:

```ts
// lib/resolveImage.ts
const src = media?.url ?? image.externalUrl;
return { src, alt: media?.alt ?? image.alt ?? "" };
```

O `alt` do documento de mídia vence o do campo: quem sobe a imagem descreve a
imagem que subiu, e essa descrição acompanha o arquivo onde quer que ele apareça.

**Sempre use `imageField()` para imagem de conteúdo.** Um `upload` cru perde o
fallback de URL e a regra de `alt`.

### `toneField` / `showcaseToneField()` — tom de cor

```ts
import { showcaseToneField } from "@/fields/toneField";

showcaseToneField()   // roxo | branco | amarelo — os cards empilhados da home
```

Select fechado na sidebar. Cada valor corresponde a uma combinação de classes já
escrita em `components/PortfolioStack.tsx`.

Para criar um conjunto de tons para outro componente, exporte uma nova função no
mesmo arquivo usando o `toneField` interno — e escreva as classes correspondentes
no componente **antes** de oferecer a opção no admin.

### `iconField()` — grafismos da marca

```ts
import { iconField } from "@/fields/iconField";

iconField()          // campo "icon"
iconField("glyph")   // outro nome
```

Select fechado com os SVGs de `public/brand/icons/`. O valor gravado é o caminho
(`/brand/icons/Group 7.svg`). Para adicionar um grafismo: coloque o arquivo na
pasta **e** acrescente o nome ao array `BRAND_ICONS`.

### Quando criar um helper novo

Quando a mesma decisão precisar ser repetida em três lugares e errá-la quebrar
algo — não por economia de linhas. Os três helpers existentes protegem,
respectivamente: a regra de prioridade upload/URL, o vínculo tom→classes CSS e o
vínculo ícone→arquivo existente.

## Validação

```ts
{
  name: "media",
  type: "upload",
  relationTo: "media",
  validate: (value, { siblingData }) => {
    if (!required) return true;
    if (!value && !siblingData?.externalUrl) {
      return "Envie uma imagem ou informe uma URL externa.";
    }
    return true;
  },
}
```

Retorne `true` para válido ou uma **string em português** com a mensagem de erro
— ela aparece no admin. É o mecanismo do `imageField` para exigir "upload **ou**
URL", algo que `required` sozinho não expressa.

## Campos automáticos

Você não declara, mas eles existem em todo documento:

| Campo | Origem |
| --- | --- |
| `id` | Mongo |
| `createdAt`, `updatedAt` | Payload |
| `_status` | `versions.drafts: true` |
| `meta` (título, descrição, imagem) | `seoPlugin`, nas collections/globals listados |
| `url`, `filename`, `mimeType`, `filesize`, `width`, `height`, `sizes` | collection com `upload` |

## Depois de mexer em campos

```bash
pnpm generate:types
```

E confira a camada de leitura: um campo novo só chega ao site depois de ser
incluído no retorno da função correspondente em
[`lib/content.ts`](camada-de-conteudo.md).

### Renomear ou remover um campo

O Mongo não migra sozinho. Ao **renomear** `name`, o valor antigo continua no
documento sob a chave velha e o campo novo nasce vazio — a Move precisa
repreencher, ou você escreve um script de migração pontual em `scripts/`. Ao
**remover**, o dado permanece no banco, invisível; só some se algo o apagar
explicitamente. Prefira renomear apenas o `label` sempre que possível.
