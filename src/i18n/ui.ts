import type { Lang } from "@/consts";

/**
 * All user-facing UI strings, per locale.
 * Blog post bodies live in src/content/blog/<lang>/ instead.
 */
export const ui = {
  pt: {
    "nav.work": "Trabalho",
    "nav.brendi": "Brendi",
    "nav.writing": "Escrita",
    "nav.about": "Sobre",
    "nav.now": "Agora",
    "nav.life": "Vida",

    "hero.role": "Product Engineer",
    "hero.tagline":
      "Product Engineer construindo automação com IA para fazer restaurantes venderem mais.",
    "hero.lede":
      "Construí o MetaAds na Brendi — do zero a 2.000+ restaurantes, com R$4M+ em mídia gerida e R$20M+ em vendas rastreadas para restaurantes.",
    "hero.location": "São José dos Campos, Brasil",
    "parallax.toast":
      "Modo Parallax — meu apelido na UFLA. Dizem que eu usava o efeito até demais.",
    "hero.cta.work": "Ver o que construí",
    "hero.cta.writing": "Ler os bastidores",

    "stats.restaurants": "restaurantes",
    "stats.media": "em mídia gerida",
    "stats.sales": "em vendas",
    "stats.months": "meses construindo",

    "work.title": "O que construí",
    "work.subtitle": "Sistema de tráfego pago autônomo para restaurantes.",
    "work.cta": "Ver o case completo na Brendi →",

    "case.metaads.title": "MetaAds — Tráfego pago autônomo para restaurantes",
    "case.metaads.desc": "Construí do zero o sistema end-to-end que gerencia campanhas de tráfego pago para 2.000+ restaurantes — do onboarding à IA que decide e otimiza, ao rastreamento de cada venda gerada.",
    "case.bullets": [
      "Plataforma SaaS: painel, investimento, onboarding e backoffice",
      "Gestor de Tráfego por IA: cria novos anúncios, ajusta orçamentos e otimiza",
      "Data & Attribution: R$20M+ em vendas rastreadas ponta a ponta",
      "2.000+ restaurantes · R$4M+ em mídia gerida",
    ],

    "stack.title": "Stack",
    "stack.subtitle": "Ferramentas que uso no dia a dia.",

    "contact.title": "Vamos conversar",
    "contact.body": "Aberto a conversas sobre product engineering, automação com IA, sistemas de growth e startups em estágio inicial.",
    "contact.email": "Enviar email",

    "case.platform.title": "Tráfego Pago Automatizado",
    "case.platform.desc":
      "O produto que restaurantes usam: Painel com métricas, investimento automatizado, cadastro e operação em escala.",
    "case.platform.points": [
      "Investimento e cobrança recorrente integrados",
      "Painel de resultados pensado para o dono do restaurante, não para o gestores",
    ],

    "case.ai.title": "Campanhas de anúncios com IA",
    "case.ai.desc":
      "A camada autônoma: decide, cria e otimiza campanhas de tráfego pago sem intervenção manual.",
    "case.ai.points": [
      "Decisão autônoma de orçamento e segmentação",
      "Geração e rotação de criativos",
      "Rotina de otimização semanal por restaurante",
    ],

    "case.data.title": "Data & Attribution Layer",
    "case.data.desc":
      "A fonte da verdade: Dados como ROAS, cohorts, atribuição de vendas e rastreamento ponta a ponta.",
    "case.data.points": [
      "Atribuição de vendas a campanhas (R$20M+ rastreados)",
      "Análise de cohorts e churns por ICP",
      "Rastreamento ponta a ponta do clique à venda",
    ],

    "highlight.label": "Estudo de caso em destaque",
    "highlight.title": "MetaAds v3: como mudar o destino do anúncio fez vender 10× mais",
    "highlight.body":
      "A versão 3 do MetaAds mudou o destino dos anúncios do WhatsApp para o cardápio digital. Uma mudança técnica pequena que gerou um impacto desproporcional: clientes vendendo 10× mais, retenção subindo e o faturamento da Brendi crescendo semana a semana de forma constante.",
    "highlight.metricBefore": "WhatsApp",
    "highlight.metricAfter": "Cardápio",
    "highlight.metricValueBefore": "1×",
    "highlight.metricValueAfter": "10×",
    "highlight.read": "Ler o estudo completo",

    "about.title": "Sobre",
    "about.body":
      "Sou Leonardo Basso, engenheiro de software e product engineer, formado em Ciência da Computação pela Universidade Federal de Lavras e com interesse especial pelo ponto em que produto, engenharia, IA e escala se encontram. Gosto de trabalhar com foco em resultado: entender problemas operacionais reais, transformar esses problemas em sistemas simples de usar e medir se eles realmente ajudam o negócio a crescer.",
    "about.body2":
      "Nos últimos anos, meu foco tem sido construir produtos que conectam tecnologia e impacto — especialmente no mercado de restaurantes, delivery e tráfego pago. Na Brendi, com o nosso MetaAds interno, trabalho em uma camada que une IA, dados, integrações e marketing para ajudar negócios locais a conquistarem novos clientes em escala, tudo de forma automática, com o mínimo de intervenção humana.",
    "about.body3":
      "Fora do código, também me interesso por música, história, artes marciais, filmes, jogos, investimentos, vinho e discussões sobre crescimento em todos os âmbitos da vida — claro, sempre com muito humor.",
    "about.stack": "Trabalho com",
    "interests.title": "Fora do trabalho",
    "interests.subtitle": "O que me forma além do código.",
    "interests.metal.title": "Metal sinfônico & gótico",
    "interests.metal.desc":
      "Theatre of Tragedy, Therion. Gosto de destrinchar letra, contexto e simbolismo.",
    "interests.tkd.title": "Artes Marciais",
    "interests.tkd.desc": "Taekwondo, Boxe, Muay Thai. Disciplina e ritmo que levo pra dentro do trabalho.",
    "interests.intl.title": "História & estratégia",
    "interests.intl.desc":
      "Quando não estou construindo produto, costumo estar treinando, lendo ou estudando história. Tenho interesse por civilizações, estratégia e disciplina — de Roma ao Brasil Imperial, das artes marciais aos jogos com mundos bem construídos. No fundo, gosto de entender como sistemas nascem, evoluem, quebram e podem ser melhorados.",
    "interests.writing.title": "Escrita manual",
    "interests.writing.desc":
      "Escrevo para aprender, lembrar e registrar decisões enquanto os produtos ainda estão vivos.",

    "writing.title": "Escrita",
    "writing.subtitle":
      "Notas sobre o que construí, os desafios de escala e o que aprendi pelo caminho.",
    "writing.empty": "Em breve.",
    "writing.readingTime": "min de leitura",
    "writing.back": "Voltar para a escrita",
    "writing.all": "Todos os posts",
    "writing.draft": "Rascunho",
    "writing.startHere": "Comece por aqui",
    "writing.filterAll": "Todos",
    "writing.empty.filter": "Nenhum post nesta categoria ainda.",

    "now.title": "Agora",
    "now.subtitle": "No que estou focado neste momento.",

    "life.title": "Vida",
    "life.subtitle": "Música, jogos e filmes — o que ando consumindo.",
    "life.updated": "Atualizado",
    "life.music.title": "Músicas",
    "life.music.recent": "Últimas ouvidas",
    "life.music.top": "Mais ouvidas",
    "life.music.tab.short": "4 semanas",
    "life.music.tab.medium": "6 meses",
    "life.music.tab.long": "Todos os tempos",
    "life.music.empty": "Em breve — Spotify a conectar (veja o README).",
    "life.games.title": "Jogos",
    "life.games.recent": "Jogados recentemente",
    "life.games.top": "Mais jogados",
    "life.games.empty": "Em breve — conectar plataformas.",
    "life.games.note": "Últimas 2 semanas na Steam.",
    "life.games.played": "Favoritos & jogados",
    "life.games.wishlist": "Quero jogar",
    "life.games.wishlist.cta": "Ver wishlist completa na Steam",
    "life.games.steam": "Ver perfil na Steam",
    "life.xbox.title": "Recentemente no Xbox",
    "life.xbox.top": "Mais dedicação no Xbox",
    "life.xbox.cta": "Ver perfil no Xbox",
    "life.video.title": "No YouTube",
    "life.video.empty": "Em breve — canal a conectar.",
    "life.video.cta": "Ver o canal",
    "life.films.title": "Filmes favoritos",
    "life.films.watched": "Assistidos",
    "life.films.watchlist": "Quero ver",
    "life.films.empty": "Lista em breve.",
    "life.films.imdb": "Ver lista completa no Letterboxd",
    "life.minutes": "min nas últimas 2 semanas",

    "footer.built": "Construído com Astro e Tailwind.",
    "footer.rights": "Todos os direitos reservados.",

    "theme.toggle": "Alternar tema",
    "lang.toggle": "English",
    "lang.current": "Português",
  },

  en: {
    "nav.work": "Work",
    "nav.brendi": "Brendi",
    "nav.writing": "Writing",
    "nav.about": "About",
    "nav.now": "Now",
    "nav.life": "Life",

    "hero.role": "Product Engineer",
    "hero.tagline":
      "Product Engineer building AI automation to make restaurants sell more.",
    "hero.lede":
      "I built MetaAds at Brendi — from zero to 2,000+ restaurants, with R$4M+ in media managed and R$20M+ in tracked sales for restaurants.",
    "hero.location": "São José dos Campos, Brazil · EU citizen",
    "parallax.toast":
      "Parallax mode — my UFLA nickname. They say I overused the effect.",
    "hero.cta.work": "See what I shipped",
    "hero.cta.writing": "Read behind the scenes",

    "stats.restaurants": "restaurants",
    "stats.media": "in media managed",
    "stats.sales": "in tracked sales",
    "stats.months": "months building",

    "work.title": "What I shipped",
    "work.subtitle": "Autonomous paid-traffic system for restaurants.",
    "work.cta": "See the full Brendi case →",

    "case.metaads.title": "MetaAds — Autonomous paid traffic for restaurants",
    "case.metaads.desc": "Built from scratch the end-to-end system that manages paid-traffic campaigns for 2,000+ restaurants — from onboarding to the AI that decides and optimizes, to tracking every sale generated.",
    "case.bullets": [
      "SaaS platform: dashboard, billing, onboarding, backoffice",
      "AI Traffic Manager: creates new ads, adjusts budgets and optimizes",
      "Data & Attribution: R$20M+ in sales tracked end-to-end",
      "2,000+ restaurants · R$4M+ in media managed",
    ],

    "stack.title": "Stack",
    "stack.subtitle": "Tools I use day to day.",

    "contact.title": "Let's talk",
    "contact.body": "Open to conversations about product engineering, AI automation, growth systems and early-stage startups.",
    "contact.email": "Send email",

    "case.platform.title": "Automated Paid Traffic",
    "case.platform.desc":
      "The product restaurants use: metrics dashboard, automated investment, onboarding, and operation at scale.",
    "case.platform.points": [
      "Integrated investment and recurring billing",
      "A results dashboard built for restaurant owners, not managers",
    ],

    "case.ai.title": "AI-Powered Ad Campaigns",
    "case.ai.desc":
      "The autonomous layer: it decides, creates, and optimizes paid-traffic campaigns with no manual work.",
    "case.ai.points": [
      "Autonomous budget and targeting decisions",
      "Creative generation and rotation",
      "Weekly optimization routine, per restaurant",
    ],

    "case.data.title": "Data & Attribution Layer",
    "case.data.desc":
      "The source of truth: data like ROAS, cohorts, sales attribution, and end-to-end tracking.",
    "case.data.points": [
      "Sales attributed to campaigns (R$20M+ tracked)",
      "Cohort and churn analysis by ICP",
      "End-to-end tracking from click to sale",
    ],

    "highlight.label": "Featured case study",
    "highlight.title": "MetaAds v3: changing the ad destination drove 10× more sales",
    "highlight.body":
      "MetaAds v3 redirected ads from WhatsApp to the digital menu. A small technical change that had a disproportionate impact: clients selling 10× more, retention climbing, and Brendi's revenue growing week over week consistently.",
    "highlight.metricBefore": "WhatsApp",
    "highlight.metricAfter": "Menu",
    "highlight.metricValueBefore": "1×",
    "highlight.metricValueAfter": "10×",
    "highlight.read": "Read the full case study",

    "about.title": "About",
    "about.body":
      "I'm Leonardo Basso, a software and product engineer with a degree in Computer Science from the Federal University of Lavras, with a particular interest in the intersection of product, engineering, AI and scale. I like working with a focus on outcomes: understanding real operational problems, turning them into simple systems, and measuring whether they actually help the business grow.",
    "about.body2":
      "Over the last few years, my focus has been building products that connect technology and impact — especially in the restaurant, delivery and paid-traffic space. At Brendi, with our internal MetaAds, I work on a layer that combines AI, data, integrations and marketing to help local businesses acquire new customers at scale, fully automated, with minimal human intervention.",
    "about.body3":
      "Outside the code, I'm also into music, history, martial arts, films, games, investments, wine and conversations about growth in all areas of life — always with a lot of humor.",
    "about.stack": "I work with",
    "interests.title": "Off the clock",
    "interests.subtitle": "What shapes me beyond the code.",
    "interests.metal.title": "Symphonic & gothic metal",
    "interests.metal.desc":
      "Theatre of Tragedy, Therion. I love digging into lyrics, context and symbolism.",
    "interests.tkd.title": "Martial Arts",
    "interests.tkd.desc": "Taekwondo, Boxing, Muay Thai. Discipline and rhythm I carry into the work.",
    "interests.intl.title": "History & strategy",
    "interests.intl.desc":
      "When I'm not building product, I'm usually training, reading, or studying history. I'm drawn to civilizations, strategy and discipline — from Rome to Imperial Brazil, from martial arts to games with well-crafted worlds. At the core, I like understanding how systems are born, evolve, break and can be improved.",
    "interests.writing.title": "Writing by hand",
    "interests.writing.desc":
      "I write to learn, remember, and document decisions while the products are still alive.",

    "writing.title": "Writing",
    "writing.subtitle":
      "Notes on what I built, the scaling challenges, and what I learned along the way.",
    "writing.empty": "Coming soon.",
    "writing.readingTime": "min read",
    "writing.back": "Back to writing",
    "writing.all": "All posts",
    "writing.draft": "Draft",
    "writing.startHere": "Start here",
    "writing.filterAll": "All",
    "writing.empty.filter": "No posts in this category yet.",

    "now.title": "Now",
    "now.subtitle": "What I'm focused on right now.",

    "life.title": "Life",
    "life.subtitle": "Music, games and films — what I'm into lately.",
    "life.updated": "Updated",
    "life.music.title": "Music",
    "life.music.recent": "Recently played",
    "life.music.top": "Most played",
    "life.music.tab.short": "4 weeks",
    "life.music.tab.medium": "6 months",
    "life.music.tab.long": "All time",
    "life.music.empty": "Soon — Spotify to connect (see the README).",
    "life.games.title": "Games",
    "life.games.recent": "Recently played",
    "life.games.top": "Most played",
    "life.games.empty": "Soon — connecting platforms.",
    "life.games.note": "Last 2 weeks on Steam.",
    "life.games.played": "Favorites & played",
    "life.games.wishlist": "Want to play",
    "life.games.wishlist.cta": "View full wishlist on Steam",
    "life.games.steam": "View Steam profile",
    "life.xbox.title": "Recently on Xbox",
    "life.xbox.top": "Most dedicated on Xbox",
    "life.xbox.cta": "View Xbox profile",
    "life.video.title": "On YouTube",
    "life.video.empty": "Soon — channel to connect.",
    "life.video.cta": "Visit the channel",
    "life.films.title": "Favorite films",
    "life.films.watched": "Watched",
    "life.films.watchlist": "Watchlist",
    "life.films.empty": "List coming soon.",
    "life.films.imdb": "See full list on Letterboxd",
    "life.minutes": "min in the last 2 weeks",

    "footer.built": "Built with Astro and Tailwind.",
    "footer.rights": "All rights reserved.",

    "theme.toggle": "Toggle theme",
    "lang.toggle": "Português",
    "lang.current": "English",
  },
} as const;

export type UIKey = keyof (typeof ui)["pt"];
