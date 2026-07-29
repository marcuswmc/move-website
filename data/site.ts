export const navItems = [
  { label: "Início", href: "/#hero" },
  { label: "Teoria da Mudança", href: "/#narrativa" },
  { label: "Serviços", href: "/#entregamos" },
  { label: "Projetos", href: "/portfolio" },
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

export const goals = [
  {
    number: "01",
    kind: "intro",
    eyebrow: "Teoria da mudança",
    title: "A mudança acontece em camadas.",
    body: "Da pessoa ao campo socioambiental, cada camada sustenta a próxima — é assim que a Move enxerga impacto de verdade.",
    tone: "purple",
    image: "https://images.unsplash.com/photo-1560439514-4e9645039924?auto=format&fit=crop&q=80",
    imageAlt: "Grande público reunido em um evento, vista de cima",
  },
  {
    number: "02",
    kind: "objective",
    eyebrow: "Camada 01/03 · Campo",
    title: "Um campo mais articulado e mais justo.",
    body: "Conhecimento situado para responder a problemas complexos, com gênero e relações étnico-raciais como lente de decisão — não como camada posterior.",
    tone: "green",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80",
    imageAlt: "Retrato de uma jovem mulher negra, olhando para a câmera",
  },
  {
    number: "03",
    kind: "objective",
    eyebrow: "Camada 02/03 · Organizações",
    title: "Organizações mais intencionais e eficazes.",
    body: "Iniciativas que se reconhecem no que fazem, medem o que importa e ganham clareza sobre por que cada escolha conta no ciclo de impacto.",
    tone: "periwinkle",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80",
    imageAlt: "Equipe analisando dados em um notebook em um escritório",
  },
  {
    number: "04",
    kind: "objective",
    eyebrow: "Camada 03/03 · Pessoas",
    title: "Pessoas com mais voz e mais confiança.",
    body: "Referenciais diferentes mudam a qualidade da leitura. Times do campo ganham um olhar mais estratégico, integrativo e confiante.",
    tone: "light",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80",
    imageAlt: "Três mulheres conversando e sorrindo em uma mesa de trabalho",
  },
  {
    number: "05",
    kind: "closing",
    eyebrow: "Síntese",
    title: "Um ciclo que se retroalimenta.",
    body: "Campo, organizações e pessoas se fortalecem em conjunto. É nesse encontro que o impacto se amplia de verdade.",
    tone: "black",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80",
    imageAlt: "Reunião de planejamento estratégico com notas adesivas em um mural",
    cta: { label: "Ver a teoria de mudança completa", href: "/teoria-da-mudanca" },
  },
];

export const deliverables = [
  {
    number: "01",
    title: "Planejamento estratégico",
    body: "Processos colaborativos que transformam leituras do presente em planos realistas, capazes de responder aos diferentes contextos de cada organização."
  },
  {
    number: "02",
    title: "Teoria de mudança",
    body: "Teorias sensíveis e adaptativas para reconhecer sistemas complexos, dar clareza às escolhas e orientar os impactos que se quer alcançar."
  },
  {
    number: "03",
    title: "Avaliações",
    body: "Abordagens de métodos mistos para compreender resultados e impactos, com rigor analítico e atenção às perguntas que importam em cada contexto."
  },
  {
    number: "04",
    title: "Estudos, sistematizações e diagnósticos",
    body: "Investigação e narrativa para organizar experiências, ampliar o debate e gerar conhecimento que apoia decisões mais consistentes."
  },
  {
    number: "05",
    title: "Facilitações",
    body: "Espaços de diálogo franco, aprendizagem e adaptação, criados para que pessoas e organizações possam alcançar seu potencial."
  },
  {
    number: "06",
    title: "Formações",
    body: "Saberes do campo traduzidos em processos de aprendizagem que unem tendências, repertório prático e as questões vivas de cada equipe."
  },
  {
    number: "07",
    title: "Publicações",
    body: "Conteúdos que sistematizam aprendizados, ampliam o diálogo público e compartilham experiências relevantes para o campo socioambiental."
  },
  {
    number: "08",
    title: "Painéis de visualização de dados",
    body: "Painéis construídos a partir de escuta ativa e metodologias sólidas para gerar insights e apoiar decisões alinhadas a propósitos transformadores."
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

export const metrics = [
  { value: "15", label: "anos dentro do campo" },
  { value: "200+", label: "organizações apoiadas" },
  { value: "23", label: "estados alcançados" },
  { value: "6", label: "países" }
];

export const testimonials = [
  {
    quote:
      "A Move atua de forma muito colaborativa e customizada às necessidades da organização, com sensibilidade às dores e desafios de cada momento.",
    name: "Juliana Vilhena",
    role: "Líder de Gestão de Impacto e Inovação Socioambiental",
    organization: "Fundo Vale",
    initials: "JV"
  },
  {
    quote: "Cada interação foi uma oportunidade de se desafiar e aprender.",
    name: "Andreas Ufer",
    role: "Sócio-fundador",
    organization: "Sense-Lab",
    initials: "AU"
  },
  {
    quote: "O encontro com a Move trouxe escuta sensível, visão sistêmica e repertório metodológico para nos guiar nesse processo.",
    name: "Talita Novacoski",
    role: "Diretora de Inteligência e Tecnologia",
    organization: "NOSSAS",
    initials: "TN"
  },
  {
    quote: "A atenção à diversidade e inclusão de vozes diferentes também enriquece o processo de avaliação.",
    name: "Mariana Xavier",
    role: "Gerente Sênior de Avaliação",
    organization: "Laudes Foundation",
    initials: "MX"
  },
  {
    quote: "A Move combina alta técnica e conhecimento com uma profunda capacidade de escuta e sensibilidade.",
    name: "Maria Helena Faller",
    role: "Head",
    organization: "Agente Muda e Din4mo",
    initials: "MF"
  },
  {
    quote: "A excelência técnica associada à sensibilidade se traduz em resultados fundamentais para o fortalecimento da nossa missão.",
    name: "Natacha Costa",
    role: "Diretora Executiva",
    organization: "Associação Cidade Escola Aprendiz",
    initials: "NC"
  }
];

export const teamMembers = [
  {
    name: "Elis Alquezar",
    specialty: "Avaliação, saúde e garantia de direitos",
    image: "/team/elis-alquezar.webp",
    imageAlt: "Retrato de Elis Alquezar"
  },
  {
    name: "Arthur da Hora",
    specialty: "Planejamento, avaliação e inteligência de dados",
    image: "/team/arthur-da-hora.webp",
    imageAlt: "Retrato de Arthur da Hora"
  },
  {
    name: "Gabriela Brettas",
    specialty: "Desenvolvimento organizacional e avaliação",
    image: "/team/gabriela-brettas.webp",
    imageAlt: "Retrato de Gabriela Brettas"
  },
  {
    name: "Rodrigo Petrucelli",
    specialty: "Administrativo e financeiro",
    image: "/team/rodrigo-petrucelli.webp",
    imageAlt: "Retrato de Rodrigo Petrucelli"
  },
  {
    name: "Juliana Moraes",
    specialty: "Desenvolvimento organizacional e avaliação",
    image: "/team/juliana-moraes.webp",
    imageAlt: "Retrato de Juliana Moraes"
  },
  {
    name: "Igor Braz",
    specialty: "Vendas, representação e comunicação",
    image: "/team/igor-braz.webp",
    imageAlt: "Retrato de Igor Braz"
  },
  {
    name: "Antonio Ribeiro",
    specialty: "Planejamento, teoria de mudança e avaliação",
    image: "/team/antonio-ribeiro.webp",
    imageAlt: "Retrato de Antonio Ribeiro"
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
    tone: "green"
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
    tone: "periwinkle"
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
    tone: "purple"
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
    tone: "yellow"
  }
];

export const theoryPdf = {
  href: "/downloads/teoria-da-mudanca-move-social.pdf",
  label: "Baixar Teoria da Mudança em PDF"
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

export const contact = {
  email: "move@move.social",
  phone: "+55 11 3868.4093",
  address: "Rua Fidalga, 154 · conj. 4 · Pinheiros · São Paulo-SP · CEP 05432-000"
};
