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
];
