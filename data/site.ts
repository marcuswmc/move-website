// Contato fica sempre por último: o Header o separa da lista para virar o CTA da direita.
export const navItems = [
  { label: "Início", href: "/#hero" },
  { label: "Teoria da Mudança", href: "/teoria-da-mudanca" },
  { label: "Publicações", href: "/publicacoes" },
  { label: "Serviços", href: "/#entregamos" },
  { label: "Portfólio", href: "/portfolio" },
  { label: "Contato", href: "/contato" }
];

export type PortfolioCase = {
  id: string;
  client: string;
  ecosystem: string;
  service: string;
  year: string;
  challenge: string;
  results: string;
  image: string;
};

export const portfolioCases: PortfolioCase[] = [
  {
    id: "instituto-arapyau",
    client: "Instituto Arapyaú",
    ecosystem: "Meio Ambiente",
    service: "Planejamento Estratégico",
    year: "2019",
    challenge: "Construir, em um único encontro, confiança e direcionamentos comuns entre gestores municipais reunidos pelo Fórum de Gestores de Inovação.",
    results: "A Move desenhou e facilitou uma agenda de diálogo horizontal que permitiu identificar prioridades e os primeiros passos coletivos do Fórum.",
    image: "/projects/meio-ambiente.png"
  },
  {
    id: "fundacao-lemann",
    client: "Fundação Lemann",
    ecosystem: "Educação",
    service: "Teoria de Mudança",
    year: "2024",
    challenge: "Tornar explícita a narrativa de impacto do Brasil on Campus e conectá-la de forma mais direta aos demais programas de Lideranças.",
    results: "O processo reuniu análise documental, escutas e oficinas para traduzir diretrizes em metas, entregas e prioridades aplicáveis em 2025.",
    image: "/projects/educacao.png"
  },
  {
    id: "itau-social",
    client: "Itaú Social",
    ecosystem: "Educação",
    service: "Avaliação de Impacto e Resultados",
    year: "2022",
    challenge: "Fortalecer os processos de monitoramento e avaliação de OSCs do Programa Itaú Social UNICEF voltadas à educação integral e inclusiva.",
    results: "Encontros formativos e sessões de monitoramento ajudaram as organizações a consolidar práticas mais robustas e alinhadas aos seus contextos.",
    image: "/projects/educacao.png"
  },
  {
    id: "unicef",
    client: "UNICEF",
    ecosystem: "Educação",
    service: "Estudos e Sistematizações",
    year: "2017",
    challenge: "Apoiar a leitura dos resultados do Selo UNICEF Município Aprovado na redução de desigualdades e na garantia de direitos de crianças e adolescentes.",
    results: "A análise de dados identificou avanços e desafios persistentes, orientando ações futuras e a revisão de dois guias do programa.",
    image: "/projects/educacao.png"
  },
  {
    id: "rumo-logistica",
    client: "Rumo Logística",
    ecosystem: "Direitos Humanos",
    service: "Planejamento Estratégico e Diagnóstico Social",
    year: "2024 — em andamento",
    challenge: "Alinhar a estratégia de responsabilidade social e investimento social privado ao crescimento da operação e à relação com comunidades.",
    results: "O trabalho estrutura uma abordagem integrada para mitigar riscos sociais, fortalecer vínculos territoriais e orientar impacto positivo.",
    image: "/projects/direitos-humanos.png"
  },
  {
    id: "labora",
    client: "Labora",
    ecosystem: "Direitos Humanos",
    service: "Avaliação de Impacto e Resultados",
    year: "2023",
    challenge: "Criar uma linha de base para acompanhar o fortalecimento de coletivos que atuam pela justiça racial, de gênero e pelo trabalho digno.",
    results: "Entrevistas, grupos focais e análise de dados geraram recomendações para aperfeiçoar o modelo de apoio e os próximos ciclos do Fundo.",
    image: "/projects/direitos-humanos.png"
  },
  {
    id: "ecosocial",
    client: "EcoSocial",
    ecosystem: "Cultura",
    service: "Teoria de Mudança",
    year: "2023",
    challenge: "Conectar a Teoria de Mudança da rede a práticas concretas de monitoramento e avaliação que apoiassem decisões baseadas em evidências.",
    results: "A Move revisou a lógica causal, criou matriz, instrumentos de coleta e um painel Power BI para monitoramento contínuo dos resultados.",
    image: "/projects/direitos-humanos.png"
  },
  {
    id: "projeto-guri",
    client: "Projeto Guri",
    ecosystem: "Cultura",
    service: "Avaliação de Impacto e Resultados",
    year: "2019",
    challenge: "Aprofundar a compreensão do impacto econômico do programa sociocultural e atender a novas exigências regulatórias.",
    results: "O estudo comparou resultados de 2018 e 2019, fortaleceu a coleta de dados e resultou em relatório e artigo sobre impacto econômico.",
    image: "/projects/direitos-humanos.png"
  },
  {
    id: "sustenidos",
    client: "Sustenidos",
    ecosystem: "Cultura",
    service: "Avaliação de Impacto e Resultados",
    year: "2022",
    challenge: "Realizar uma pesquisa de impacto para projetos de educação musical executados em 2021 e 2022.",
    results: "A parceria ampliou a compreensão sobre a cadeia de produção e influência dos projetos, de fornecedores à execução das atividades.",
    image: "/projects/direitos-humanos.png"
  },
  {
    id: "nossas",
    client: "NOSSAS",
    ecosystem: "Direitos Humanos",
    service: "Teoria de Mudança e Planejamento Estratégico",
    year: "2024",
    challenge: "Revisar a estratégia de uma década de atuação e definir uma visão de impacto capaz de orientar os três anos seguintes.",
    results: "Escutas, oficinas e uma roda de diálogo resultaram em Teoria de Mudança, objetivos estratégicos e diretrizes de planejamento.",
    image: "/projects/direitos-humanos.png"
  },
  {
    id: "instituto-alana",
    client: "Instituto Alana",
    ecosystem: "Educação",
    service: "Avaliação de Impacto e Resultados",
    year: "2023",
    challenge: "Consolidar uma cultura avaliativa que valorizasse repertórios existentes e aproximasse teoria e prática em duas avaliações.",
    results: "A consultoria entregou recomendações e fortaleceu o repertório da equipe, impulsionando práticas de monitoramento e avaliação.",
    image: "/projects/educacao.png"
  },
  {
    id: "instituto-acp",
    client: "Instituto ACP",
    ecosystem: "Direitos Humanos",
    service: "Avaliação de Impacto e Resultados",
    year: "2023",
    challenge: "Avaliar a efetividade da estratégia de investimento direto para o fortalecimento institucional de organizações da sociedade civil.",
    results: "O processo gerou recomendações para o próximo ciclo e um marco conceitual de avaliação do fortalecimento institucional das OSCs.",
    image: "/projects/direitos-humanos.png"
  },
  {
    id: "escolas-criativas",
    client: "Programa Escolas Criativas",
    ecosystem: "Educação",
    service: "Planejamento Estratégico",
    year: "2023",
    challenge: "Planejar a atuação tática para 2024 e abrir espaço de reflexão sobre relações internas e cultura organizacional.",
    results: "Uma imersão de cinco dias ajudou a equipe a construir o plano tático geral e por área para o novo ano.",
    image: "/projects/educacao.png"
  },
  {
    id: "unesco",
    client: "UNESCO",
    ecosystem: "Direitos Humanos",
    service: "Avaliação de Impacto e Resultados",
    year: "2023",
    challenge: "Avaliar o processo formativo e o impacto do projeto Conexões Éticas do Terceiro Setor para organizações sociais e ambientais.",
    results: "A avaliação reuniu resultados dos cursos e recomendações para os próximos processos de formação da rede de OSCs.",
    image: "/projects/direitos-humanos.png"
  },
  {
    id: "CAIXA",
    client: "CAIXA",
    ecosystem: "Finanças",
    service: "Formações",
    year: "2023",
    challenge: "Desenvolver uma formação técnica e reflexiva sobre avaliação de impacto de políticas e programas para assessores da instituição.",
    results: "A formação combinou mentoria, encontros online e uma etapa presencial, ampliando o repertório de avaliação das equipes participantes.",
    image: "/projects/financas.png"
  }
];

/**
 * Teoria de Mudança oficial da Move, transcrita do documento TdM_MoveSocial_2025.pdf.
 *
 * Os itens de `deliverables`, `outcomes` e `impact` são o texto literal do documento —
 * não reescreva sem conferir o PDF. As aberturas de seção (`intro`) e as descrições das
 * frentes e dos públicos foram redigidas para a web: o documento só nomeia essas partes,
 * sem texto corrido. Tudo isso é editável em /admin › Páginas › Teoria da Mudança.
 */
export const theoryOfChange = {
  hero: {
    eyebrow: "Nossa Teoria de Mudança",
    title: "O porquê e o como do nosso trabalho.",
    description:
      "A nossa Teoria de Mudança descreve o porquê e como trabalhamos para realizar nossa missão: uma cadeia de seis elos, das frentes que nos sustentam até a justiça social e climática que queremos ver.",
  },

  fronts: {
    intro: {
      eyebrow: "Como atuamos",
      title: "Quatro frentes que se cruzam em cada projeto.",
      description:
        "Consultoria, formação, articulação e produção de conhecimento não são serviços separados: são modos de atuação que se sobrepõem. É no encontro entre eles que o trabalho acontece.",
    },
    items: [
      {
        label: "Consultoria",
        description:
          "Acompanhamos organizações no desenho e na revisão das suas estratégias, com processos colaborativos que respeitam o contexto e o momento de cada uma.",
      },
      {
        label: "Formação",
        description:
          "Traduzimos o que aprendemos em campo em oficinas, formações e mentorias que ampliam o repertório de quem conduz as iniciativas.",
      },
      {
        label: "Articulação",
        description:
          "Aproximamos organizações, iniciativas e pessoas do campo socioambiental, porque problemas complexos não se resolvem isoladamente.",
      },
      {
        label: "Produção de conhecimento",
        description:
          "Sistematizamos experiências e produzimos evidências que ficam disponíveis para o campo inteiro, não apenas para quem nos contrata.",
      },
    ],
  },

  activitiesIntro: {
    eyebrow: "O que fazemos",
    title: "Oito formas de colocar essas frentes em prática.",
    description:
      "Cada projeto combina algumas delas. Desenhar a combinação já é parte do trabalho — ela muda conforme a pergunta que a organização precisa responder.",
  },

  audiences: {
    intro: {
      eyebrow: "Para quem fazemos",
      title: "Três camadas que se contêm.",
      description:
        "Pessoas no centro, organizações em volta, campo abraçando tudo. Cada camada contém a anterior — é por isso que fortalecer uma alcança as de fora.",
    },
    // Do centro para fora, como no diagrama oficial.
    items: [
      {
        label: "Pessoas",
        summary: "Interessadas e/ou relacionadas ao campo de impacto",
        description:
          "Quem conduz as iniciativas no dia a dia — equipes, lideranças, conselhos — e as pessoas atendidas por elas. É onde a mudança começa a ser sentida.",
      },
      {
        label: "Organizações de impacto",
        summary: "Iniciativas socioambientais de todos os portes",
        description:
          "Fundações, institutos, organizações da sociedade civil, negócios de impacto e governos que precisam de clareza sobre o que fazem e sobre o que muda a partir disso.",
      },
      {
        label: "Campo de impacto socioambiental positivo",
        summary: "O ecossistema em que essas organizações atuam",
        description:
          "O conjunto de atores, práticas e conhecimentos do campo socioambiental brasileiro. Quando uma iniciativa aprende melhor, o campo inteiro ganha repertório.",
      },
    ],
  },

  deliverables: {
    intro: {
      eyebrow: "O que entregamos",
      title: "O que fica com quem trabalha com a gente.",
      description:
        "Não são relatórios: são deslocamentos concretos na forma como uma organização enxerga e conduz o próprio impacto.",
    },
    items: [
      "Escuta cuidadosa das equipes e dos públicos atendidos em iniciativas",
      "Conhecimento e reflexão sobre o campo socioambiental",
      "Evidências para embasar a tomada de decisão",
      "Alinhamento sobre as estratégias, resultados e impactos esperados",
      "Lógica de atuação organizacional e programática coerente",
      "Estratégias de gestão de impacto",
      "Conexão de organizações e iniciativas do campo",
      "Soluções inovadoras para endereçamento das necessidades do campo socioambiental",
    ],
  },

  outcomes: {
    intro: {
      eyebrow: "O que queremos",
      title: "Um ecossistema de impacto mais forte.",
      description:
        "Ecossistema de impacto socioambiental fortalecido e transformando positivamente os contextos em que atua — sete mudanças que, juntas, indicam esse avanço. É para elas que cada entrega aponta.",
    },
    items: [
      "Campo socioambiental articulado e com conhecimentos para solucionar problemas complexos",
      "Iniciativas socioambientais relevantes e eficazes",
      "Enfrentamento das desigualdades de gênero e étnico-raciais",
      "Cultura de monitoramento, avaliação e aprendizagem fortalecida",
      "Intencionalidade na atuação de iniciativas socioambientais ampliada",
      "Vozes e referenciais diversos incluídos e valorizados",
      "Profissionais do campo de impacto instrumentalizados e com olhar mais estratégico e integrativo",
    ],
  },

  impact: {
    eyebrow: "Impacto",
    title: "Justiça social e climática",
    statement:
      "Sociedade justa, equitativa, com direitos garantidos e contribuindo para a preservação e regeneração ambiental",
  },
};

export const deliverables = [
  {
    number: "01",
    title: "Planejamento estratégico",
    body: "Processos colaborativos que transformam leituras do presente em planos realistas, capazes de responder aos diferentes contextos de cada organização.",
    icon: "/brand/icons/Group 13.svg"
  },
  {
    number: "02",
    title: "Teoria de mudança",
    body: "Teorias sensíveis e adaptativas para reconhecer sistemas complexos, dar clareza às escolhas e orientar os impactos que se quer alcançar.",
    icon: "/brand/icons/Group 12.svg"
  },
  {
    number: "03",
    title: "Avaliações",
    body: "Abordagens de métodos mistos para compreender resultados e impactos, com rigor analítico e atenção às perguntas que importam em cada contexto.",
    icon: "/brand/icons/Group 11.svg"
  },
  {
    number: "04",
    title: "Estudos, sistematizações e diagnósticos",
    body: "Investigação e narrativa para organizar experiências, ampliar o debate e gerar conhecimento que apoia decisões mais consistentes.",
    icon: "/brand/icons/Group 4.svg"
  },
  {
    number: "05",
    title: "Facilitações",
    body: "Espaços de diálogo franco, aprendizagem e adaptação, criados para que pessoas e organizações possam alcançar seu potencial.",
    icon: "/brand/icons/Group 3.svg"
  },
  {
    number: "06",
    title: "Formações",
    body: "Saberes do campo traduzidos em processos de aprendizagem que unem tendências, repertório prático e as questões vivas de cada equipe.",
    icon: "/brand/icons/Group 2.svg"
  },
  {
    number: "07",
    title: "Publicações",
    body: "Conteúdos que sistematizam aprendizados, ampliam o diálogo público e compartilham experiências relevantes para o campo socioambiental.",
    icon: "/brand/icons/Group 10.svg"
  },
  {
    number: "08",
    title: "Painéis de visualização de dados",
    body: "Painéis construídos a partir de escuta ativa e metodologias sólidas para gerar insights e apoiar decisões alinhadas a propósitos transformadores.",
    icon: "/brand/icons/Group 16.svg"
  }
];

export const contracted = [
  "Planejamento estratégico",
  "Monitoramento e avaliação",
  "Teoria de mudança",
  "Desenvolvimento institucional",
  "Gestão do ciclo de impacto"
];

export const received = [
  "Parceria com crítica, profundidade e generosidade",
  "Ampliação de perspectivas e novos caminhos",
  "Processos participativos que provocam deslocamentos",
  "Equipe mais alinhada e intencional",
  "Segurança para navegar contextos complexos"
];

export const principles = [
  {
    title: "Rigor com cuidado",
    body: "Excelência técnica e atenção humana caminham juntas em cada processo."
  },
  {
    title: "Escuta antes de tudo",
    body: "Nenhum caminho começa com resposta pronta. Primeiro, entendemos o que já existe."
  },
  {
    title: "Aprendizagem coletiva",
    body: "O processo precisa deixar novas leituras para todos os lados."
  },
  {
    title: "Presença e confiança",
    body: "Contrato é ponto de partida. O trabalho real exige flexibilidade e compromisso."
  }
];

export const hero = {
  eyebrow: "Gestão de impacto socioambiental",
  title: "Ampliar e qualificar o impacto socioambiental positivo.",
  body: "Há 15 anos apoiando organizações de diferentes setores, tamanhos e temáticas a tomarem decisões com base em evidências, a planejarem e articularem-se para a solução de problemas complexos."
};

export const metrics = [{ value: "450", label: "iniciativas apoiadas" }];

// Placeholder labels — swap in the official seal/logo assets when the client sends them,
// per data/images.ts convention for provisional visuals.
export const affiliations = [
  { label: "Empresa B" },
  { label: "Rede Brasileira de Monitoramento e Avaliação" },
  { label: "Latimpacto" }
];

// Os resumos vêm da seção "Quem move a Move" do site atual (move.social), que é a
// única fonte com a trajetória de cada pessoa.
//
// DIVISÃO PROVISÓRIA — o site atual não separa conselho de equipe. Estes três foram
// postos no conselho por terem o perfil mais estratégico; a Move confirma a composição
// real e o ajuste é feito no admin (campo Grupo), sem precisar de deploy.
export const boardMembers = [
  {
    name: "Antonio Ribeiro",
    specialty: "Planejamento, teoria de mudança e avaliação",
    bio: "Consultor especializado em planejamento estratégico, teoria de mudança, desenvolvimento organizacional e avaliação de iniciativas. Possui expertise em elaboração de planos estratégicos, facilitação de grupos, pesquisa e gestão de projetos. Graduado em Psicologia, Mestre em Psicologia Social e Doutorando em Estudos Culturais.",
    image: "/team/antonio-ribeiro.webp",
    imageAlt: "Retrato de Antonio Ribeiro"
  },
  {
    name: "Elis Alquezar",
    specialty: "Avaliação, saúde e garantia de direitos",
    bio: "Consultora especializada em avaliação de projetos em saúde, assistência social e garantia de direitos. Possui ampla experiência como pesquisadora em órgãos públicos nacionais e municipais, atuando em diversas iniciativas. Graduada em Psicologia e especialista em avaliação de políticas públicas e serviços de saúde.",
    image: "/team/elis-alquezar.webp",
    imageAlt: "Retrato de Elis Alquezar"
  },
  {
    name: "Gabriela Brettas",
    specialty: "Desenvolvimento organizacional e avaliação",
    bio: "Consultora especializada em planejamento estratégico, desenvolvimento organizacional e avaliação de projetos nas áreas de assistência social e garantia de direitos. Possui experiência em facilitação de processos de desenvolvimento institucional e pesquisa em organizações sociais. Graduada em Ciências Sociais e Mestre em Gestão de Políticas Públicas.",
    image: "/team/gabriela-brettas.webp",
    imageAlt: "Retrato de Gabriela Brettas"
  }
];

export const teamMembers = [
  {
    name: "Arthur da Hora",
    specialty: "Planejamento, avaliação e inteligência de dados",
    bio: "Consultor especializado em planejamento, avaliação e monitoramento de resultados e impactos, com ênfase em inteligência de dados. Possui experiência em consultoria, pesquisa, estratégia e gestão de pessoas em organizações civis e privadas. Bacharel em Administração e pós-graduado em Gestão de Inovação Social.",
    image: "/team/arthur-da-hora.webp",
    imageAlt: "Retrato de Arthur da Hora"
  },
  {
    name: "Juliana Moraes",
    specialty: "Desenvolvimento organizacional e avaliação",
    bio: "Consultora especializada em desenvolvimento organizacional e avaliação de projetos, com ênfase nas áreas de educação e garantia de direitos. Possui experiência em processos avaliativos e planejamento em diferentes contextos. Graduada em Ciências Sociais e Mestre em Antropologia Social e Cultural.",
    image: "/team/juliana-moraes.webp",
    imageAlt: "Retrato de Juliana Moraes"
  },
  {
    name: "Igor Braz",
    specialty: "Vendas, representação e comunicação",
    bio: "Responsável pela área de vendas, representação institucional e comunicação. Atua como mentor de profissionais em início de carreira e possui amplo conhecimento em impacto socioambiental. Bacharel em Gestão Ambiental, realizou iniciação científica com foco na formação de empreendedores sociais.",
    image: "/team/igor-braz.webp",
    imageAlt: "Retrato de Igor Braz"
  },
  {
    name: "Rodrigo Petrucelli",
    specialty: "Administrativo e financeiro",
    bio: "Responsável pelo setor administrativo e financeiro. Possui experiência em gestão administrativa, contábil e financeira em empresas de diversos segmentos. Bacharel em Administração de Empresas, especialista em Gestão de Projetos no Terceiro Setor e Bacharel em Filosofia.",
    image: "/team/rodrigo-petrucelli.webp",
    imageAlt: "Retrato de Rodrigo Petrucelli"
  }
];

export const portfolioProjects = [
  {
    number: "01",
    client: "Instituto Arapyaú",
    category: "Estratégia e desenvolvimento territorial",
    title: "Caminhos coletivos para fortalecer o território.",
    description:
      "Uma parceria orientada pela escuta, pela articulação de atores e pela construção de estratégias que respondem à complexidade do campo.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=85",
    imageAlt: "Vista por dentro de uma floresta verde e densa",
    tone: "purple"
  },
  {
    number: "02",
    client: "Fundação Lemann",
    category: "Educação e avaliação de impacto",
    title: "Evidências para transformar a educação.",
    description:
      "Investigamos resultados, aprendizados e oportunidades para que iniciativas educacionais possam decidir com mais clareza e intenção.",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=85",
    imageAlt: "Pessoa escrevendo em um quadro branco durante uma aula",
    tone: "light"
  },
  {
    number: "03",
    client: "UNICEF",
    category: "Direitos humanos e infância",
    title: "Proteção que começa ao ouvir cada realidade.",
    description:
      "Processos participativos que aproximam dados, territórios e pessoas para ampliar a proteção integral de crianças e adolescentes.",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=85",
    imageAlt: "Retrato de uma jovem mulher negra, olhando para a câmera",
    tone: "yellow"
  },
  {
    number: "04",
    client: "Fundo Vale",
    category: "Meio ambiente e regeneração",
    title: "Impacto que se mede no presente e sustenta o futuro.",
    description:
      "Apoiamos a leitura de mudanças socioambientais para conectar conservação, comunidades e decisões de longo prazo.",
    image: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&q=85",
    imageAlt: "Folhagens verdes iluminadas pelo sol",
    tone: "light"
  }
];

export const theoryPdf = {
  href: "/downloads/teoria-da-mudanca-move-social.pdf",
  label: "Baixar a Teoria de Mudança em PDF"
};

export const contactAreas = ["Meio Ambiente", "Educação", "Direitos Humanos", "Cultura", "Finanças", "Outro"];

export const contactSteps = [
  {
    number: "01",
    title: "Você conta a sua realidade",
    body: "Escreva sobre o momento da sua organização e onde o impacto precisa ganhar mais clareza."
  },
  {
    number: "02",
    title: "Marcamos uma conversa inicial",
    body: "Uma escuta sem compromisso, para entender contexto, urgências e o que já foi tentado."
  },
  {
    number: "03",
    title: "Desenhamos o caminho juntos",
    body: "Se fizer sentido para os dois lados, propomos um formato de trabalho sob medida."
  }
];

// PLACEHOLDER — a Move ainda vai enviar a lista real de publicações (título, capa, sinopse).
// Substitua estas 3 entradas pelos dados reais assim que chegarem; não usar como conteúdo final.
export const publications = [
  {
    id: "publicacao-01",
    title: "Título da publicação",
    synopsis: "Resumo de uma a duas linhas sobre o que esta publicação aborda e para quem ela é relevante.",
    cover: { src: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80", alt: "Capa provisória — substituir pela capa real da publicação" }
  },
  {
    id: "publicacao-02",
    title: "Título da publicação",
    synopsis: "Resumo de uma a duas linhas sobre o que esta publicação aborda e para quem ela é relevante.",
    cover: { src: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80", alt: "Capa provisória — substituir pela capa real da publicação" }
  },
  {
    id: "publicacao-03",
    title: "Título da publicação",
    synopsis: "Resumo de uma a duas linhas sobre o que esta publicação aborda e para quem ela é relevante.",
    cover: { src: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80", alt: "Capa provisória — substituir pela capa real da publicação" }
  }
];

export const contact = {
  email: "move@move.social",
  phone: "+55 11 3868.4093",
  address: "Rua Fidalga, 154 · conj. 4 · Pinheiros · São Paulo-SP · CEP 05432-000"
};

/** Perfis oficiais da Move, exibidos como ícones no header. */
export const social = {
  instagram: "https://www.instagram.com/move.social/",
  linkedin: "https://www.linkedin.com/company/movesocial/"
};
