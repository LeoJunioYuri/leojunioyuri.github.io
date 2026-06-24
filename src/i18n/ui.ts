import type { Lang } from "@/consts";

/**
 * All user-facing UI strings, per locale.
 * Blog post bodies live in src/content/blog/<lang>/ instead.
 */
export const ui = {
  pt: {
    "nav.work": "Trabalho",
    "nav.writing": "Escrita",
    "nav.about": "Sobre",
    "nav.now": "Agora",
    "nav.life": "Vida",

    "hero.role": "Product Engineer",
    "hero.tagline":
      "Product Engineer construindo automação com IA para o crescimento de restaurantes.",
    "hero.lede":
      "Criei o MetaAds na Brendi do zero a 2.000+ restaurantes, gerindo R$4M+ em mídia e gerando R$20M+ em vendas rastreadas.",
    "hero.location": "São José dos Campos, Brasil",
    "parallax.toast":
      "Modo Parallax — meu apelido na UFLA. Dizem que eu usava o efeito até demais.",
    "hero.cta.work": "Ver o que construí",
    "hero.cta.writing": "Ler os bastidores",

    "stats.restaurants": "restaurantes",
    "stats.media": "em mídia gerida",
    "stats.sales": "em vendas rastreadas",
    "stats.months": "meses construindo",

    "work.title": "O que construí",
    "work.subtitle":
      "Três frentes que, juntas, formam um sistema de tráfego pago autônomo.",

    "case.platform.title": "MetaAds Platform",
    "case.platform.desc":
      "O produto que restaurantes usam: dashboard, billing, onboarding self-service e operação em escala.",
    "case.platform.points": [
      "Onboarding self-service que reduziu o tempo de ativação",
      "Billing e cobrança recorrente integrados",
      "Dashboard de resultados pensado para o dono do restaurante, não para o mídia",
    ],

    "case.ai.title": "Campaign AI",
    "case.ai.desc":
      "A camada autônoma: decide, cria e otimiza campanhas de tráfego pago sem intervenção manual.",
    "case.ai.points": [
      "Decisão autônoma de orçamento e segmentação",
      "Geração e rotação de criativos",
      "Loop de otimização semanal por restaurante",
    ],

    "case.data.title": "Data & Attribution Layer",
    "case.data.desc":
      "A fonte da verdade: ROAS, coortes, atribuição de clientes e tracking ponta a ponta.",
    "case.data.points": [
      "Atribuição de vendas a campanhas (R$20M+ rastreados)",
      "Análise de coortes e churn por ICP",
      "Tracking ponta a ponta do clique à venda",
    ],

    "highlight.label": "Estudo de caso em destaque",
    "highlight.title": "ICP errado → churn de 50% para 4%",
    "highlight.body":
      "A análise de coortes revelou que estávamos atraindo o ICP errado. Adicionamos um fee gate no onboarding e a taxa de cancelamento despencou de 50% para 4%.",
    "highlight.metricBefore": "antes",
    "highlight.metricAfter": "depois",
    "highlight.read": "Ler o estudo completo",

    "about.title": "Sobre",
    "about.body":
      "Sou o Leonardo — nascido em Belo Horizonte, hoje em São José dos Campos. Gosto de trabalhar onde produto, engenharia e distribuição se encontram: ficar perto dos usuários, entregar rápido, medir impacto e transformar problemas operacionais bagunçados em sistemas que escalam.",
    "about.body2":
      "Cidadão italiano, construo com horizonte internacional. Sou movido por números reais e por entregas que chegam à mão de quem usa — e por aprender em público, escrevendo o que enfrento pelo caminho.",
    "about.body3":
      "No fundo, persigo as duas metades: construir coisas que escalam e construir uma vida que seja minha — menos status, mais liberdade.",
    "about.stack": "Trabalho com",
    "interests.title": "Fora do trabalho",
    "interests.subtitle": "O que me forma além do código.",
    "interests.metal.title": "Metal sinfônico & gótico",
    "interests.metal.desc":
      "Theatre of Tragedy, Therion. Gosto de destrinchar letra, contexto e simbolismo.",
    "interests.tkd.title": "Taekwondo",
    "interests.tkd.desc": "Disciplina e ritmo que levo pra dentro do trabalho.",
    "interests.intl.title": "Raiz italiana, mira global",
    "interests.intl.desc":
      "Cidadão europeu construindo com horizonte internacional.",
    "interests.writing.title": "Escrita manual",
    "interests.writing.desc":
      "Escrevo pra aprender e lembrar — sem IA, no capricho.",

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
    "life.music.title": "Ouvindo",
    "life.music.empty": "Em breve — Spotify a conectar (veja o README).",
    "life.games.title": "Jogos",
    "life.games.recent": "Recentemente na Steam",
    "life.games.top": "Mais jogados de todos os tempos",
    "life.games.empty": "Em breve — Steam a conectar (veja o README).",
    "life.games.note": "Atividade recente da Steam (WoW/Epic não aparecem aqui).",
    "life.games.played": "Favoritos & jogados",
    "life.games.wishlist": "Quero jogar",
    "life.games.wishlist.cta": "Ver wishlist completa na Steam",
    "life.games.steam": "Ver perfil na Steam",
    "life.xbox.title": "Recentemente no Xbox",
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
    "nav.writing": "Writing",
    "nav.about": "About",
    "nav.now": "Now",
    "nav.life": "Life",

    "hero.role": "Product Engineer",
    "hero.tagline":
      "Product Engineer building AI automation for restaurant growth.",
    "hero.lede":
      "I built MetaAds at Brendi from zero to 2,000+ restaurants, managing R$4M+ in media and generating R$20M+ in tracked sales.",
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
    "work.subtitle":
      "Three pillars that together make an autonomous paid-traffic system.",

    "case.platform.title": "MetaAds Platform",
    "case.platform.desc":
      "The product restaurants use: dashboard, billing, self-service onboarding, and operation at scale.",
    "case.platform.points": [
      "Self-service onboarding that cut time-to-activation",
      "Integrated recurring billing",
      "A results dashboard built for restaurant owners, not media buyers",
    ],

    "case.ai.title": "Campaign AI",
    "case.ai.desc":
      "The autonomous layer: it decides, creates, and optimizes paid-traffic campaigns with no manual work.",
    "case.ai.points": [
      "Autonomous budget and targeting decisions",
      "Creative generation and rotation",
      "Weekly optimization loop, per restaurant",
    ],

    "case.data.title": "Data & Attribution Layer",
    "case.data.desc":
      "The source of truth: ROAS, cohorts, customer attribution, and end-to-end tracking.",
    "case.data.points": [
      "Sales attributed to campaigns (R$20M+ tracked)",
      "Cohort and churn analysis by ICP",
      "End-to-end tracking from click to sale",
    ],

    "highlight.label": "Featured case study",
    "highlight.title": "Wrong ICP → churn from 50% to 4%",
    "highlight.body":
      "Cohort analysis revealed we were attracting the wrong ICP. We added a fee gate at onboarding and the disable rate dropped from 50% to 4%.",
    "highlight.metricBefore": "before",
    "highlight.metricAfter": "after",
    "highlight.read": "Read the full case study",

    "about.title": "About",
    "about.body":
      "I'm Leonardo — born in Belo Horizonte, now based in São José dos Campos. I like working where product, engineering and distribution meet: staying close to users, shipping fast, measuring impact, and turning messy operational problems into systems that scale.",
    "about.body2":
      "An Italian citizen, I build with an international horizon. I'm driven by real numbers and by work that reaches the people who use it — and by learning in public, writing about what I face along the way.",
    "about.body3":
      "At heart, I chase both halves: building things that scale, and building a life that's my own — less status, more freedom.",
    "about.stack": "I work with",
    "interests.title": "Off the clock",
    "interests.subtitle": "What shapes me beyond the code.",
    "interests.metal.title": "Symphonic & gothic metal",
    "interests.metal.desc":
      "Theatre of Tragedy, Therion. I love digging into lyrics, context and symbolism.",
    "interests.tkd.title": "Taekwondo",
    "interests.tkd.desc": "Discipline and rhythm I carry into the work.",
    "interests.intl.title": "Italian roots, global aim",
    "interests.intl.desc":
      "An EU citizen building with an international horizon.",
    "interests.writing.title": "Writing by hand",
    "interests.writing.desc":
      "I write to learn and remember — no AI, done with care.",

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
    "life.music.title": "Listening",
    "life.music.empty": "Soon — Spotify to connect (see the README).",
    "life.games.title": "Games",
    "life.games.recent": "Recently on Steam",
    "life.games.top": "All-time most played",
    "life.games.empty": "Soon — Steam to connect (see the README).",
    "life.games.note": "Recent Steam activity (WoW/Epic don't show here).",
    "life.games.played": "Favorites & played",
    "life.games.wishlist": "Want to play",
    "life.games.wishlist.cta": "View full wishlist on Steam",
    "life.games.steam": "View Steam profile",
    "life.xbox.title": "Recently on Xbox",
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
