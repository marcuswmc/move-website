// Fotografia editorial (Unsplash) usada como placeholder visual do redesign.
// Centralizado aqui para ser trocado por fotografia própria da Move sem tocar nos componentes.
// Componentes de mídia (Hero, HorizontalGoals) aceitam um `videoSrc` opcional para quando
// houver footage real — até lá, cada entrada usa apenas `src` + `alt`.

function unsplash(id: string) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80`;
}

export const images = {
  hero: {
    src: unsplash("1500937386664-56d1dfef3854"),
    alt: "Duas pessoas apertando as mãos em um campo de trigo, símbolo de parceria e trabalho de campo",
  },
  heroPortrait: {
    src: unsplash("1573497019940-1c28c88b4f3e"),
    alt: "Retrato de uma profissional sorrindo em um ambiente de trabalho",
  },
  justice: {
    src: unsplash("1441974231531-c6227db76b6e"),
    alt: "Trilha em uma floresta densa, luz entrando entre as árvores",
  },
  quote: {
    src: unsplash("1517486808906-6ca8b3f04846"),
    alt: "Cinco pessoas diversas sentadas lado a lado, sorrindo, com os braços entrelaçados",
  },
  forWhom: [
    {
      src: unsplash("1521737604893-d14cc237f11d"),
      alt: "Equipe reunida em torno de uma mesa de madeira com notebooks, em reunião de trabalho",
    },
    {
      src: unsplash("1416879595882-3373a0480b5b"),
      alt: "Mãos segurando terra e mudas, representando regeneração ambiental",
    },
  ],
  reach: {
    src: unsplash("1560439514-4e9645039924"),
    alt: "Grande público reunido em um evento, vista de cima",
  },
  principles: {
    src: unsplash("1543269865-cbf427effbad"),
    alt: "Quatro pessoas conversando e rindo ao redor de uma mesa em um café",
  },
  finalCta: {
    src: unsplash("1531058020387-3be344556be6"),
    alt: "Salão amplo com muitas pessoas reunidas em um evento",
  },
  contactHero: {
    src: unsplash("1543059080-f9b1272213d5"),
    alt: "Vista aérea da Avenida Paulista, em São Paulo",
  },
} as const;

export const galleryImages = [
  {
    src: unsplash("1441974231531-c6227db76b6e"),
    alt: "Trilha em uma floresta densa, luz entrando entre as árvores",
  },
  {
    src: unsplash("1552664730-d307ca884978"),
    alt: "Reunião de equipe com notas adesivas coloridas em um mural de planejamento",
  },
  {
    src: unsplash("1522202176988-66273c2fd55f"),
    alt: "Três mulheres conversando e sorrindo em uma mesa de trabalho com notebooks",
  },
  {
    src: unsplash("1521737604893-d14cc237f11d"),
    alt: "Equipe reunida em torno de uma mesa de madeira com notebooks",
  },
  {
    src: unsplash("1416879595882-3373a0480b5b"),
    alt: "Mãos segurando terra e mudas de plantas",
  },
  {
    src: unsplash("1573497019940-1c28c88b4f3e"),
    alt: "Retrato de uma profissional sorrindo em um ambiente de trabalho",
  },
] as const;
