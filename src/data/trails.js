// Trilhas: uma etapa curta por dia. A etapa seguinte abre no dia seguinte, para dar tempo de rezar e viver
// o que se aprendeu.

export const trails = [
  {
    id: 'missa-7-dias',
    title: 'Conheça a Missa em 7 dias',
    intro: 'Uma etapa por dia para entender o que acontece em cada parte da Missa e participar com mais amor.',
    steps: [
      {
        title: 'Ritos iniciais',
        text: 'A Missa começa com o sinal da cruz e a saudação do padre. No ato penitencial, reconhecemos nossos pecados para nos aproximar de Deus com o coração limpo. Depois vem o Glória (fora do Advento e da Quaresma) e a oração do dia.',
        today: 'Na próxima Missa, chegue alguns minutos antes e reze em silêncio pelas suas intenções.',
      },
      {
        title: 'Liturgia da Palavra',
        text: 'Deus fala ao seu povo. Aos domingos há uma leitura do Antigo Testamento, o salmo, uma leitura das cartas dos apóstolos e o Evangelho, que se ouve de pé, porque é o próprio Cristo quem fala.',
        today: 'Leia antes o Evangelho do próximo domingo, na aba Leituras.',
      },
      {
        title: 'Homilia e Creio',
        text: 'Na homilia, o padre explica a Palavra e a liga à nossa vida. Em seguida, no Creio, toda a assembleia professa a fé da Igreja.',
        today: 'Reze o Creio devagar, pensando em cada frase.',
      },
      {
        title: 'Oração dos fiéis e ofertório',
        text: 'Apresentamos a Deus as necessidades da Igreja e do mundo. No ofertório, o pão e o vinho são levados ao altar, e com eles oferecemos nosso trabalho, nossas alegrias e dores.',
        today: 'Escolha algo da sua semana para oferecer na próxima Missa.',
      },
      {
        title: 'Oração Eucarística e consagração',
        text: 'É o coração da Missa. Pelas palavras de Jesus repetidas pelo padre e pela ação do Espírito Santo, o pão e o vinho se tornam o Corpo e o Sangue de Cristo. É o mesmo sacrifício da cruz, tornado presente.',
        today: 'Na consagração, olhe a hóstia e diga em silêncio: "Meu Senhor e meu Deus!"',
      },
      {
        title: 'Comunhão',
        text: 'Depois do Pai-Nosso e do abraço da paz, recebemos Jesus. Para comungar, é preciso estar em estado de graça (sem pecado grave não confessado) e fazer uma hora de jejum.',
        today: 'Depois de comungar, reserve um minuto de silêncio para conversar com Jesus.',
      },
      {
        title: 'Envio',
        text: 'A Missa termina com a bênção e o envio: "Ide em paz". A palavra Missa vem do latim missio, missão. Saímos para levar Cristo a quem encontramos.',
        today: 'Faça hoje um gesto concreto de caridade com alguém da sua casa ou do seu trabalho.',
      },
    ],
  },
  {
    id: 'dogmas-de-maria',
    title: 'Os 4 dogmas de Maria',
    intro: 'Quatro verdades de fé sobre Nossa Senhora, uma por dia, com a base bíblica e o que elas dizem sobre nós.',
    steps: [
      {
        title: 'Mãe de Deus',
        text: 'Proclamado no Concílio de Éfeso (431). Maria é Mãe de Jesus, que é verdadeiro Deus e verdadeiro homem; por isso é Mãe de Deus. Isabel a chamou de "a mãe do meu Senhor" (Lc 1,43).',
        today: 'Reze uma Ave-Maria prestando atenção em "Santa Maria, Mãe de Deus".',
      },
      {
        title: 'Virgindade perpétua',
        text: 'Maria permaneceu virgem antes, durante e depois do parto. Sua vida inteira foi dedicada a Deus. Os "irmãos de Jesus" citados nos Evangelhos eram parentes próximos, como era costume chamar na época.',
        today: 'Peça a Maria um coração inteiro para Deus.',
      },
      {
        title: 'Imaculada Conceição',
        text: 'Definido por Pio IX em 1854. Desde o primeiro instante da sua existência, Maria foi preservada do pecado original, pelos méritos de Cristo. O anjo a saudou como "cheia de graça" (Lc 1,28).',
        today: 'Reze: "Ó Maria concebida sem pecado, rogai por nós que recorremos a vós."',
      },
      {
        title: 'Assunção',
        text: 'Definido por Pio XII em 1950. Ao terminar a sua vida terrena, Maria foi levada ao céu de corpo e alma. Ela é sinal da esperança do que Deus prometeu a todos nós: a ressurreição.',
        today: 'Reze o 4º mistério glorioso do terço, a Assunção de Maria.',
      },
    ],
  },
];

export const getTrail = (id) => trails.find((t) => t.id === id);
