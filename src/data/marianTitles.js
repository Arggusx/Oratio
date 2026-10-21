/* ============================================================
   "Uma só Maria, muitos títulos" — títulos de Nossa Senhora.

   type:
     'dogma'    → verdade de fé definida pela Igreja
     'aparicao' → aparição reconhecida pela Igreja
     'devocao'  → título nascido da devoção do povo ou de um momento da vida de Maria
   feast: data da celebração (texto livre, porque algumas são móveis).
   ============================================================ */

export const MARIAN_TYPES = {
  dogma: 'Verdade de fé',
  aparicao: 'Aparição',
  devocao: 'Devoção',
};

export const marianTitles = [
  // ── Verdades de fé (dogmas) e a realeza de Maria, que decorre delas ──
  {
    id: 'mae-de-deus',
    title: 'Santa Maria, Mãe de Deus',
    type: 'dogma',
    feast: '1º de janeiro',
    origin: 'Concílio de Éfeso, 431',
    text: 'É o título mais antigo e importante. Como Jesus é verdadeiro Deus e verdadeiro homem numa só pessoa, Maria, que o gerou, é Mãe de Deus (em grego, “Theotokos”). O título não diz que ela existia antes de Deus, mas que o Filho nascido dela é Deus.',
  },
  {
    id: 'sempre-virgem',
    title: 'Sempre Virgem Maria',
    type: 'dogma',
    origin: 'Fé professada desde os primeiros séculos',
    text: 'A Igreja crê que Maria concebeu Jesus por obra do Espírito Santo e permaneceu virgem antes, durante e depois do parto. Por isso a liturgia a chama de “sempre Virgem”, expressão presente em orações muito antigas.',
  },
  {
    id: 'imaculada-conceicao',
    title: 'Imaculada Conceição',
    type: 'dogma',
    feast: '8 de dezembro',
    origin: 'Papa Pio IX, 1854',
    text: 'Maria foi preservada do pecado original desde o primeiro instante de sua existência, no ventre de sua mãe, Sant’Ana, em vista dos méritos de Jesus. Atenção: o título fala da concepção de Maria, e não da concepção virginal de Jesus. Nossa Senhora da Conceição e Nossa Senhora Aparecida são representações desse mistério.',
  },
  {
    id: 'assuncao',
    title: 'Nossa Senhora da Assunção',
    type: 'dogma',
    feast: '15 de agosto (no Brasil, no domingo seguinte)',
    origin: 'Papa Pio XII, 1950',
    text: 'Ao fim de sua vida terrena, Maria foi elevada de corpo e alma à glória do Céu. É a primeira a participar plenamente da Ressurreição de Jesus, sinal do que Deus prepara para todos os que o seguem.',
  },
  {
    id: 'rainha',
    title: 'Nossa Senhora Rainha',
    type: 'devocao',
    feast: '22 de agosto',
    origin: 'Festa instituída por Pio XII, 1954',
    text: 'Como Mãe do Rei, Jesus, Maria é honrada como Rainha do Céu e da terra. É o quinto mistério glorioso do terço, a Coroação de Maria, e é por isso que tantas imagens a mostram com coroa.',
  },

  // ── Aparições reconhecidas ──
  {
    id: 'guadalupe',
    title: 'Nossa Senhora de Guadalupe',
    type: 'aparicao',
    feast: '12 de dezembro',
    origin: 'México, 1531',
    text: 'Apareceu ao indígena São Juan Diego numa colina perto da Cidade do México. Como sinal para o bispo, sua imagem ficou estampada no manto (tilma) de Juan Diego, guardado até hoje na Basílica de Guadalupe. Aparece com traços mestiços, grávida, e é a padroeira das Américas.',
  },
  {
    id: 'gracas',
    title: 'Nossa Senhora das Graças',
    type: 'aparicao',
    feast: '27 de novembro',
    origin: 'Paris, França, 1830',
    text: 'Apareceu à religiosa Santa Catarina Labouré e pediu que fosse cunhada uma medalha com a oração “Ó Maria concebida sem pecado, rogai por nós que recorremos a vós”. Pelas graças alcançadas, ela ficou conhecida como Medalha Milagrosa. Os raios que saem das mãos de Maria representam as graças que ela distribui.',
  },
  {
    id: 'la-salette',
    title: 'Nossa Senhora de La Salette',
    type: 'aparicao',
    feast: '19 de setembro',
    origin: 'Alpes franceses, 1846',
    text: 'Apareceu chorando a duas crianças pastoras, Maximino e Melânia, nas montanhas de La Salette. Pediu conversão, oração e respeito ao domingo e ao nome de Deus. É lembrada como a Senhora que chora pelos pecados do mundo.',
  },
  {
    id: 'lourdes',
    title: 'Nossa Senhora de Lourdes',
    type: 'aparicao',
    feast: '11 de fevereiro',
    origin: 'Lourdes, França, 1858',
    text: 'Apareceu 18 vezes à jovem Santa Bernadete na gruta de Massabielle. Quando Bernadete perguntou seu nome, ela respondeu: “Eu sou a Imaculada Conceição”, quatro anos depois de o dogma ser proclamado. Da gruta brotou uma fonte, e milhões de doentes peregrinam até lá. Seu dia é o Dia Mundial do Enfermo.',
  },
  {
    id: 'fatima',
    title: 'Nossa Senhora de Fátima',
    type: 'aparicao',
    feast: '13 de maio',
    origin: 'Fátima, Portugal, 1917',
    text: 'Apareceu seis vezes aos pastorinhos Lúcia, Francisco e Jacinta, pedindo oração, penitência e o terço diário pela paz no mundo. Na última aparição, em 13 de outubro, milhares de pessoas testemunharam o “milagre do sol”. Francisco e Jacinta foram canonizados em 2017.',
  },

  // ── Devoções ──
  {
    id: 'aparecida',
    title: 'Nossa Senhora da Conceição Aparecida',
    type: 'devocao',
    feast: '12 de outubro',
    origin: 'Rio Paraíba do Sul (SP), 1717',
    text: 'Três pescadores lançaram a rede e encontraram uma pequena imagem de Nossa Senhora da Conceição, primeiro o corpo e depois a cabeça; em seguida, a pesca foi abundante. A imagem escureceu com o tempo e é a padroeira do Brasil desde 1930. Seu santuário é um dos maiores santuários marianos do mundo.',
  },
  {
    id: 'nazare',
    title: 'Nossa Senhora de Nazaré',
    type: 'devocao',
    feast: 'Círio: 2º domingo de outubro',
    origin: 'Belém (PA), por volta de 1700',
    text: 'Segundo a tradição, a imagem foi encontrada por um caboclo chamado Plácido à beira de um igarapé, em Belém. Em sua honra acontece o Círio de Nazaré, uma das maiores procissões católicas do mundo, que reúne milhões de pessoas todos os anos.',
  },
  {
    id: 'carmo',
    title: 'Nossa Senhora do Carmo',
    type: 'devocao',
    feast: '16 de julho',
    origin: 'Monte Carmelo e Ordem Carmelita',
    text: 'O título vem do Monte Carmelo, na Terra Santa, onde viveram os primeiros eremitas carmelitas. Segundo a tradição, Nossa Senhora entregou o escapulário a São Simão Stock, em 1251, como sinal de sua proteção para quem o usa com fé.',
  },
  {
    id: 'rosario',
    title: 'Nossa Senhora do Rosário',
    type: 'devocao',
    feast: '7 de outubro',
    origin: 'Papa São Pio V, 1571',
    text: 'Lembra Maria como aquela que nos ensina a contemplar a vida de Jesus no terço. A festa foi criada depois da batalha de Lepanto, em 7 de outubro de 1571, cuja vitória foi atribuída à oração do Rosário em toda a cristandade.',
  },
  {
    id: 'navegantes',
    title: 'Nossa Senhora dos Navegantes',
    type: 'devocao',
    feast: '2 de fevereiro',
    origin: 'Devoção de pescadores e marinheiros',
    text: 'Protetora de quem vive do mar e dos rios. No Brasil, sua festa é marcada por procissões de barcos, como a de Porto Alegre, e coincide com a festa da Apresentação do Senhor, também chamada de Nossa Senhora das Candeias.',
  },
  {
    id: 'dores',
    title: 'Nossa Senhora das Dores',
    type: 'devocao',
    feast: '15 de setembro',
    origin: 'Celebrada no dia seguinte à Exaltação da Santa Cruz',
    text: 'Contempla Maria ao pé da cruz e as sete dores de sua vida, da profecia de Simeão ao sepultamento de Jesus. Por isso costuma ser representada com o coração atravessado por sete espadas.',
  },
  {
    id: 'auxiliadora',
    title: 'Nossa Senhora Auxiliadora',
    type: 'devocao',
    feast: '24 de maio',
    origin: 'Papa Pio VII, 1815',
    text: 'Invoca Maria como “auxílio dos cristãos”. O Papa Pio VII instituiu a festa depois de voltar a Roma, libertado da prisão imposta por Napoleão. Foi muito difundida por São João Bosco e pelos salesianos.',
  },
  {
    id: 'perpetuo-socorro',
    title: 'Nossa Senhora do Perpétuo Socorro',
    type: 'devocao',
    feast: '27 de junho',
    origin: 'Ícone bizantino venerado em Roma',
    text: 'Vem de um antigo ícone em que o Menino Jesus se assusta ao ver os anjos com os instrumentos da Paixão e corre para os braços da Mãe, deixando cair uma sandália. Em 1866, o Papa Pio IX confiou o ícone aos missionários redentoristas, que espalharam a devoção pelo mundo.',
  },
  {
    id: 'desatadora',
    title: 'Nossa Senhora Desatadora dos Nós',
    type: 'devocao',
    origin: 'Augsburgo, Alemanha, por volta de 1700',
    text: 'Nasce de uma pintura que mostra Maria desatando os nós de uma fita, imagem dos problemas e pecados que nos prendem. A devoção chegou à América do Sul pelas mãos do então padre Jorge Mario Bergoglio, futuro Papa Francisco, e é muito popular no Brasil.',
  },
];
