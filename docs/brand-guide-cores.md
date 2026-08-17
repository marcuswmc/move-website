# Guia de Aplicação Cromática — Move

Fonte: "Guia de Aplicação Cromática — Identidade Visual — Cores" (PDF fornecido pelo cliente, 2026). Este arquivo resume o conteúdo do guia oficial para referência ao trabalhar no código deste repositório. Os valores hexadecimais abaixo já estão implementados em [`tailwind.config.ts`](../tailwind.config.ts) sob o namespace `move`.

## Paleta — três grupos

### Cores base (estrutura, legibilidade)

| Nome | Hex | RGB | Uso |
|---|---|---|---|
| Preto | `#000000` | 0,0,0 | **Uso exclusivo em tipografia.** Nunca como cor predominante de fundo. |
| Off White | `#F2F2F2` | 242,242,242 | Fundo neutro padrão. |
| Branco | `#FFFFFF` | 255,255,255 | Fundo neutro padrão. |

### Cores principais (expressão, reconhecimento)

| Nome | Hex | RGB | Token Tailwind |
|---|---|---|---|
| Roxo Açaí | `#54355D` | 84,53,93 | `move-purple` |
| Amarelo Ipê | `#FACA77` | 250,202,119 | `move-yellow` |

### Cores de apoio (ampliam a composição)

| Nome | Hex | RGB | Token Tailwind |
|---|---|---|---|
| Lilás Lavanda | `#CCACFF` | 204,172,255 | `move-periwinkle` |
| Vermelho Goiaba | `#DF6E6E` | 223,110,110 | `move-coral` |
| Bege Areia | `#CEB187` | 206,177,135 | `move-sand` |
| Amarelo Luz | `#FBFFB1` | 251,255,177 | `move-light` — **não usar como background de componentes**, só em detalhes gráficos pequenos (ex.: anéis decorativos, formas da matriz de combinações) |
| Verde Capim | `#CDCE74` | 205,206,116 | `move-mint` |
| Verde Mata | `#234625` | 35,70,37 | `move-green` |

Importante: **Off White (`#F2F2F2`) ≠ Luz (`#FBFFB1`)**. São cores diferentes no sistema oficial — Off White é uma cor base neutra usada como fundo de página/seção; Luz é uma cor de apoio (amarelo pálido) usada com moderação em elementos gráficos, não como fundo de componente.

## Contraste e legibilidade (tabela oficial)

Cor do fundo → cor de texto recomendada / alternativa / a evitar:

| Fundo | Recomendado | Alternativo | Evitar |
|---|---|---|---|
| Açaí | Branco ou Off White | — | Preto |
| Lavanda | Preto | Branco / Off White | — |
| Goiaba | Branco / Off White | Preto | — |
| Areia | Preto | Branco / Off White | — |
| Ipê | Preto | Branco / Off White | — |
| Luz | Preto | (Branco/Off White — evitar, contraste muito baixo) | Branco / Off White |
| Capim | Preto | Branco ou Off White | — |
| Mata | Branco ou Off White | — | Preto |

Regras gerais (texto do guia):
- Em fundo **Off White**: tipografia em Preto; destaques em Açaí, Lavanda, Goiaba ou Mata.
- Em fundo **Branco**: tipografia em Preto; destaques em Açaí, Lavanda, Goiaba, Mata **ou também Areia**.
- Evitar fundos coloridos com tipografia também colorida — priorizar sempre contraste e conforto de leitura.

## Logotipo

- Versão prioritária: monocromático preto/branco, conforme contraste do fundo.
- Duocromático (Ipê ou Lavanda como cor secundária) reservado para campanhas/iniciativas de maior destaque.
- Sob cores: o logotipo pode assumir qualquer cor do sistema, desde que preserve contraste com o fundo.

## A tabela de contraste vive em código

[`lib/palette.ts`](../lib/palette.ts) codifica a tabela acima como "superfícies": cada cor de fundo já vem acompanhada da classe de texto que o guia recomenda. Use `SURFACES`, `surfaceForEcosystem()` ou `surfaceByName()` em vez de escrever `bg-move-*` junto com uma cor de texto escolhida na hora — é assim que a regra de contraste não se perde no meio dos componentes.

Luz (`move-light`) não tem superfície: o guia a trata como acento gráfico pequeno, e o cliente pediu explicitamente para não usá-la como fundo de componente.

## Decisões de aplicação neste projeto (2026)

- `move-black` foi ajustado para `#000000` (Preto oficial, era `#1A1A1A`).
- `move-offwhite` / `move-gray` apontam para Off White `#F2F2F2` (não Luz).
- Fundos que antes usavam preto como cor dominante (Footer, TeamSection, seções de CTA final em `/` e `/teoria-da-mudanca`, painel "black" do `HorizontalGoals`) foram convertidos para Açaí ou Mata, alternando para manter contraste entre seções adjacentes.
- Header (`components/Header.tsx`) foi mantido sem alterações diretas nesta rodada, a pedido do cliente.
- **2026-08-13 — as cores de apoio voltaram.** Uma rodada anterior tinha reduzido o `tailwind.config.ts` a base + principais (5 tokens), porque o cliente havia pedido para não usar o conjunto de apoio. Com a chegada das páginas de Portfólio e Publicações — listagens longas, onde ecossistema e categoria precisam ser distinguidos de relance — os 6 tokens de apoio foram restaurados. Luz segue fora de qualquer fundo de componente.
- Cada ecossistema do portfólio tem uma cor fixa do sistema (`ECOSYSTEM_SURFACE` em `lib/palette.ts`), uma por superfície, sem repetição.
