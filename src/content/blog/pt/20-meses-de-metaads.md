---
title: "20 meses de MetaAds: R$20M em vendas e o que escalar tráfego pago para 2.000 restaurantes me ensinou"
description: "Um resumo honesto do que construí na Brendi — os resultados, os desafios de escala, as fontes de aprendizado e os próximos desafios."
date: 2026-06-23
lang: "pt"
category: "produto"
pinned: true
draft: true
tags: ["Engenharia", "Growth", "IA", "Lições"]
translationOf: "en/20-months-of-metaads"
---

> **Rascunho.** Os números reais já estão aqui; o que está entre `[colchetes]`
> é onde você completa detalhes (datas, nomes internos, contexto sensível) antes
> de publicar.

## O contexto

Há cerca de 20 meses comecei a construir o **MetaAds** na Brendi: um sistema de
tráfego pago automatizado por IA para restaurantes. A premissa era simples de
dizer e difícil de fazer — **um dono de restaurante não deveria precisar
entender de mídia paga para crescer**.

Quando comecei, [descreva o estado inicial: era um MVP manual? uma planilha? um
serviço operado à mão?]. O objetivo era transformar isso em produto.

## Onde chegamos (os números)

- **2.000+ restaurantes** atendidos pelo produto
- **R$4M+** em mídia investidos e geridos pelo sistema
- **R$20M+** em vendas rastreadas e atribuídas às campanhas
- [adicione: ROAS médio? nº de campanhas/semana? % de operação automatizada?]

Esses números não vieram de uma feature, e sim de três camadas que foram
amadurecendo juntas.

## O que construí

### 1. MetaAds Platform
O produto que o restaurante usa: onboarding self-service, billing recorrente e
um dashboard pensado para o **dono**, não para o mídia buyer.
[conte 1 desafio concreto: ex. reduzir o tempo de ativação de X para Y.]

### 2. Campaign AI
A camada autônoma que **decide orçamento e segmentação, gera criativos e
otimiza** as campanhas semanalmente — sem intervenção manual.
[conte como era antes (manual) e o que a automação destravou.]

### 3. Data & Attribution Layer
A fonte da verdade: ligar **cada real investido à venda que ele gerou**. Foi o
que tornou os R$20M+ confiáveis em vez de uma estimativa.
[conte o desafio técnico de tracking ponta a ponta.]

## Os desafios de escalabilidade

Escalar de [N] para 2.000+ restaurantes quebrou coisas que funcionavam bem em
pequena escala:

- **[Desafio 1 — ex.: limites de rate da Meta Marketing API]:** [o que aconteceu
  e como resolvi.]
- **[Desafio 2 — ex.: custo de processar atribuição para milhares de contas]:**
  [solução.]
- **[Desafio 3 — ex.: operação/observabilidade]:** [solução.]

## A maior lição: o ICP errado

O trecho de que mais me orgulho não é técnico, é de **produto**.

A análise de coortes mostrou que estávamos atraindo o **ICP errado** — e isso
aparecia como uma taxa de cancelamento (*disable rate*) altíssima. Em vez de
otimizar a aquisição, atacamos a **qualificação**: adicionamos um *fee gate* no
onboarding.

O resultado: **churn de 50% → 4%**.

[detalhe: como descobriu isso nos dados? por que o fee gate filtrou o ICP certo?]

## Fontes de aprendizado

[liste o que mais te ensinou nesse período — pode ser livros, pessoas, errar em
produção, documentação da Meta, comunidades. Deixa pessoal.]

## Os próximos desafios

O próximo salto é tornar o sistema ainda mais autônomo: estou construindo um
**agente de IA que gere os anúncios dos clientes de ponta a ponta** — decisão,
criativo e otimização — com o mínimo de supervisão humana.
[conte o que te empolga e o que ainda é incerto nesse caminho.]

---

*Se você toca crescimento de restaurantes, tráfego pago em escala ou agentes de
IA aplicados a produto, [me chama no LinkedIn](https://www.linkedin.com/in/leojunioyuri/).*
