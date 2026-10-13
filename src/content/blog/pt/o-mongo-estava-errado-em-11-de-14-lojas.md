---
title: "O Mongo estava errado em 11 de 14 lojas"
description: "O faturamento de 30 dias que decide quem entra no tráfego pago vinha de um espelho que perdia pedidos. Troquei a fonte sem fallback, a query nova custou ~100 ms por chamada no Postgres, e um índice do formato certo levou isso para ~3 ms."
date: 2026-10-15
lang: "pt"
category: "engenharia"
draft: true
tags: ["Engenharia", "Postgres", "Mongo", "Performance", "Banco de dados", "Lições"]
translationOf: "en/mongo-was-wrong-in-11-of-14-stores"
---

No produto de tráfego pago da Brendi, um número decide muita coisa: **quanto a
loja faturou nos últimos 30 dias**, contando só pedidos entregues e deixando de
fora os que vieram de marketplaces externos.

É desse número que sai se a loja pode ativar o tráfego pago (existe um piso de
faturamento), o ticket médio que o nosso agente de tráfego usa para escolher
estratégia, e o valor de "retorno" que o lojista vê no painel. Três leitores, uma
conta.

E essa conta era feita no Mongo.

## O ponto de partida

Na Brendi, a fonte da verdade dos pedidos é o Firestore. O Mongo e o Postgres
são **espelhos** dele: cada pedido escrito no Firestore é copiado para os dois.
A leitura de faturamento de 30 dias era a última leitura de produção que ainda
dependia do espelho no Mongo. Tirá-la de lá era o que faltava para desligar o
Mongo nesse uso.

Antes de trocar, eu queria saber se os dois espelhos davam o mesmo número.
Peguei 14 lojas (algumas pequenas, várias das mais movimentadas, todas com
tráfego pago) e calculei o faturamento de 30 dias dos dois lados, com os mesmos
filtros: o Postgres direto na réplica de leitura, o Mongo pela mesma rota que a
produção usava.

O Mongo estava errado em **11 das 14**.

- **3 lojas pequenas:** bateu centavo por centavo.
- **10 lojas grandes:** a leitura do Mongo trazia no máximo **2.000 pedidos**, e
  esse corte acontecia **antes** do filtro de marketplaces. Uma loja com 8 mil
  pedidos no período tinha, depois do filtro, pouco mais de 1.300 contados. O
  faturamento aparecia **até 4 vezes menor** que o real.
- **1 loja:** o Postgres tinha 4 pedidos a mais. Fui conferir no Firestore: os 4
  existiam, entregues, com os valores exatos do Postgres. O Mongo tinha
  simplesmente perdido essas escritas.

Em todo caso que deu para verificar, o Postgres bateu com o Firestore. Na
frota, o corte de 2.000 afetava 28 lojas ativas no tráfego pago: lojas grandes,
vendo um faturamento e um ticket menores do que tinham de verdade.

O spot-check que era para ser só uma conferência antes da migração virou o
argumento da migração.

## A troca, sem fallback

A primeira versão da mudança tinha o desenho "seguro" de sempre: ler do
Postgres atrás de um toggle, com fallback para o Mongo se algo desse errado, e
comparar as duas fontes durante o rollout.

Depois do spot-check, isso deixou de fazer sentido. **Um fallback para uma fonte
que você sabe que está errada não é rede de segurança: é um caminho para
continuar servindo o número errado.** E a comparação durante o rollout ia
acusar divergência exatamente nas lojas em que o Postgres estava mais certo.

Então em 26/08 foi um corte seco:

- os três leitores passaram a usar uma única função, que faz uma agregação no
  espelho de pedidos do Postgres, na réplica de leitura;
- o filtro de marketplaces saiu do JavaScript e foi para o `WHERE`, com a mesma
  semântica, e sem teto de linhas;
- se a query falhar, o erro sobe. Nada de devolver zero em silêncio: um zero
  fecharia o acesso da loja ao tráfego pago.

O efeito no merge foi só numa direção: as lojas que estavam capadas passaram a
ver o faturamento e o ticket corretos, que eram maiores. Nenhuma loja perdeu
acesso. E, como essa era a última leitura de produção daquele espelho no Mongo,
o desligamento dele nesse uso ficou destravado no mesmo dia.

## O efeito colateral

Trocar a fonte não é de graça: o custo da query muda de lugar.

No dia seguinte, a agregação nova aparecia no Query Insights da réplica de
leitura custando **80 a 108 ms por chamada**, e somando **~313 segundos de banco
por dia** (27/08). Na semana de 02 a 08/09, ficou entre **186 e 261 s/dia**.
Três a cinco minutos de banco por dia, para responder uma pergunta que, por
loja, envolve algumas centenas de pedidos.

O motivo estava no plano. O espelho de pedidos tinha um índice por loja e um
índice por data, mas nenhum que cobrisse "pedidos desta loja, neste status,
nesta janela de datas". O planner usava o índice da loja e filtrava o resto na
tabela. Ou seja: para cada loja, lia **a vida inteira dela** para ficar com os
últimos 30 dias.

Medindo na réplica, antes do índice: uma loja mediana lia ~1.200 linhas para
ficar com ~230; a mais movimentada lia ~58 mil para ficar com ~2.900. O
trabalho crescia com a idade da loja, não com o tamanho da resposta.

## O índice certo

A correção teve duas partes, que foram para produção no mesmo dia (09/09).

**Um índice composto no formato da pergunta**, em (loja, status, data do
pedido), parcial nos pedidos não apagados. Com ele, o plano vira um index scan
em que loja, status e as duas pontas da janela estão todos na condição do
índice. Só o filtro de marketplaces sobra para checar linha a linha, e só nas
linhas que já são da resposta.

**Uma leitura de 30 dias compartilhada.** Dos três leitores, só um usava cache.
Os outros dois iam direto ao banco a cada chamada. Passei os três a ler da
mesma entrada de cache, de 30 minutos. Isso também fechou uma inconsistência: o
painel mostrava o faturamento fresco, o fluxo de cobrança decidia com o valor
em cache, e uma loja que tinha acabado de cruzar o piso podia aparecer como
elegível e ser recusada na hora de pagar.

Os números de produção, do Query Insights, no pool de leitura:

| | antes | depois |
|---|---|---|
| tempo por chamada | 80–108 ms | 2,8–3,4 ms (−97%) |
| tempo de banco por dia | 186–261 s | 3–9 s |
| chamadas por dia (quinta) | 2.469 | 2.484 |

A última linha é a que importa para ser honesto sobre a causa. O número de
chamadas por dia ficou praticamente igual: numa quinta, 2.469 antes e 2.484
depois. Então a queda de tempo é do **índice**. O efeito do cache compartilhado
é inconclusivo: na quinta, as chamadas ficaram estáveis; numa quarta, caíram
48%. Não dá para dizer, com esses dados, que o cache reduziu a carga de forma
consistente. Ele resolveu a inconsistência entre painel e cobrança, e isso já
justificava a mudança.

A partir de 01/10, a query ficou barata demais para aparecer na lista das mais
caras do Query Insights, que só guarda as top do dia. O que é o melhor
resultado que uma query de banco pode ter.

O índice tem custo, e ele foi aceito conscientemente: até então nenhum índice
dessa tabela cobria o status, então a mudança de status de um pedido (pendente,
confirmado, entregue) era uma atualização "no lugar", sem tocar índice nenhum.
Com o status indexado, toda mudança de status passa a escrever em todos os
índices da tabela. O ganho de leitura é grande e medido; o custo de escrita é
algo a acompanhar, e eu não tenho um número isolado dele para mostrar aqui.

## O movimento maior

Essa troca é um pedaço de uma mudança maior: o módulo de tráfego pago está indo
para uma fonte de verdade relacional. Os dados de loja que ele usa também
passaram a ser lidos do Postgres, em vez do Firestore. Para essa parte eu não
tenho um antes e depois medido em produção, então fica só o registro.

O passo seguinte, ainda não feito, é um banco próprio para o domínio de
aquisição. Esse é outro post.

## O que fica

- **Migrar é trocar a fonte e depois pagar a conta no destino.** A query que
  era "do Mongo" virou uma query do Postgres, com o custo dela. Dimensionar
  isso faz parte da migração, não é um detalhe para depois.
- **Confira o número na fonte que você está deixando.** O spot-check que era só
  uma formalidade mostrou que a fonte antiga estava errada, e mudou o desenho
  da troca.
- **Fallback para uma fonte errada mantém o erro vivo.** Fallback só é seguro
  quando o plano B dá a resposta certa.
- **O índice tem que ter o formato da pergunta.** Ter índice na coluna da loja
  não basta se a pergunta é "loja, status, janela". O plano mostra quanto se lê
  para responder.
- **Prove o ganho com número de produção, e separe as causas.** Duas mudanças
  no mesmo dia; as chamadas por dia ficarem iguais é o que diz qual das duas
  fez o trabalho.

## Por baixo do capô

Para quem quer entender por que esse índice composto, nessa ordem, resolve uma
query como esta:

```sql
SELECT sum(total), count(*)
FROM orders
WHERE store_id = $1
  AND status = $2
  AND occurred_at >= now() - interval '30 days';
```

**Um índice B-tree composto é uma lista ordenada por várias colunas**, como uma
lista telefônica ordenada por sobrenome, depois nome. Com (loja, status, data),
as entradas ficam agrupadas por loja; dentro da loja, por status; dentro do
status, por data.

**Igualdades primeiro, intervalo por último.** A query fixa a loja e o status
com `=` e pede um intervalo de datas. Com o índice nessa ordem, o Postgres
desce a árvore direto até "esta loja, este status, a primeira data da janela" e
lê as entradas em sequência até sair da janela. Tudo o que ele lê é resposta.
Se a data viesse antes do status, as entradas da janela estariam misturadas
entre status diferentes, e parte do que ele lê seria descartada.

**Por que não um índice parcial em `status = 'delivered'`?** Foi a primeira
ideia, e não funcionou. A aplicação passa o status como parâmetro (`$2`), e num
plano genérico o Postgres não consegue provar que `$2` sempre vale
`'delivered'`, então ignora o índice parcial. Num teste em tabela sintética com
3,67 milhões de linhas e distribuição parecida com a de produção, o índice
parcial em status deu 14,3 ms (o mesmo de não ter índice); o status como coluna
do índice, 0,775 ms. Já o "não apagado" é escrito como literal na query, então
esse pode ser o predicado parcial sem problema.

**Por que a idade da loja deixa de importar.** Sem o índice, o custo era
proporcional a todos os pedidos que a loja já teve. Com ele, é proporcional aos
pedidos entregues dos últimos 30 dias: o tamanho da resposta. A loja continua
vendendo, o histórico continua crescendo, e a query não fica mais lenta por
isso.
