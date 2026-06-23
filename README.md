# leojunioyuri.github.io

Site pessoal de Leonardo Basso — Product Engineer.
Astro + TypeScript + Tailwind CSS v4, com blog bilíngue (PT/EN), tema
claro/escuro e detecção automática de idioma e tema do sistema.

## Stack

- **[Astro](https://astro.build)** — site estático, zero JS por padrão
- **TypeScript** — strict
- **Tailwind CSS v4** — via `@tailwindcss/vite`
- **@astrojs/sitemap** + **@astrojs/rss** — SEO e feed

## Rodando localmente

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # gera ./dist
npm run preview  # serve o build
```

## Estrutura

```
src/
  components/        # Header, Hero, Cases, Highlight, About, diagramas...
  content/blog/
    pt/              # posts em português
    en/              # posts em inglês
  i18n/              # ui.ts (todos os textos) + utils.ts (helpers)
  layouts/           # BaseLayout (SEO/OG, tema, fontes)
  pages/             # PT na raiz, EN em /en
  styles/global.css  # tokens de design + prose
public/              # favicon, og.svg, robots.txt
```

## Escrevendo um post

1. Crie `src/content/blog/pt/meu-post.md` (e a versão `en/` se quiser bilíngue).
2. Preencha o frontmatter:

```yaml
---
title: "Título"
description: "Resumo de 1–2 linhas (vira a meta description)."
date: 2026-06-23
lang: "pt"          # "pt" ou "en"
tags: ["Engenharia", "Growth"]
draft: false        # true esconde dos feeds e marca como rascunho
---
```

3. Escreva em Markdown. Code blocks ganham syntax highlighting automático.

## Idioma e tema

- O site **detecta o idioma do navegador** na primeira visita (PT para `pt-*`,
  EN caso contrário) e **respeita `prefers-color-scheme`** para o tema.
- A escolha manual (toggles no header) é salva em `localStorage`.

## Deploy (GitHub Pages)

Este é um *user site* (`leojunioyuri.github.io`), servido na raiz do domínio.

1. Suba este conteúdo para o repositório `leojunioyuri/leojunioyuri.github.io`
   (branch `main`).
2. Em **Settings → Pages**, defina **Source: GitHub Actions**.
3. O workflow em `.github/workflows/deploy.yml` faz build e deploy a cada push.

> Atualize `site` em `astro.config.mjs` se mudar o domínio.

## Deploy (Vercel) — alternativa

A Vercel detecta o Astro automaticamente; não precisa de adapter para site
estático.

1. Importe o repositório em [vercel.com/new](https://vercel.com/new).
2. Build command `astro build`, output `dist` (já é o default detectado).
3. Cada PR ganha um **preview deploy**; `main` vira produção.
4. Para domínio próprio, configure em **Settings → Domains** e ajuste `site`
   em `astro.config.mjs`.

> Analytics na Vercel: `npm i @vercel/analytics` e adicione o componente no
> `BaseLayout`. (Fora da Vercel, prefira Cloudflare Web Analytics ou GoatCounter.)

## Estrutura de páginas (i18n)

As rotas em `src/pages/` são **cascas finas**: cada uma só importa um corpo de
`src/components/pages/` passando `lang`. A lógica vive uma vez só:

- `HomeBody` · `WritingBody` · `NowBody` · `PostBody`

PT mora na raiz (`/`), EN em `/en/`. Para um post novo bilíngue, crie o `.md` em
`pt/` e `en/` — as rotas `[...slug]` geram as páginas automaticamente.

## Página /life (música, jogos, filmes)

Mistura dados **curados por você** com dados **ao vivo** atualizados por uma
GitHub Action.

**Curados (edite os arquivos):**
- `src/data/films.ts` — filmes assistidos (nota/estrela) + watchlist.
- `src/data/games.ts` — jogos favoritos/jogados + "quero jogar".
- IMDb: preencha `links.imdb` em `src/consts.ts` para exibir o link da lista.

**Ao vivo (via `.github/workflows/update-life-data.yml`, a cada 6h):**
Adicione os **Secrets** do repositório (Settings → Secrets and variables →
Actions). Cada fonte é opcional — sem o secret, a seção só mostra "em breve".

| Fonte | Secrets necessários |
|---|---|
| Spotify (tocadas recentes) | `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` |
| Steam (jogados recentes) | `STEAM_API_KEY`, `STEAM_ID` |
| YouTube (últimos vídeos) | `YOUTUBE_CHANNEL_ID` (sem secret de API — usa o RSS público) |

> Spotify: crie um app em developer.spotify.com, autorize o escopo
> `user-read-recently-played` uma vez e guarde o **refresh token**.
> Steam: pegue a key em steamcommunity.com/dev/apikey e use seu SteamID64
> (perfil público). YouTube: o `channel_id` começa com `UC...`.
> WoW/Epic não têm API pública simples — entram pela lista curada de jogos.

A Action commita os JSONs em `src/data/`, o que dispara o deploy do Pages.
