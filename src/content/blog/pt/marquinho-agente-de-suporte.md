---
title: "Marquinho: o agente que entrou no grupo de suporte de tráfego pago"
description: "Como construí um agente de IA que diagnostica lojas, age em produção só com um 'aceito' humano e mede o próprio acerto — e o bug mais silencioso que já vi."
date: 2026-09-24
lang: "pt"
category: "ia"
draft: false
tags: ["IA", "Agentes", "Suporte", "Lições"]
translationOf: "en/marquinho-support-agent"
---

O grupo de WhatsApp de suporte do MetaAds na Brendi saiu de **~800 para ~2.000
mensagens por mês**. E quem respondia era sempre o mesmo punhado de gente, eu
incluso. Cada pergunta ("por que o anúncio dessa loja parou?", "o token caiu?",
"o Anderson gastou o que devia essa semana?") custava abrir log, rodar SQL,
olhar Sentry e conferir a conta de anúncio. O trabalho era sempre o mesmo, e
cada pedaço dependia de uma pessoa específica.

Então fiz o Marquinho.

## O que ele é

O Marquinho é um agente OpenClaw que roda na mesma VM do agente do aíChef. Ele
atende em três lugares:

- **Slack**, no canal de monitoramento de Meta Ads, quando alguém menciona ele;
- **o grupo de WhatsApp de suporte**, onde a dúvida realmente nasce;
- **crons diários e semanais**, que mandam relatório sem ninguém pedir.

Os próprios health checks de conta de anúncio do produto marcam ele quando acham
problema. Ou seja, o alerta já chega com alguém para investigar.

## Como ele pensa

A persona foi escrita para soar como um bom analista de suporte, não como um
chatbot:

- **veredito primeiro**, hipótese enquanto confere;
- **número antes de opinião**;
- toda resposta termina com uma linha **"Pra próxima:"**, que ensina o time a
  resolver sozinho da próxima vez.

A resposta tem sempre seis blocos: **Veredito · Evidências · Causa e dono ·
Ajuste proposto · Mensagem pro cliente · Pra próxima**. Quem lê sabe onde
procurar cada coisa, e o bloco "Mensagem pro cliente" já sai pronto para colar.

## O que ele consegue fazer

Cada capacidade é uma skill pequena e de escopo fechado:

| Skill | Faz |
|---|---|
| `store` | acha a loja por id, slug, nome ou telefone do dono |
| `diagnose` | diagnóstico da loja: saúde do token, execução semanal, histórico do Anderson |
| `sql` | queries prontas e `SELECT` livre, com `LIMIT` forçado e colunas de credencial bloqueadas |
| `logs` | logs de produção, janela máxima de 7 dias |
| `sentry` | só leitura |
| `context` | busca em FAQ, base de conhecimento, casos passados e guia de voz |
| `recall` / `remember` | memória de longo prazo |
| `report` | relatórios diário e semanal |
| `actions` | o caminho de escrita: simular/rodar o Anderson, reestrategizar, pausar/retomar, reconectar, ligar/desligar conjunto e anúncio |

A memória começou com **187 itens**: 101 casos reais, 45 itens de conhecimento e
41 respostas de FAQ, tirados de casos que eu revisei e aprovei um a um.

## A regra que deixa ele mexer em produção

Ler é livre. Escrever não.

Toda ação passa primeiro por um **preview**. Ela só executa quando uma pessoa
responde, no fio, a palavra literal **`aceito`**. Aí ela roda registrando quem
pediu, quem aprovou e em qual conversa, e vai para um log de auditoria. No
backend, o Marquinho tem credencial própria e só alcança rotas internas de
admin, com cada ação carimbada com o autor.

"Nunca escreve no banco" e "nunca aplica sem o `aceito`" são regras duras da
persona. E não dependem só dela: o próprio desenho das tools força as duas.

## Números de verdade

Semana de 07 a 13/09:

- **61 lojas diagnosticadas**
- **32 ações executadas em 30 lojas**
- **52 casos**: 24 ✅, 8 ⛔, 20 pendentes
- **75% de acerto no diagnóstico** entre os 32 casos já decididos

Na semana anterior foram 17 ações, 47 casos e 92% de acerto em 24 decididos. A
queda veio junto com mais volume e mais casos difíceis. Os casos errados viram
correção na memória, e é para isso que eles servem.

## O bug mais silencioso que já vi

Um dia o Marquinho simplesmente não respondeu uma mensagem no WhatsApp. Não teve
erro, stack trace nem alerta.

O arquivo de persona tinha **24.335 caracteres**, e o bootstrap do agente corta em
20 mil. **4.335 caracteres nunca chegaram ao modelo.** Ninguém percebeu, porque o
que sobrava ainda parecia uma persona completa. A lição: num agente, o prompt é
código. Ele precisa de limite medido e de teste, como qualquer outro código.

## O que aprendi

1. **Agente de suporte bom é um bom analista com ferramentas estreitas.** Cada
   skill faz uma coisa e tem guarda própria.
2. **O humano no loop precisa de um gesto explícito.** Um "ok" pode ser só
   educação. A palavra `aceito` é uma decisão.
3. **Meça o acerto desde o primeiro dia.** Sem ✅/⛔ por caso, "parece que está
   ajudando" é só impressão.
4. **Ensinar vale mais que responder.** O "Pra próxima:" faz o time depender cada
   vez menos do Marquinho.

O Marquinho não substituiu ninguém no grupo. Ele assumiu a parte repetitiva
(achar a loja, puxar o log, montar o diagnóstico) e deixou para as pessoas o que
precisa de julgamento.
