/* ============================================================
   Milagres eucarísticos pelo mundo — inspirado na exposição
   montada por São Carlo Acutis (miracolieucaristici.org).

   recognition:
     'culto'  → culto/peregrinação aprovados pela Igreja há séculos
     'bispo'  → reconhecido pelo bispo do lugar (pronunciamento recente)
     'estudo' → investigado, sem pronunciamento formal
   year: ano usado para ordenar e filtrar por época.
   ============================================================ */

// Página de cada milagre na exposição de Carlo Acutis (em português), com fotos.
const EXHIBITION = 'https://www.miracolieucaristici.org/pr/Liste/';

export const RECOGNITION = {
  culto: 'Culto aprovado pela Igreja',
  bispo: 'Reconhecido pelo bispo local',
  estudo: 'Investigado, sem decisão formal',
};

export const ERAS = [
  { id: 'antigos', label: 'Até o ano 1300', test: (y) => y < 1300 },
  { id: 'medievais', label: '1300 a 1800', test: (y) => y >= 1300 && y < 1800 },
  { id: 'recentes', label: 'Desde 1800', test: (y) => y >= 1800 },
];

export const eucharisticMiracles = [
  {
    id: 'lanciano',
    name: 'A hóstia que se fez carne',
    link: EXHIBITION + 'scheda_b.html?nat=italia&wh=lanciano',
    place: 'Lanciano',
    country: 'Itália',
    coords: [42.23, 14.39], // latitude, longitude (para o mapa da Jornada)
    year: 750,
    yearLabel: 'Século VIII',
    summary:
      'Um monge que duvidava da presença real de Jesus celebrava a Missa quando, na consagração, a hóstia se transformou em carne e o vinho em sangue, que se coagulou em cinco pequenas porções. Análises feitas em 1970 e 1971 identificaram tecido de músculo cardíaco e sangue humano do tipo AB.',
    whereToSee: 'Igreja de São Francisco, em Lanciano, onde as relíquias estão expostas.',
    recognition: 'culto',
  },
  {
    id: 'ferrara',
    name: 'O sangue na abóbada',
    link: EXHIBITION + 'scheda.html?nat=italia&wh=ferrara',
    place: 'Ferrara',
    country: 'Itália',
    coords: [44.84, 11.62], // latitude, longitude (para o mapa da Jornada)
    year: 1171,
    yearLabel: '1171',
    summary:
      'No Domingo de Páscoa, durante a Missa, a hóstia partida verteu sangue com tanta força que manchou a abóbada da igreja, acima do altar.',
    whereToSee: 'Basílica de Santa Maria in Vado, onde as manchas ainda podem ser vistas.',
    recognition: 'culto',
  },
  {
    id: 'daroca',
    name: 'Os Sagrados Corporais',
    link: EXHIBITION + 'scheda_b.html?nat=spagna&wh=daroca',
    place: 'Daroca',
    country: 'Espanha',
    coords: [41.11, -1.42], // latitude, longitude (para o mapa da Jornada)
    year: 1239,
    yearLabel: '1239',
    summary:
      'Durante a Reconquista, um ataque obrigou um sacerdote a interromper a Missa e esconder as hóstias consagradas, envoltas nos corporais. Ao abri-los, ele encontrou as hóstias manchadas de sangue, aderidas ao tecido.',
    whereToSee: 'Colegiata de Santa María, em Daroca, que guarda os “Sagrados Corporais”.',
    recognition: 'culto',
  },
  {
    id: 'santarem',
    name: 'O Santíssimo Milagre',
    link: EXHIBITION + 'scheda_b.html?nat=portogallo&wh=santarem',
    place: 'Santarém',
    country: 'Portugal',
    coords: [39.24, -8.69], // latitude, longitude (para o mapa da Jornada)
    year: 1247,
    yearLabel: 'Século XIII',
    summary:
      'Uma mulher levou uma hóstia consagrada para usá-la num feitiço. Envolta num pano, a hóstia começou a sangrar. Arrependida, ela entregou a hóstia ao padre, e o sangue permaneceu.',
    whereToSee: 'Igreja do Santíssimo Milagre, em Santarém.',
    recognition: 'culto',
  },
  {
    id: 'bolsena',
    name: 'O corporal de Bolsena',
    link: EXHIBITION + 'scheda_b.html?nat=italia&wh=bolsena',
    place: 'Bolsena e Orvieto',
    country: 'Itália',
    coords: [42.64, 11.99], // latitude, longitude (para o mapa da Jornada)
    year: 1263,
    yearLabel: '1263',
    summary:
      'Um sacerdote que tinha dúvidas sobre a transubstanciação celebrava a Missa em Bolsena quando a hóstia verteu sangue sobre o corporal. No ano seguinte, o Papa Urbano IV estendeu a toda a Igreja a festa de Corpus Christi.',
    whereToSee: 'Catedral de Orvieto, que guarda o corporal manchado de sangue.',
    recognition: 'culto',
  },
  {
    id: 'walldurn',
    name: 'O Santo Sangue',
    link: EXHIBITION + 'scheda_b.html?nat=germania&wh=walldurn',
    place: 'Walldürn',
    country: 'Alemanha',
    coords: [49.58, 9.37], // latitude, longitude (para o mapa da Jornada)
    year: 1330,
    yearLabel: '1330',
    summary:
      'Um sacerdote derrubou o cálice depois da consagração. O vinho derramado formou sobre o corporal a imagem de Cristo crucificado, cercada por rostos de Cristo coroado de espinhos.',
    whereToSee: 'Basílica de São Jorge, conhecida como Basílica do Santo Sangue, em Walldürn, destino de peregrinação até hoje.',
    recognition: 'culto',
  },
  {
    id: 'cascia',
    name: 'A hóstia no breviário',
    link: EXHIBITION + 'scheda.html?nat=italia&wh=cascia',
    place: 'Cássia',
    country: 'Itália',
    coords: [42.72, 13.01], // latitude, longitude (para o mapa da Jornada)
    year: 1330,
    yearLabel: '1330',
    summary:
      'Um padre chamado para levar a Comunhão a um doente guardou a hóstia, sem o devido respeito, entre as páginas do breviário. Ao abri-lo, encontrou a hóstia sangrando e as páginas manchadas.',
    whereToSee: 'Basílica de Santa Rita, em Cássia, onde a página manchada é venerada.',
    recognition: 'culto',
  },
  {
    id: 'amsterda',
    name: 'A hóstia intacta no fogo',
    link: EXHIBITION + 'scheda_b.html?nat=olanda&wh=amsterdam',
    place: 'Amsterdã',
    country: 'Holanda',
    coords: [52.37, 4.9], // latitude, longitude (para o mapa da Jornada)
    year: 1345,
    yearLabel: '1345',
    summary:
      'Um doente que tinha recebido a Comunhão passou mal, e o que ele expeliu foi jogado ao fogo. No dia seguinte, a hóstia foi encontrada intacta entre as brasas.',
    whereToSee: 'O milagre é lembrado todo mês de março pela “Stille Omgang”, uma procissão silenciosa noturna pelas ruas da cidade.',
    recognition: 'culto',
  },
  {
    id: 'ludbreg',
    name: 'O Precioso Sangue',
    link: EXHIBITION + 'scheda_b.html?nat=croazia&wh=ludbreg',
    place: 'Ludbreg',
    country: 'Croácia',
    coords: [46.25, 16.62], // latitude, longitude (para o mapa da Jornada)
    year: 1411,
    yearLabel: '1411',
    summary:
      'Um sacerdote que duvidava da presença real viu o vinho consagrado se transformar em sangue. Em 1513, o Papa Leão X aprovou a veneração da relíquia.',
    whereToSee: 'Igreja da Santíssima Trindade e santuário do Precioso Sangue, em Ludbreg.',
    recognition: 'culto',
  },
  {
    id: 'faverney',
    name: 'O ostensório suspenso no ar',
    link: EXHIBITION + 'scheda.html?nat=francia&wh=faverney',
    place: 'Faverney',
    country: 'França',
    coords: [47.77, 6.1], // latitude, longitude (para o mapa da Jornada)
    year: 1608,
    yearLabel: '1608',
    summary:
      'Na noite de Pentecostes, um incêndio destruiu o altar da abadia. O ostensório com duas hóstias consagradas ficou suspenso no ar, sem apoio, por cerca de 33 horas, diante de centenas de testemunhas.',
    whereToSee: 'Basílica de Notre-Dame la Blanche, em Faverney.',
    recognition: 'culto',
  },
  {
    id: 'siena',
    name: 'As hóstias que não se desfazem',
    link: EXHIBITION + 'scheda.html?nat=italia&wh=caterinadasiena',
    place: 'Siena',
    country: 'Itália',
    coords: [43.32, 11.33], // latitude, longitude (para o mapa da Jornada)
    year: 1730,
    yearLabel: '1730',
    summary:
      'Ladrões roubaram um cibório com hóstias consagradas, que foram encontradas dias depois numa caixa de esmolas. Guardadas desde então, as hóstias continuam sem se deteriorar quase três séculos depois, algo que pão sem fermento não resiste.',
    whereToSee: 'Basílica de São Francisco, em Siena.',
    recognition: 'culto',
  },
  {
    id: 'betania',
    name: 'A hóstia que sangrou',
    link: EXHIBITION + 'scheda.html?nat=venezuela&wh=betania',
    place: 'Betânia',
    country: 'Venezuela',
    coords: [10.16, -66.89], // latitude, longitude (para o mapa da Jornada)
    year: 1991,
    yearLabel: '1991',
    summary:
      'Em 8 de dezembro de 1991, durante a Missa no santuário de Betânia, o padre partiu a hóstia e viu surgir dela uma substância vermelha, como sangue.',
    whereToSee: 'A hóstia é guardada pelas Irmãs Agostinianas Recoletas em Los Teques.',
    recognition: 'bispo',
  },
  {
    id: 'buenos-aires',
    name: 'O tecido do coração',
    link: EXHIBITION + 'scheda_c.html?nat=argentina&wh=buenosaires',
    place: 'Buenos Aires',
    country: 'Argentina',
    coords: [-34.6, -58.38], // latitude, longitude (para o mapa da Jornada)
    year: 1996,
    yearLabel: '1992 a 1996',
    summary:
      'Hóstias encontradas no chão de uma paróquia foram colocadas na água para se dissolverem, como manda a norma, mas surgiu nelas uma substância vermelha. Por ordem do então bispo auxiliar Jorge Mario Bergoglio, futuro Papa Francisco, o material foi analisado, e os peritos descreveram tecido de músculo cardíaco.',
    whereToSee: 'Paróquia de Santa Maria, no bairro de Almagro.',
    recognition: 'estudo',
  },
  {
    id: 'tixtla',
    name: 'A hóstia que exsudou sangue',
    link: EXHIBITION + 'scheda_b.html?nat=messico&wh=tixtla',
    place: 'Tixtla',
    country: 'México',
    coords: [17.57, -99.4], // latitude, longitude (para o mapa da Jornada)
    year: 2006,
    yearLabel: '2006',
    summary:
      'Durante um retiro, uma religiosa que distribuía a Comunhão percebeu que uma das hóstias exsudava uma substância vermelha. Depois de anos de investigação, o bispo de Chilpancingo-Chilapa a declarou um sinal divino, em 2013.',
    whereToSee: 'Paróquia de São Martinho de Tours, em Tixtla.',
    recognition: 'bispo',
  },
  {
    id: 'sokolka',
    name: 'O coração na hóstia',
    link: EXHIBITION + 'scheda_c.html?nat=polonia&wh=sokolka',
    place: 'Sokółka',
    country: 'Polônia',
    coords: [53.41, 23.5], // latitude, longitude (para o mapa da Jornada)
    year: 2008,
    yearLabel: '2008',
    summary:
      'Uma hóstia que caiu durante a Comunhão foi colocada num recipiente com água. Dias depois, apareceu nela uma mancha vermelha. Dois patologistas da universidade de Białystok identificaram tecido de músculo cardíaco, entrelaçado com a hóstia.',
    whereToSee: 'Igreja de Santo Antônio, em Sokółka.',
    recognition: 'bispo',
  },
  {
    id: 'legnica',
    name: 'O coração em agonia',
    link: EXHIBITION + 'scheda_b.html?nat=polonia&wh=legnica',
    place: 'Legnica',
    country: 'Polônia',
    coords: [51.21, 16.16], // latitude, longitude (para o mapa da Jornada)
    year: 2013,
    yearLabel: '2013',
    summary:
      'No Natal, uma hóstia caiu no chão e foi posta na água. Surgiram nela fragmentos vermelhos, que os peritos identificaram como tecido de músculo cardíaco com sinais de agonia. Em 2016, depois de consultar a Santa Sé, o bispo reconheceu o milagre.',
    whereToSee: 'Santuário de São Jacinto, em Legnica.',
    recognition: 'bispo',
  },
  // Milagres sem página própria na lista da exposição (por isso sem "link").
  {
    id: 'augsburgo',
    name: 'A hóstia guardada na cera',
    place: 'Augsburgo',
    country: 'Alemanha',
    coords: [48.37, 10.9],
    year: 1194,
    yearLabel: '1194',
    summary:
      'Uma mulher guardou em casa uma hóstia consagrada, envolta em cera. Anos depois, arrependida, entregou-a ao padre: parte da hóstia tinha se transformado em carne.',
    whereToSee: 'Igreja da Santa Cruz (Heilig Kreuz), em Augsburgo.',
    recognition: 'culto',
  },
  {
    id: 'alatri',
    name: 'A hóstia que virou carne',
    place: 'Alatri',
    country: 'Itália',
    coords: [41.73, 13.34],
    year: 1228,
    yearLabel: '1228',
    summary:
      'Uma jovem guardou uma hóstia consagrada para fazer uma “poção de amor”, a conselho de uma feiticeira. Dias depois, encontrou a hóstia transformada em carne. Arrependida, contou tudo ao bispo, e o Papa Gregório IX tratou do caso numa carta de 1228.',
    whereToSee: 'Catedral de São Paulo, em Alatri.',
    recognition: 'culto',
  },
  {
    id: 'offida',
    name: 'A hóstia que sangrou no fogo',
    place: 'Offida',
    country: 'Itália',
    coords: [42.94, 13.69],
    year: 1273,
    yearLabel: '1273',
    summary:
      'Uma mulher tentou usar uma hóstia consagrada num feitiço e a levou ao fogo. A hóstia se transformou em carne e verteu sangue. Anos depois, arrependida, ela confessou o que tinha feito, e a relíquia foi levada para Offida.',
    whereToSee: 'Igreja de Santo Agostinho, em Offida.',
    recognition: 'culto',
  },
  {
    id: 'cebreiro',
    name: 'O cálice do Cebreiro',
    place: 'O Cebreiro',
    country: 'Espanha',
    coords: [42.71, -7.04],
    year: 1300,
    yearLabel: 'Por volta de 1300',
    summary:
      'Num dia de nevasca, um camponês subiu a montanha para ir à Missa. O monge que celebrava achou exagero tanto esforço “por um pouco de pão e vinho”. Na consagração, a hóstia se tornou carne e o vinho, sangue.',
    whereToSee: 'Igreja de Santa María la Real, em O Cebreiro, no Caminho de Santiago, que guarda o cálice e a patena.',
    recognition: 'culto',
  },
  {
    id: 'seefeld',
    name: 'A hóstia do cavaleiro orgulhoso',
    place: 'Seefeld',
    country: 'Áustria',
    coords: [47.33, 11.19],
    year: 1384,
    yearLabel: '1384',
    summary:
      'Na Quinta-feira Santa, o cavaleiro Oswald Milser exigiu, por orgulho, comungar a hóstia grande, reservada ao padre. Ao recebê-la, o chão cedeu sob os seus pés e a hóstia ficou marcada de sangue. Ele se arrependeu e passou a viver em penitência.',
    whereToSee: 'Igreja de Santo Osvaldo, em Seefeld.',
    recognition: 'culto',
  },
  {
    id: 'avinhao',
    name: 'As águas que se abriram',
    place: 'Avinhão',
    country: 'França',
    coords: [43.95, 4.81],
    year: 1433,
    yearLabel: '1433',
    summary:
      'Em novembro de 1433, uma enchente invadiu a capela onde o Santíssimo estava exposto. Os frades que chegaram de barco viram a água afastada dos dois lados, deixando seco o caminho até o altar.',
    whereToSee: 'Capela dos Penitentes Cinzentos, em Avinhão, onde o milagre é lembrado todo 30 de novembro.',
    recognition: 'culto',
  },
  {
    id: 'turim',
    name: 'A hóstia que se ergueu no ar',
    place: 'Turim',
    country: 'Itália',
    coords: [45.07, 7.68],
    year: 1453,
    yearLabel: '1453',
    summary:
      'Soldados saquearam uma igreja em Exilles e levaram o ostensório num saco, no lombo de uma mula. Em Turim, o animal parou, o saco se abriu e a hóstia se elevou no ar, resplandecente, até que o bispo a recebeu num cálice.',
    whereToSee: 'Basílica do Corpus Domini, construída no lugar do milagre, em Turim.',
    recognition: 'culto',
  },
  {
    id: 'eten',
    name: 'O Menino Jesus na hóstia',
    place: 'Eten',
    country: 'Peru',
    coords: [-6.91, -79.86],
    year: 1649,
    yearLabel: '1649',
    summary:
      'Em 2 de junho de 1649, durante a exposição do Santíssimo, os fiéis viram na hóstia a figura de um menino. A visão se repetiu semanas depois, diante de muitas pessoas.',
    whereToSee: 'Santuário do Divino Menino do Milagre, em Eten.',
    recognition: 'culto',
  },
  {
    id: 'chirattakonam',
    name: 'O rosto na hóstia',
    place: 'Chirattakonam',
    country: 'Índia',
    coords: [8.8, 76.88],
    year: 2001,
    yearLabel: '2001',
    summary:
      'Em abril de 2001, durante a adoração, apareceram na hóstia exposta marcas que formavam um rosto, lembrando Cristo coroado de espinhos.',
    whereToSee: 'Igreja de Santa Maria, em Chirattakonam, no estado de Kerala.',
    recognition: 'estudo',
  },
];
