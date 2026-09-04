# Componentes e design

[← Índice](README.md)

## A regra dos componentes

> **Componentes recebem props simples e não sabem que existe um CMS.**

Nenhum componente importa `payload`, `@/lib/payload` ou `@/lib/content` para
buscar dados. Pode importar **tipos** de `lib/content.ts` (`ProjectCard`,
`PublicationCard`) — tipo desaparece na compilação e não entra no bundle.

```tsx
// ✅
type Props = { services: { number: string; title: string; body: string; icon: string }[] };
export function ImpactServices({ services }: Props) { /* … */ }

// ❌
export async function ImpactServices() {
  const services = await getServices();   // acesso a dados dentro do componente
}
```

O que se ganha: o componente é testável e reaproveitável, e a origem do conteúdo
pode mudar sem que a interface saiba — foi exatamente o que aconteceu na migração
de `data/site.ts` para o Payload.

## Tokens da marca

Definidos em [`tailwind.config.ts`](../tailwind.config.ts), no namespace `move`.

### Cores

| Token | Hex | Nome no guia | Uso |
| --- | --- | --- | --- |
| `move-black` | `#000000` | Preto | **só tipografia** — nunca fundo dominante |
| `move-offwhite` / `move-gray` | `#F2F2F2` | Off White | fundo neutro padrão |
| `move-purple` | `#54355D` | Açaí | tinta principal, superfícies escuras |
| `move-yellow` | `#FACA77` | Ipê | CTAs, destaques, foco |
| `move-periwinkle` | `#CCACFF` | Lavanda | apoio |
| `move-coral` | `#DF6E6E` | Goiaba | apoio |
| `move-sand` | `#CEB187` | Areia | apoio |
| `move-mint` | `#CDCE74` | Capim | apoio |
| `move-green` | `#234625` | Mata | apoio |
| `move-light` | `#FBFFB1` | Luz | **acento gráfico pequeno — nunca fundo** |
| `move-line` | rgba roxo 12% | — | filetes |

**Duas armadilhas com nome próprio:**

1. `move-offwhite`/`move-gray` (Off White, `#F2F2F2`) **não é** `move-light`
   (Luz, `#FBFFB1`). Para fundo claro, Off White.
2. `move-light` nunca é fundo de componente ou de página. O guia trata Luz como
   acento gráfico pequeno, e o cliente pediu isso explicitamente.

### Tipografia

| Token | Valor |
| --- | --- |
| `text-eyebrow` | 0.8125rem, tracking `0.16em` |
| `text-display-1` | `clamp(2.25rem, 1.6rem + 3vw, 5rem)` |
| `text-display-2` | `clamp(2.25rem, 1.75rem + 2.5vw, 4.25rem)` |
| `text-display-3` | `clamp(1.75rem, 1.5rem + 1.25vw, 2.75rem)` |
| `text-body-lg` | `clamp(1.0625rem, 1rem + 0.3vw, 1.25rem)` |

O teto de `display-1` é 5rem (80px) por medição, não por estimativa: acima disso
os títulos reais do site passam a quebrar em três linhas.

**Fontes** — Raleway (`font-sans`) é a única efetivamente usada. Fraunces
(`font-serif`) continua carregada mas não é referenciada em lugar nenhum. Não
reintroduza `font-serif` em títulos sem falar com o cliente.

Outros tokens: `rounded-soft` (8px), `shadow-editorial`.

> Use os tokens em vez de valores arbitrários (`bg-[#54355D]`). Se precisa de uma
> cor que não existe no namespace, a pergunta certa é se ela deveria existir.

## Paleta e contraste

**Nunca combine um token de fundo com uma cor de texto escolhida na hora.** O
guia da marca fixa qual tipografia cada fundo aceita, e essa tabela está em
[`lib/palette.ts`](../lib/palette.ts) como `SURFACES`. Cada superfície carrega
`bg`, `text`, `muted`, `border`, `soft` e `chip` — `soft` é o véu translúcido
para pastilhas e divisórias **dentro** de um card já pintado com aquela cor,
onde `chip` (cor chapada sobre a mesma cor) sumiria:

```ts
import { surfaceForProject, surfaceForEcosystem, surfaceByName } from "@/lib/palette";

// Card de projeto: a cor escolhida no CMS, com o ecossistema como padrão.
const surface = surfaceForProject(project.cardColor, project.ecosystem);

<article className={`${surface.bg} ${surface.text}`}>
  <span className={`rounded-full px-3 py-1 ${surface.chip}`}>{project.ecosystem}</span>
  <p className={surface.muted}>{project.summary}</p>
</article>
```

```tsx
// ❌ escolher fundo e texto separadamente
<div className="bg-move-coral text-move-black">
```

Escolher a cor e escolher o contraste viram **uma decisão só**. As classes estão
escritas por extenso no arquivo porque o Tailwind não enxerga nomes montados em
runtime — `bg-move-${cor}` não geraria CSS.

Mapas relacionados:

- `ECOSYSTEM_SURFACE` (`lib/palette.ts`) — cor fixa por ecossistema, usada
  quando o campo "Cor do card" do projeto está em automático
- `SURFACE_OPTIONS` (`lib/palette.ts`) — a mesma paleta como opções de `select`
  do admin, para não existir uma segunda lista de cores a manter
- `ECOSYSTEM_ICON` e `iconForService()` (`lib/filterIcons.ts`) — grafismo por
  ecossistema e por serviço

Serviço é texto livre no CMS e chega combinado ("Teoria de Mudança e Planejamento
Estratégico"), então `iconForService` decide **por palavra-chave, na ordem das
regras**, com um grafismo neutro para o que não casar. Ao editar essa lista,
lembre que a ordem importa.

Fonte da tabela: [`docs/brand-guide-cores.md`](brand-guide-cores.md).

## Layout

`.editorial-container` (em `globals.css`) é o wrapper padrão de largura e calha:

```css
.editorial-container { width: min(100% - 24px, 1340px); margin-inline: auto; }
@media (min-width: 768px) {
  .editorial-container { width: min(100% - 40px, 1340px); }
}
```

Use no lugar de combinações ad hoc de `max-w-*` + `mx-auto`. No mobile a calha é
12px, e não 20px, porque somada ao `px-4` da seção o conteúdo ficava com 313px
numa tela de 393px e as grades de cards espremiam.

`.editorial-prose` é a tipografia do rich text: medida de 68ch, escala própria de
títulos, links sublinhados em Ipê. Aplicada pelo componente `<RichText />`.

## Componentes base

| Componente | Papel |
| --- | --- |
| [`Reveal`](../components/Reveal.tsx) | fade + slide-up ao entrar na viewport (`once: true`) |
| [`MediaFrame`](../components/MediaFrame.tsx) | `next/image` dentro de `Reveal`, com proporção e zoom no hover |
| [`RichText`](../components/RichText.tsx) | corpo Lexical com `.editorial-prose` |
| [`SectionLabel`](../components/SectionLabel.tsx) | rótulo de seção com marcador colorido |
| [`PageHero`](../components/PageHero.tsx) | abertura padrão das páginas internas |
| [`SmoothScroll`](../components/SmoothScroll.tsx) | dono da instância global de Lenis |
| `cn()` em [`lib/utils.ts`](../lib/utils.ts) | merge de classes (clsx + tailwind-merge) |

**Use `MediaFrame` para qualquer imagem de conteúdo**, em vez de um `<Image>` cru
— é o que mantém proporção, revelação e comportamento de hover consistentes.

## Animação

Duas ferramentas, com divisão clara:

| Ferramenta | Quando |
| --- | --- |
| **Framer Motion** (`Reveal`) | revelação simples ao rolar |
| **GSAP + ScrollTrigger + Lenis** | coreografia ligada ao scroll: pin, scrub, timeline |

### A instância única de Lenis

`SmoothScroll` é montado uma vez, no layout, e liga o raf do Lenis ao ticker do
GSAP:

```tsx
const lenis = new Lenis({ duration: 1.15, easing: (t) => …, smoothWheel: true });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

**Não instancie outro Lenis.** Tudo que reage ao scroll deve se pendurar nessa
instância via `ScrollTrigger`. Um segundo Lenis produz o sintoma clássico: pins
que escapam e marcadores do ScrollTrigger fora de lugar.

Para rolagem programática (âncoras, hash), `getLenis()` devolve a instância — é o
que `HashScrollSync` usa.

### Armadilha do `overflow-hidden`

`PortfolioStack` (home) empilha os cards com `position: sticky`. **Nenhum
ancestral pode ter `overflow-hidden`** — sticky para de funcionar em silêncio,
sem erro no console. É o primeiro lugar para olhar quando a pilha da home "para
de grudar".

### Movimento reduzido

Tratado globalmente em `globals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

Não replique essa checagem por componente.

## Componentes cliente

`"use client"` só quando o componente precisa de estado, efeito, evento ou API do
navegador. Um componente cliente **não pode** importar `lib/content.ts` nem nada
de `collections/`.

Padrão do projeto: a página (servidor) busca tudo e entrega um array pronto; o
componente cliente filtra em memória — é como funcionam `PortfolioBrowser` e
`PublicationsBrowser`.

## Criar um componente

1. `components/MeuComponente.tsx`, função nomeada exportada.
2. Props explícitas em `type Props = { … }`. Sem `any`.
3. Servidor por padrão; `"use client"` só se precisar.
4. Cores por `SURFACES` quando houver fundo colorido; tokens `move-*` no resto.
5. `.editorial-container` para largura, `Reveal`/`MediaFrame` para revelação e
   imagem.
6. Nenhum texto fixo que a Move devesse poder editar — isso vira campo no CMS.
7. Teste em 375px, 768px e 1440px. O site é lido majoritariamente no celular.
