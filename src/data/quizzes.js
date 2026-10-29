// Quiz curto no fim de cada aba da Escola da Fé. A explicação aparece depois da resposta,
// acertando ou não: o objetivo é aprender, não pontuar.

export const quizzes = {
  curiosidades: [
    {
      q: 'Quantos são os sacramentos da Igreja?',
      options: ['Cinco', 'Sete', 'Dez'],
      answer: 1,
      why: 'São sete: Batismo, Crisma, Eucaristia, Confissão, Unção dos Enfermos, Ordem e Matrimônio. Eles acompanham toda a vida do cristão, do nascimento à morte.',
    },
    {
      q: 'Os católicos adoram imagens de santos?',
      options: ['Sim, como a Deus', 'Não, elas são veneradas, não adoradas', 'Só as de Nossa Senhora'],
      answer: 1,
      why: 'A adoração (latria) é só para Deus. Os santos recebem veneração (dulia), e as imagens são lembranças que ajudam a rezar, como fotos de família.',
    },
    {
      q: 'Quantos livros tem a Bíblia católica?',
      options: ['66', '73', '80'],
      answer: 1,
      why: 'São 73: 46 no Antigo Testamento e 27 no Novo. A Bíblia protestante tem 66 porque não inclui sete livros, como Tobias, Judite e os dois livros dos Macabeus.',
    },
    {
      q: 'Quem foi o primeiro Papa?',
      options: ['São Paulo', 'São Pedro', 'São João'],
      answer: 1,
      why: 'Jesus disse a Pedro: "Tu és Pedro, e sobre esta pedra edificarei a minha Igreja" (Mt 16,18). Os papas são os sucessores de Pedro.',
    },
  ],
  missa: [
    {
      q: 'Diante de quem se faz a genuflexão (dobrar o joelho direito até o chão)?',
      options: ['Do altar', 'Do Santíssimo Sacramento no sacrário', 'Do padre'],
      answer: 1,
      why: 'A genuflexão é sinal de adoração a Jesus presente na Eucaristia. Por isso é feita diante do sacrário e na consagração. Diante do altar, faz-se uma inclinação profunda.',
    },
    {
      q: 'Qual é a cor litúrgica do Tempo Comum?',
      options: ['Verde', 'Roxo', 'Branco'],
      answer: 0,
      why: 'O verde lembra a esperança e o crescimento. O roxo é usado no Advento e na Quaresma; o branco, no Natal e na Páscoa.',
    },
    {
      q: 'Em que momento o pão e o vinho se tornam o Corpo e o Sangue de Cristo?',
      options: ['No ofertório', 'Na consagração', 'Na comunhão'],
      answer: 1,
      why: 'Na consagração, quando o padre repete as palavras de Jesus na Última Ceia. Por isso é o momento mais solene da Missa, em que muitos se ajoelham.',
    },
    {
      q: 'Quanto tempo de jejum a Igreja pede antes de comungar?',
      options: ['Uma hora', 'Três horas', 'Desde a meia-noite'],
      answer: 0,
      why: 'Uma hora sem comer nem beber, exceto água e remédios. Idosos e doentes estão dispensados.',
    },
  ],
  simbolos: [
    {
      q: 'O que o peixe (Ichthys) significava para os primeiros cristãos?',
      options: [
        'A pesca milagrosa',
        'As iniciais, em grego, de "Jesus Cristo, Filho de Deus, Salvador"',
        'O batismo no rio Jordão',
      ],
      answer: 1,
      why: 'Ichthys quer dizer peixe em grego, e cada letra é a inicial de uma palavra da frase "Jesus Cristo, Filho de Deus, Salvador". Era um sinal discreto de fé em tempos de perseguição.',
    },
    {
      q: 'O que querem dizer as letras Alfa e Ômega?',
      options: ['Pai e Filho', 'O princípio e o fim', 'Céu e terra'],
      answer: 1,
      why: 'São a primeira e a última letra do alfabeto grego. Jesus diz: "Eu sou o Alfa e o Ômega, o princípio e o fim" (Ap 22,13).',
    },
    {
      q: 'O que significa o monograma IHS?',
      options: ['As primeiras letras do nome de Jesus em grego', 'Igreja, Hóstia e Santos', 'Uma ordem religiosa'],
      answer: 0,
      why: 'IHS vem das primeiras letras do nome de Jesus em grego (ΙΗΣΟΥΣ). Mais tarde também foi lido como "Iesus Hominum Salvator", Jesus Salvador dos homens.',
    },
    {
      q: 'Na arte cristã, a pomba representa quem?',
      options: ['Nossa Senhora', 'O Espírito Santo', 'Os anjos'],
      answer: 1,
      why: 'No batismo de Jesus, o Espírito Santo desceu "como uma pomba" (Mt 3,16). Por isso a pomba é o símbolo do Espírito Santo.',
    },
  ],
  santos: [
    {
      q: 'Qual santo é invocado para encontrar objetos perdidos?',
      options: ['São Bento', 'Santo Antônio', 'São Francisco'],
      answer: 1,
      why: 'Conta-se que um noviço levou o livro de salmos de Santo Antônio e o devolveu depois que o santo rezou. Desde então ele é invocado para reencontrar o que se perdeu.',
    },
    {
      q: 'Quem organizou uma exposição sobre os milagres eucarísticos do mundo?',
      options: ['São João Paulo II', 'São Carlo Acutis', 'Santa Teresinha'],
      answer: 1,
      why: 'Ainda adolescente, Carlo Acutis pesquisou e montou uma exposição sobre os milagres eucarísticos, que já percorreu os cinco continentes. Ele foi canonizado em 2025.',
    },
    {
      q: 'Quem encontrou a imagem de Nossa Senhora Aparecida?',
      options: ['Três pescadores', 'Um padre missionário', 'Uma criança'],
      answer: 0,
      why: 'Em 1717, os pescadores Domingos, Filipe e João acharam a imagem no rio Paraíba do Sul. Depois disso, as redes se encheram de peixes.',
    },
    {
      q: 'O que a Igreja declara quando canoniza alguém?',
      options: [
        'Que a pessoa fez muitos milagres em vida',
        'Que a pessoa está no céu e pode ser venerada em toda a Igreja',
        'Que a pessoa foi um bom religioso',
      ],
      answer: 1,
      why: 'A canonização declara que a pessoa viveu as virtudes de modo heroico e está junto de Deus. Ela pode então ser invocada e celebrada por toda a Igreja.',
    },
  ],
};
