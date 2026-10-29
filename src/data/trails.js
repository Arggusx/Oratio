// Trilhas: um caminho de ilhas, uma etapa em cada. A próxima ilha abre quando a atual é concluída;
// a sugestão é fazer uma por dia, para dar tempo de rezar e viver o que se aprendeu.
// "icon" escolhe o desenho que flutua sobre a ilha (ver components/TrailIsland.jsx).
// "quizTopic" liga a ilha ao banco de perguntas (data/quizBank.js): no caminho, entre as etapas, há paradas de
// quiz que ficam mais difíceis (fácil, médio, difícil e o desafio final). Ver trailStops abaixo.

export const trails = [
  {
    id: 'missa-7-dias',
    title: 'Conheça a Missa em 7 dias',
    short: 'Cada parte da Missa, do sinal da cruz ao envio.',
    icon: 'igreja',
    color: '#C8963E',
    quizTopic: 'missa',
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
    quizTopic: 'maria',
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
    quizTopic: 'fe',
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
  {
    id: 'biblia',
    title: 'Conheça a Bíblia',
    short: 'Como a Bíblia se organiza e como lê-la rezando.',
    icon: 'biblia',
    color: '#8C6A3F',
    quizTopic: 'biblia',
    intro: 'Quatro paradas para conhecer o livro mais lido do mundo e aprender a rezar com ele.',
    steps: [
      {
        title: 'O que é a Bíblia',
        icon: 'biblia',
        text: 'A Bíblia é a Palavra de Deus escrita por autores humanos inspirados pelo Espírito Santo. Não é um livro só, mas uma biblioteca de 73 livros escritos ao longo de mais de mil anos, que contam a história do amor de Deus pela humanidade.',
        today: 'Escolha um lugar da sua casa para deixar a Bíblia à vista.',
      },
      {
        title: 'Antigo Testamento',
        icon: 'pergaminho',
        text: 'São 46 livros: o Pentateuco (os cinco primeiros, com a Lei), os livros históricos, os sapienciais (como Salmos e Provérbios) e os proféticos. Eles contam a aliança de Deus com Israel e preparam a vinda do Messias.',
        today: 'Leia o Salmo 23 (22), "O Senhor é o meu pastor".',
      },
      {
        title: 'Novo Testamento',
        icon: 'estrela',
        text: 'São 27 livros: os quatro Evangelhos, os Atos dos Apóstolos, as cartas e o Apocalipse. No centro está Jesus Cristo, em quem as promessas do Antigo Testamento se cumprem.',
        today: 'Leia o Evangelho do dia na aba Leituras.',
      },
      {
        title: 'Ler rezando',
        icon: 'lirio',
        text: 'A leitura orante (lectio divina) tem quatro passos: ler devagar, meditar o que o texto diz para você, rezar respondendo a Deus e contemplar em silêncio. A Bíblia é lida na Igreja, à luz da Tradição.',
        today: 'Faça os quatro passos com o Evangelho de amanhã.',
      },
    ],
  },
  {
    id: 'santos',
    title: 'Amigos de Deus: os santos',
    short: 'Quem são os santos e por que pedimos a ajuda deles.',
    icon: 'lirio',
    color: '#7A5A9E',
    quizTopic: 'santos',
    intro: 'Quatro paradas para entender a santidade e a amizade com os santos.',
    steps: [
      {
        title: 'O que é um santo',
        icon: 'estrela',
        text: 'Santo é quem vive unido a Deus e agora está com Ele no céu. Todos são chamados à santidade, no trabalho, na família e nos estudos. Os santos canonizados são os que a Igreja apresenta como exemplo e intercessores.',
        today: 'Pense numa virtude de alguém que você admira e peça a Deus essa graça.',
      },
      {
        title: 'Como alguém se torna santo',
        icon: 'pergaminho',
        text: 'O processo tem etapas: Servo de Deus, quando a causa é aberta; Venerável, quando se reconhecem as virtudes heroicas; Beato, após um milagre reconhecido; e Santo, após outro milagre. É um caminho longo e cuidadoso.',
        today: 'Conheça na Escola da Fé a história de um santo que você não conhecia.',
      },
      {
        title: 'A comunhão dos santos',
        icon: 'pomba',
        text: 'No Creio rezamos: "creio na comunhão dos santos". A Igreja do céu e a da terra estão unidas. Pedir a intercessão de um santo é como pedir a um amigo que reze por você; quem atende é sempre Deus.',
        today: 'Peça a intercessão do santo do seu nome ou do padroeiro da sua paróquia.',
      },
      {
        title: 'Santos de hoje',
        icon: 'lirio',
        text: 'A santidade não ficou no passado. Santa Dulce dos Pobres cuidou dos doentes na Bahia; São Carlo Acutis usou a internet para falar da Eucaristia; São Pier Giorgio Frassati servia os pobres em segredo. Gente comum, com um amor fora do comum.',
        today: 'Faça um gesto escondido de caridade, sem contar a ninguém.',
      },
    ],
  },
  {
    id: 'simbolos',
    title: 'Os sinais da fé',
    short: 'O sentido dos símbolos e gestos cristãos.',
    icon: 'pomba',
    color: '#3F8C8A',
    quizTopic: 'simbolos',
    intro: 'Quatro paradas para entender os sinais que a Igreja usa desde os primeiros cristãos.',
    steps: [
      {
        title: 'Por que símbolos?',
        icon: 'estrela',
        text: 'Somos corpo e alma, e Deus fala conosco também por sinais: água, pão, luz, gestos. Na liturgia, os símbolos não são enfeites; eles mostram e, nos sacramentos, realizam o que significam.',
        today: 'Na próxima Missa, repare em três sinais que você costuma ignorar.',
      },
      {
        title: 'A cruz',
        icon: 'igreja',
        text: 'A cruz, de instrumento de morte, virou sinal do amor maior. O crucifixo mostra Cristo que se entrega; o sinal da cruz é uma pequena oração que professa a Trindade e a redenção.',
        today: 'Faça o sinal da cruz devagar, pensando em cada palavra.',
      },
      {
        title: 'Água, óleo e luz',
        icon: 'oleo',
        text: 'A água lembra o Batismo; o óleo, a força do Espírito na Crisma e na Unção; a luz do Círio Pascal, Cristo ressuscitado. São sacramentais e sinais que acompanham toda a vida cristã.',
        today: 'Use água benta ao entrar na igreja ou em casa, lembrando o seu Batismo.',
      },
      {
        title: 'Os sinais dos primeiros cristãos',
        icon: 'concha',
        text: 'Nas catacumbas, os cristãos perseguidos desenhavam o peixe (Ichthys), a âncora da esperança, o Bom Pastor e o Chi-Rho. Eram sinais discretos para reconhecer os irmãos de fé.',
        today: 'Veja a aba Símbolos da Escola da Fé e escolha um para lembrar hoje.',
      },
    ],
  },
];

export const getTrail = (id) => trails.find((t) => t.id === id);

/** Nível de quiz que entra depois de qual etapa: divide as etapas em três partes e fecha com o desafio final. */
export function trailStops(trail) {
  const n = trail.steps.length;
  const cuts = [Math.ceil(n / 3), Math.ceil((2 * n) / 3), n];
  const stops = [];
  trail.steps.forEach((step, i) => {
    stops.push({ kind: 'lesson', index: i, day: i + 1, step });
    cuts.forEach((cut, level) => {
      if (cut === i + 1) stops.push({ kind: 'quiz', level: level + 1 });
    });
  });
  stops.push({ kind: 'quiz', level: 4 });
  return stops;
}
