// Quem é quem na Igreja: do Papa aos leigos, com a cor que cada um usa, como chamar e o que faz.
// "order" marca os três graus do sacramento da Ordem (bispo, padre e diácono); cardeal, arcebispo, monsenhor
// e cônego são títulos ou funções, não outros graus. "color" é a cor do solidéu ou da veste.

export const hierarchy = [
  {
    id: 'papa',
    title: 'Papa',
    color: '#F4EFE3',
    colorName: 'Branco',
    order: 'Bispo',
    what: 'É o bispo de Roma, sucessor de São Pedro e pastor de toda a Igreja. Confirma os irmãos na fé e cuida da unidade da Igreja no mundo inteiro.',
    address: 'Santo Padre · Sua Santidade',
    note: 'O atual é Leão XIV, eleito em 2025.',
  },
  {
    id: 'cardeal',
    title: 'Cardeais',
    color: '#B3261E',
    colorName: 'Vermelho',
    what: 'São os conselheiros mais próximos do Papa. Os que têm menos de 80 anos elegem o novo Papa no conclave. O vermelho lembra que estão prontos a servir a fé até o sangue.',
    address: 'Dom · Sua Eminência',
    note: 'Cardeal é um título dado pelo Papa, não um grau da Ordem: quase todos são bispos.',
  },
  {
    id: 'arcebispo',
    title: 'Arcebispos',
    color: '#8E3B8A',
    colorName: 'Violeta',
    order: 'Bispo',
    what: 'São bispos à frente de uma arquidiocese. O arcebispo metropolitano também coordena a província eclesiástica, que reúne as dioceses vizinhas.',
    address: 'Dom · Sua Excelência Reverendíssima',
  },
  {
    id: 'bispo',
    title: 'Bispos',
    color: '#8E3B8A',
    colorName: 'Violeta',
    order: 'Bispo',
    what: 'São os sucessores dos apóstolos e têm a plenitude do sacramento da Ordem. O bispo diocesano guia uma diocese: ensina, santifica e governa. Os bispos auxiliares ajudam nas dioceses grandes.',
    address: 'Dom · Sua Excelência Reverendíssima',
    note: 'Só o bispo pode ordenar padres e diáconos; normalmente é ele quem crisma.',
  },
  {
    id: 'padre',
    title: 'Padres',
    color: '#2B2724',
    colorName: 'Preto',
    order: 'Presbítero',
    what: 'São os colaboradores do bispo. Celebram a Missa, perdoam os pecados na Confissão, ungem os doentes e cuidam de uma comunidade. O pároco é o padre responsável por uma paróquia; o vigário paroquial o ajuda.',
    address: 'Padre · Reverendíssimo',
    note: 'Monsenhor e cônego são títulos de honra dados a alguns padres, não outro grau da Ordem.',
  },
  {
    id: 'diacono',
    title: 'Diáconos',
    color: '#C8963E',
    colorName: 'Estola atravessada',
    order: 'Diácono',
    what: 'São ordenados para o serviço: proclamam o Evangelho, pregam, batizam, assistem casamentos e cuidam da caridade. Não celebram a Missa nem ouvem confissões.',
    address: 'Diácono · Reverendo',
    note: 'O diácono transitório vai ser padre; o permanente continua diácono e pode ser casado.',
  },
  {
    id: 'religiosos',
    title: 'Religiosos e consagrados',
    color: '#6B4F3A',
    colorName: 'Hábito',
    what: 'Irmãs, freiras, frades e monges que fazem os votos de pobreza, castidade e obediência, vivendo em comunidade segundo o carisma de um fundador, como São Francisco ou São Bento.',
    address: 'Irmã · Frei · Madre',
    note: 'A vida consagrada não é um grau da Ordem: muitos frades e monges também são padres, e as irmãs não são.',
  },
  {
    id: 'leigos',
    title: 'Leigos',
    color: '#5E8C63',
    colorName: 'Todos os batizados',
    what: 'São todos os batizados que não receberam a Ordem: a imensa maioria da Igreja. São chamados à santidade na família, no trabalho e na sociedade, e servem como catequistas, leitores e ministros da Comunhão.',
    address: 'Irmão · Irmã',
    note: 'A hierarquia existe para servir o povo de Deus, não para estar acima dele.',
  },
];

// Como a Igreja se organiza, do mundo inteiro até a comunidade da esquina.
export const churchLevels = [
  { title: 'Igreja universal', who: 'o Papa, com todos os bispos' },
  { title: 'Província eclesiástica', who: 'o arcebispo metropolitano' },
  { title: 'Diocese ou arquidiocese', who: 'o bispo ou o arcebispo' },
  { title: 'Paróquia', who: 'o pároco' },
  { title: 'Comunidade ou capela', who: 'padres, diáconos e leigos' },
];

// A Igreja no Brasil.
export const brazilFacts = [
  { title: 'Núncio apostólico', text: 'O representante do Papa no Brasil, uma espécie de embaixador, que mora em Brasília.' },
  {
    title: 'CNBB',
    text: 'A Conferência Nacional dos Bispos do Brasil reúne todos os bispos do país. Foi fundada em 1952, por iniciativa de Dom Helder Câmara.',
  },
  {
    title: 'Primaz do Brasil',
    text: 'É o título do arcebispo de São Salvador da Bahia, porque Salvador foi a primeira diocese do país, criada em 1551.',
  },
  { title: 'Dioceses', text: 'O Brasil tem mais de 270 arquidioceses, dioceses e prelazias, e milhares de paróquias.' },
  { title: 'Padroeira', text: 'Nossa Senhora Aparecida. O Santuário Nacional, em Aparecida (SP), é o maior santuário mariano do mundo.' },
];
