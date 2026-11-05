---
title: "Dei memória a dez agentes. Consegui provar uma resposta."
description: "Como fizemos a memória virar padrão em todos os agentes de IA da Brendi, o que aprendi guardando menos, e o que aconteceu quando fui medir se ela melhorou alguma coisa."
date: 2026-11-05
lang: "pt"
category: "ia"
draft: false
tags: ["IA", "Agentes", "Engenharia", "Dados", "Lições"]
translationOf: "en/memory-for-ten-agents"
---

Na Brendi, uma plataforma de delivery pra restaurantes, o dono conversa com vários agentes de IA. O Anderson cuida dos anúncios, o Kleber das redes sociais, o Fred da gestão, o Gabriel do cardápio, e assim por diante. São dez hoje.

Em uma semana, a memória virou padrão em todos eles. Eu queria abrir este post dizendo que os agentes ficaram melhores. Fui medir antes de escrever. **Não consigo dizer isso.** Consigo mostrar a engenharia, que deu certo, e uma única resposta que eu posso provar que dependeu da memória.

Esse post é sobre as duas coisas.

---

## O problema

O dono conta pra um agente que a loja não abre na segunda. Na semana seguinte, o agente sugere uma ação pra segunda. Quem já conversou com um atendente que pede os mesmos dados três vezes sabe o que isso faz com a confiança.

A ideia não nasceu agora. Em abril, o João Vitor criou o primeiro sistema de memória, pro Fred: um extrator que rodava depois da conversa e uma tabela de fatos por loja. Em julho eu estendi o mesmo extrator pro Anderson, e em outubro o Rogério estendeu pro Kleber. Mas cada agente foi ganhando o seu jeito: três conjuntos de regras, três tabelas. Os outros agentes não guardavam nada. E o dono não tinha como ver o que cada um sabia sobre a loja dele.

No fim de outubro, pedi ao Rogério pra migrar esse extrator pro nosso kit de agentes, e ele o tornou genérico: depois de cada mensagem, fora da conversa, uma tarefa lê o que o dono escreveu e decide se tem um fato pra guardar. Faltava o resto: um lugar padrão pra guardar, a busca na hora de responder, uma tela pro dono, e uma resposta única pra quando o fato muda.

Levei a proposta pra reunião semanal de engenharia e o time topou. As decisões que mais me ensinaram foram estas.

## Guardar menos

A primeira surpresa foi que o sistema antigo guardava demais.

Peguei 278 mensagens reais do Anderson. O extrator antigo tinha guardado 34 fatos delas. Li um por um: 14 eram pedidos de ação ("pausa os anúncios"), 4 eram cópias e 2 eram preços do cardápio, que o sistema já sabe. Pedido de ação não é fato sobre a loja. É tarefa. Se vira memória, o agente passa a "lembrar" de uma ordem que já foi cumprida.

Rodei o prompt novo nas mesmas 278 mensagens: 11 fatos. A régua apertou e perdeu coisa boa também: dois fatos úteis ficaram de fora. Aceitei a troca. Memória errada custa mais que memória faltando, porque o dono não sabe que ela está lá.

Na primeira semana com todos os agentes, o funil ficou assim:

| Etapa (30/10 a 05/11) | Quantidade |
|---|---|
| Mensagens analisadas pelo extrator | 5.887 |
| Paradas num filtro grátis, antes do modelo (curtas ou só perguntas) | 2.786 (47%) |
| Enviadas ao modelo | 3.101 |
| Fatos propostos | 239 |
| Barrados na conferência com as palavras do dono | 75 (31%) |
| Salvos | 164 |

Um fato salvo a cada 36 mensagens, e nenhuma falha de extração no período. Nove dos dez agentes salvaram alguma coisa. A exceção foi a Brenda, com zero em 39 mensagens.

Aquele 31% é a regra que eu mais gosto. Todo fato precisa vir com a citação literal do que o dono escreveu, e o código confere se a citação existe mesmo. Isso segura alucinação. E segura outra coisa: memória é porta de ataque. Um texto malicioso que vira memória continua influenciando o agente pra sempre. Por isso comentário de Instagram e mensagem de cliente nunca viram memória. Só o que o dono escreveu.

## Quando o fato muda

O Fred já sabia atualizar um fato. O Anderson e o Kleber não: eles decidiam duplicata por semelhança. Se o fato novo parecia 0,85 ou mais com um antigo, o novo era descartado. Parece razoável até o dono mudar um preço. Dois textos do mesmo combo, com preços diferentes, davam 0,965 de semelhança. O preço novo sumia e o agente ficava com o velho.

Semelhança mede se dois textos falam da mesma coisa. Não mede qual deles é verdade agora.

A correção foi levar pro kit o que o Fred já fazia: deixar o modelo decidir. Ele já vê os fatos parecidos, então responde "é novo" ou "substitui o número tal". O antigo não é apagado: ganha uma data de fim e aponta pro novo. Dos 164 fatos da semana, 24 (15%) substituíram um anterior. Fato que muda não é caso raro.

## O índice que ninguém usava

Memória de agente parece pedir busca vetorial com índice. Fui olhar a tabela que já existia: o índice de vetor ocupava cerca de 500 MB, quase metade dela. Tinha sido usado **zero vezes** em um mês.

Faz sentido. A busca é sempre dentro de uma loja, e a loja com mais memórias tinha 125 linhas. Ler todas elas e comparar leva menos de 2 ms, e o resultado é exato. A tabela nova nasceu sem índice de vetor, só com um índice comum por agente e loja.

## Padrão é o que o compilador cobra

Sobrava decidir como fazer isso valer pros agentes que ainda não tinham memória, e pros que nem existiam. A primeira ideia foi cada líder decidir o seu. O pedido que veio foi mais simples: se está no kit, é padrão em todos.

Um combinado desses dura até o próximo agente ser criado com pressa. Então a regra foi pro tipo:

```ts
type AgentDefinition = {
  // ...
  memory: AgentMemory | { off: string };
};
```

O campo é obrigatório. Ou o agente diz o que vale guardar, ou escreve o motivo pra não guardar. Quem esquece não compila. Ligar a memória num agente virou uma lista curta, em português, do que guardar e do que nunca guardar. No Hugo, de logística, vale "quando chove o tempo de entrega dobra". Não vale motoboy cadastrado, porque isso ele já lê dos dados.

A regra entrou em 30/10. Em 01/11 chegou um agente novo de finanças, o Finn. Já veio com memória, no mesmo formato. Sem ela, ou sem um motivo escrito, ele nem compilaria. Esse foi o resultado que mais gostei da semana inteira.

## Então fui medir

Temos uma nota automática pra cada resposta dos agentes: ela resolveu o que o dono pediu? Comparei as respostas com alguma memória disponível contra as sem nenhuma, nos agentes do kit, sem o Anderson, que já tinha memória antes. A nota existe desde 02/11.

| Comparação | "Resolveu" | Respostas |
|---|---|---|
| Com memória disponível | 56,6% | 235 |
| Sem memória | 62,0% | 987 |
| Mesma loja, antes da primeira memória | 59,6% | 94 |
| Mesma loja, depois | 55,3% | 141 |

Nenhuma melhora. Isso também não prova que piorou: as lojas com memória são as mais engajadas, que pedem coisas mais difíceis, e a comparação na mesma loja tem só 29 pares de loja e agente. O que eu posso afirmar é pouco: o efeito, se existe, não apareceu em uma semana.

Sobre o dono, sei menos ainda. A tela "O que eu lembro" está no app e no painel, e **não sei quantas pessoas abriram**. Não coloquei nenhum evento nela. Sei só que ninguém usou "esquecer" até agora. Lancei a tela sem medir a tela.

## O erro que quase foi pro post

Se a média não mostra, pensei, pelo menos mostro os bons exemplos. Procurei respostas que tocavam num fato lembrado. Das 235, 29 pareciam tocar. Li todas: em 15 o fato tinha sido usado de verdade. Separei 8 que pareciam depender da memória e já tinha o exemplo perfeito: o Fred recomendando "recompra, sem disparos de mensagens" a um dono que, em setembro, tinha pedido pra não fazer campanha por mensagem.

Antes de escrever, olhei a conversa inteira. Tinha 15 mensagens.

O modelo sempre recebe as últimas 30. O pedido de setembro estava ali, no histórico. O Fred acertaria sem memória nenhuma. Refiz o teste nos 8 casos, e nos 8 o fato estava nas últimas 30 mensagens. Eu estava dando à memória o crédito do histórico.

Sobrou uma resposta. Em agosto, um dono contou que os cupons de frete grátis estavam comendo a margem dele. No começo de novembro, perguntou como vender mais. O Fred respondeu:

> Como sua margem já está apertada com frete grátis, eu não começaria por outro cupom.

A conversa de agosto já estava fora das últimas 30 mensagens. Nada ali dizia isso. Essa é a resposta que eu consigo defender, e mesmo ela é inferência: o sistema não registra quais memórias entraram em cada resposta. Uma resposta, de uma loja.

Olhando agora, ela mostra pra que a memória serve. Sem ela, o Fred não tinha como saber da reclamação de três meses antes, e cupom era uma sugestão natural. Conversa curta não precisa de memória, porque o histórico já resolve. Memória só trabalha quando a conversa fica longa ou o tempo passa. E uma semana depois de ligar é o pior momento pra enxergar isso.

## O que eu faria diferente

- **Registrar o que entrou na resposta.** Sem saber quais memórias o modelo recebeu, todo exemplo é arqueologia.
- **Colocar o evento antes de lançar a tela.** É uma linha de código, e agora é uma pergunta sem resposta.
- **Comparar com o histórico, não com o nada.** A pergunta certa nunca foi "o agente usou o fato?". Foi "ele teria usado sem a memória?".
- **Planejar o teste junto com a feature.** Comparação depois do lançamento só mede quem são os clientes engajados. O próximo passo é o que o [Anderson já faz](/writing/o-sorteio-saiu-torto): ligar e desligar por loja, sorteado, com a regra de leitura escrita antes.

A memória está no ar nos dez agentes. Ainda não sei o quanto ela vale. Quando o teste rodar, volto aqui com o número, mesmo que ele seja zero.
