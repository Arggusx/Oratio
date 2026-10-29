// Trilhas: um caminho de ilhas, uma etapa em cada. A próxima ilha abre quando a atual é concluída;
// a sugestão é fazer uma por dia, para dar tempo de rezar e viver o que se aprendeu.
// "icon" escolhe o desenho que flutua sobre a ilha (ver components/TrailIsland.jsx).

export const trails = [
  {
    id: 'missa-7-dias',
    title: 'Conheça a Missa em 7 dias',
    short: 'Cada parte da Missa, do sinal da cruz ao envio.',
    icon: 'igreja',
    color: '#C8963E',
    intro: 'Uma etapa por dia para entender o que acontece em cada parte da Missa e participar com mais amor.',
    steps: [
      {
        title: 'Ritos iniciais',
        icon: 'igreja',
        text: 'A Missa começa com o sinal da cruz e a saudação do padre. No ato penitencial, reconhecemos nossos pecados para nos aproximar de Deus com o coração limpo. Depois vem o Glória (fora do Advento e da Quaresma) e a oração do dia.',
        today: 'Na próxima Missa, chegue alguns minutos antes e reze em silêncio pelas suas intenções.',
      },
      {
        title: 'Liturgia da Palavra',
        icon: 'biblia',
        text: 'Deus fala ao seu povo. Aos domingos há uma leitura do Antigo Testamento, o salmo, uma leitura das cartas dos apóstolos e o Evangelho, que se ouve de pé, porque é o próprio Cristo quem fala.',
        today: 'Leia antes o Evangelho do próximo domingo, na aba Leituras.',
      },
      {
        title: 'Homilia e Creio',
        icon: 'pergaminho',
        text: 'Na homilia, o padre explica a Palavra e a liga à nossa vida. Em seguida, no Creio, toda a assembleia professa a fé da Igreja.',
        today: 'Reze o Creio devagar, pensando em cada frase.',
      },
      {
        title: 'Oração dos fiéis e ofertório',
        icon: 'ofertas',
        text: 'Apresentamos a Deus as necessidades da Igreja e do mundo. No ofertório, o pão e o vinho são levados ao altar, e com eles oferecemos nosso trabalho, nossas alegrias e dores.',
        today: 'Escolha algo da sua semana para oferecer na próxima Missa.',
      },
      {
        title: 'Oração Eucarística e consagração',
        icon: 'calice',
        text: 'É o coração da Missa. Pelas palavras de Jesus repetidas pelo padre e pela ação do Espírito Santo, o pão e o vinho se tornam o Corpo e o Sangue de Cristo. É o mesmo sacrifício da cruz, tornado presente.',
        today: 'Na consagração, olhe a hóstia e diga em silêncio: "Meu Senhor e meu Deus!"',
      },
      {
        title: 'Comunhão',
        icon: 'hostia',
        text: 'Depois do Pai-Nosso e do abraço da paz, recebemos Jesus. Para comungar, é preciso estar em estado de graça (sem pecado grave não confessado) e fazer uma hora de jejum.',
        today: 'Depois de comungar, reserve um minuto de silêncio para conversar com Jesus.',
      },
      {
        title: 'Envio',
        icon: 'pomba',
        text: 'A Missa termina com a bênção e o envio: "Ide em paz". A palavra Missa vem do latim missio, missão. Saímos para levar Cristo a quem encontramos.',
        today: 'Faça hoje um gesto concreto de caridade com alguém da sua casa ou do seu trabalho.',
      },
    ],
  },
  {
    id: 'dogmas-de-maria',
    title: 'Os 4 dogmas de Maria',
    short: 'Quatro verdades de fé sobre Nossa Senhora.',
    icon: 'lua',
    color: '#4F7BB5',
    intro: 'Quatro verdades de fé sobre Nossa Senhora, uma por dia, com a base bíblica e o que elas dizem sobre nós.',
    steps: [
      {
        title: 'Mãe de Deus',
        icon: 'estrela',
        text: 'Proclamado no Concílio de Éfeso (431). Maria é Mãe de Jesus, que é verdadeiro Deus e verdadeiro homem; por isso é Mãe de Deus. Isabel a chamou de "a mãe do meu Senhor" (Lc 1,43).',
        today: 'Reze uma Ave-Maria prestando atenção em "Santa Maria, Mãe de Deus".',
      },
      {
        title: 'Virgindade perpétua',
        icon: 'lirio',
        text: 'Maria permaneceu virgem antes, durante e depois do parto. Sua vida inteira foi dedicada a Deus. Os "irmãos de Jesus" citados nos Evangelhos eram parentes próximos, como era costume chamar na época.',
        today: 'Peça a Maria um coração inteiro para Deus.',
      },
      {
        title: 'Imaculada Conceição',
        icon: 'lua',
        text: 'Definido por Pio IX em 1854. Desde o primeiro instante da sua existência, Maria foi preservada do pecado original, pelos méritos de Cristo. O anjo a saudou como "cheia de graça" (Lc 1,28).',
        today: 'Reze: "Ó Maria concebida sem pecado, rogai por nós que recorremos a vós."',
      },
      {
        title: 'Assunção',
        icon: 'nuvens',
        text: 'Definido por Pio XII em 1950. Ao terminar a sua vida terrena, Maria foi levada ao céu de corpo e alma. Ela é sinal da esperança do que Deus prometeu a todos nós: a ressurreição.',
        today: 'Reze o 4º mistério glorioso do terço, a Assunção de Maria.',
      },
    ],
  },
  {
    id: 'sete-sacramentos',
    title: 'Os 7 sacramentos',
    short: 'Os sinais de Cristo que acompanham toda a vida.',
    icon: 'hostia',
    color: '#5E8C63',
    intro: 'Uma ilha para cada sacramento: o que é, de onde vem na Bíblia e como vivê-lo hoje.',
    steps: [
      {
        title: 'Batismo',
        icon: 'concha',
        text: 'É a porta da vida cristã. Pela água e pela palavra, o batizado é libertado do pecado original, torna-se filho de Deus e membro da Igreja. Jesus mandou: "Ide e batizai todas as nações" (Mt 28,19).',
        today: 'Descubra a data do seu batismo e agradeça a Deus por ela.',
      },
      {
        title: 'Crisma',
        icon: 'pomba',
        text: 'A Confirmação completa o Batismo: o crismado recebe a força do Espírito Santo para testemunhar a fé, como os apóstolos em Pentecostes (At 2). O bispo unge a testa com o óleo do crisma.',
        today: 'Reze o "Vinde, Espírito Santo" pedindo coragem para viver a fé.',
      },
      {
        title: 'Eucaristia',
        icon: 'hostia',
        text: 'É o próprio Jesus, presente no pão e no vinho consagrados. Instituída na Última Ceia ("Isto é o meu corpo", Lc 22,19), é o centro e o ápice da vida cristã.',
        today: 'Faça uma visita, mesmo breve, a Jesus no sacrário.',
      },
      {
        title: 'Confissão',
        icon: 'chaves',
        text: 'Na Reconciliação, Deus perdoa os pecados cometidos depois do Batismo. Jesus deu esse poder aos apóstolos: "A quem perdoardes os pecados, serão perdoados" (Jo 20,23).',
        today: 'Faça o exame de consciência na aba Confissão de Terço e Orações.',
      },
      {
        title: 'Unção dos Enfermos',
        icon: 'oleo',
        text: 'Dá conforto, paz e força a quem está gravemente doente ou idoso, e pode perdoar os pecados. São Tiago escreve: "Alguém está doente? Chame os presbíteros da Igreja" (Tg 5,14).',
        today: 'Reze por alguém doente que você conhece, ou faça uma visita a ele.',
      },
      {
        title: 'Ordem',
        icon: 'calice',
        text: 'Pela Ordem, bispos, padres e diáconos são consagrados para servir a Igreja em nome de Cristo, sobretudo pela Palavra e pelos sacramentos. Vem da missão dada aos apóstolos.',
        today: 'Reze pelo padre da sua paróquia e pelas vocações.',
      },
      {
        title: 'Matrimônio',
        icon: 'aneis',
        text: 'Homem e mulher se unem por toda a vida, sinal do amor de Cristo pela Igreja. Os próprios noivos são os ministros do sacramento, e o padre é a testemunha da Igreja. Jesus disse: "O que Deus uniu, o homem não separe" (Mt 19,6).',
        today: 'Reze por um casal da sua família ou por quem se prepara para casar.',
      },
    ],
  },
];

export const getTrail = (id) => trails.find((t) => t.id === id);
