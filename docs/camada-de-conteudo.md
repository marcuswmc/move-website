# Camada de conteúdo — `lib/content.ts`

[← Índice](README.md)

[`lib/content.ts`](../lib/content.ts) é **o único arquivo do site que lê o CMS**.
Tudo que o Payload sabe entra por aqui, sai como objeto simples, e nenhuma outra
parte do código descobre que existe um Payload atrás.

## Por que existe

Quando o conteúdo saiu de `data/site.ts` e foi para o CMS, nenhum componente
mudou — porque cada função aqui devolve **exatamente a forma que o componente já
consumia**. Essa é a razão de ser do arquivo: ele absorve o formato do Payload
para que a interface não precise conhecê-lo.

Na prática isso significa que a camada resolve, antes do JSX:

- filtro de publicados;
- imagem (upload ou URL externa) reduzida a `{ src, alt }`;
- datas já formatadas em pt-BR;
- campos opcionais com fallback;
- relacionamentos populados ou não;
- listas montadas só com o que existe.

O componente recebe algo que sempre dá para renderizar.

## Anatomia de uma função de leitura

```ts
export const getServices = cache(async () => {
  const payload = await getPayloadClient();

  const { docs } = await payload.find({
    collection: "services",
    where: PUBLISHED,      // ① só publicados
    sort: "order",         // ② ordem explícita
    limit: 0,              // ③ 0 = sem limite
    depth: 0,              // ④ não popula relacionamentos
  });

  return docs.map((service, index) => ({
    number: displayNumber(index),   // ⑤ "01", "02"… derivado da posição
    title: service.title,
    body: service.body,
    icon: service.icon,
  }));
});
```

① **`PUBLISHED`** é a constante do topo do arquivo:

```ts
const PUBLISHED = { _status: { equals: "published" } } as const;
```

Toda leitura de collection com drafts precisa dela. Esquecer isso vaza rascunho
para o site.

② **`sort` explícito** mesmo quando a collection tem `defaultSort` — o
comportamento não deve depender de configuração em outro arquivo.

③ **`limit: 0`** significa "todos". O padrão do Payload é 10, e esse é um erro
fácil de não perceber: a listagem simplesmente para no décimo item.

④ **`depth`** — quantos níveis de relacionamento popular. `0` devolve só IDs.
Use `0` sempre que não precisar do documento relacionado; use o padrão (`1`)
quando precisar (o card do projeto precisa do logo do parceiro).

⑤ **`displayNumber(index)`** produz `"01"`, `"02"`… a partir da posição.

## `cache()`

Todas as funções são embrulhadas em `cache()` do React. Isso deduplica chamadas
**dentro do mesmo request**: `getSiteSettings()` é chamado pelo layout, pelo
header e pelo rodapé, e vai ao banco uma vez só.

React `cache()` não é cache entre requests — quem faz isso é `unstable_cache`. As
duas camadas estão empilhadas em `cachedRead()`
([`lib/cache.ts`](../lib/cache.ts)), por onde passa toda leitura:

```ts
export const getProjects = cachedRead(
  async () => { /* … */ },
  "projects",                                    // chave do cache
  [TAG.projects, TAG.partners, TAG.media],       // de que documentos depende
);
```

As tags são o que liga a leitura ao CMS: cada collection e global chama
`revalidatesCollection` / `revalidatesGlobal`
([`lib/revalidate.ts`](../lib/revalidate.ts)) e purga suas tags ao salvar, então
a edição aparece na requisição seguinte. O prazo de 10 minutos em `FALLBACK_TTL` é
só rede de segurança para uma invalidação perdida, não o mecanismo de publicação.

`TAG.media` entra em quase toda leitura porque uma imagem trocada muda o `src`
resolvido em qualquer página que a exiba, sem que o documento que a referencia
seja salvo.

`getHomePublications` consulta apenas três destaques, com `select` e `depth: 1`.
Somente se não houver destaques faz a segunda consulta às três mais recentes.
Evite buscar todo o acervo para descartá-lo após a leitura.

## Padrões que valem repetir

### Buscar só o campo necessário

```ts
export const getProjectSlugs = cache(async () => {
  const { docs } = await payload.find({
    collection: "projects",
    where: PUBLISHED,
    limit: 0,
    depth: 0,
    select: { slug: true },     // ← só o slug volta do banco
  });
  return docs.map((doc) => doc.slug);
});
```

Usada pelo `generateStaticParams`. `select` importa quando a collection cresce.

### Imagem: sempre por `resolveImage`

```ts
const IMAGE_FALLBACK: ResolvedImage = { src: "", alt: "" };
const image = resolveImage(project.image) ?? IMAGE_FALLBACK;
```

`resolveImage()` aplica a regra "upload vence URL externa" e "alt da mídia vence
alt do campo". O fallback garante que o componente sempre receba um objeto — a
checagem que sobra para o JSX é `image.src &&`, não uma cadeia de `?.`.

### Relacionamento pode chegar como ID

```ts
const partner = typeof project.partner === "object" ? project.partner : null;
```

Com `depth: 0` vem string; com `depth: 1` vem documento. Tratar os dois casos
deixa a função segura contra uma mudança futura de `depth`.

### Formatar data no servidor

```ts
const DATE_FORMAT = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit", month: "long", year: "numeric", timeZone: "America/Sao_Paulo",
});
```

Formatar em componente cliente arriscaria divergência de hidratação quando o fuso
do visitante difere do fuso do build. O `timeZone` fixo é o que garante que a
data exibida seja a data brasileira, independentemente de onde o build rodou.

### Resolver a ausência aqui, não no JSX

```ts
social: [
  { name: "Instagram" as const, href: settings.social?.instagram },
  { name: "LinkedIn" as const, href: settings.social?.linkedin },
].filter((item) => Boolean(item.href?.trim())),
```

O componente só itera. Campo vazio não vira ícone quebrado — vira ausência.

### Fallback de texto explícito e comentado

```ts
// O card precisa de algum texto; sem resumo próprio, o desafio é o melhor
// substituto. A página do projeto não usa esse fallback — ali o Desafio aparece
// logo abaixo por extenso, e repetir o parágrafo não informa nada.
summary: project.summary ?? excerpt(project.challenge),
```

O card e a página do projeto usam fallbacks diferentes de propósito. Quando o
fallback é uma decisão editorial, escreva o porquê ao lado.

### Duas consultas em paralelo

```ts
const [{ docs }, { docs: projects }] = await Promise.all([
  payload.find({ collection: "partners", where: PUBLISHED, sort: "order", limit: 0 }),
  payload.find({ collection: "projects", where: PUBLISHED, limit: 0, depth: 0,
                 select: { partner: true } }),
]);
```

`getPartners` precisa saber quais clientes têm projeto para montar o `href` do
carrossel — mas não precisa do portfólio inteiro, só do campo `partner`.

### Tipos exportados para os componentes

```ts
export type ProjectCard = {
  slug: string;
  client: string;
  logo: ResolvedImage | null;
  ecosystem: string;
  /* … */
};
```

`ProjectCard` e `PublicationCard` são o contrato entre a camada e os componentes.
Um componente que renderiza card importa **o tipo** daqui (isso não arrasta o
Payload para o bundle: tipo some na compilação), nunca a função.

## Consultas do Payload

```ts
// listagem
payload.find({ collection, where, sort, limit, depth, select, page })

// um documento
payload.findByID({ collection, id })

// global
payload.findGlobal({ slug, depth })
```

Operadores de `where` mais usados no projeto:

```ts
{ _status: { equals: "published" } }
{ slug: { equals: slug } }
{ slug: { not_equals: slug } }
{ ecosystem: { equals: ecosystem } }
{ ...PUBLISHED, slug: { equals: slug } }        // combinação por spread
{ or: [ { a: { equals: 1 } }, { b: { exists: true } } ] }
```

Buscar por slug é `find` com `limit: 1`, não `findByID`:

```ts
const { docs } = await payload.find({
  collection: "projects",
  where: { ...PUBLISHED, slug: { equals: slug } },
  limit: 1,
});
const project = docs[0];
if (!project) return null;      // a página chama notFound()
```

**Devolva `null`, não lance exceção.** Quem decide o que fazer com "não existe" é
a rota, chamando `notFound()`.

## Adicionar uma função

1. Escreva a função no bloco temático correspondente do arquivo (publicações
   perto de publicações, projetos perto de projetos).
2. Embrulhe em `cache()`.
3. Filtre por `PUBLISHED` se a collection tem drafts.
4. `sort`, `limit` e `depth` explícitos.
5. Devolva objeto plano — nada de documento cru do Payload.
6. Exporte um `type` se mais de um componente consumir a forma.
7. Se algum campo for opcional, decida o fallback **aqui** e comente o porquê.

## O que **não** fazer

- ❌ Chamar `getPayloadClient()` fora deste arquivo (exceto em `scripts/`).
- ❌ Importar `payload-types` num componente para tipar props — use os tipos
  exportados daqui.
- ❌ Devolver o documento cru (`return docs`). O componente passaria a depender do
  formato do Payload, que é justamente o que a camada evita.
- ❌ Formatar data, moeda ou número dentro de componente cliente.
- ❌ Esquecer `limit: 0` numa listagem que deve mostrar tudo.
