// Exame de consciência organizado pelos Dez Mandamentos e pelos Mandamentos da Igreja.
// As perguntas são um roteiro para a memória, não uma lista completa: o que não estiver aqui pode ser escrito à mão.

export const examination = [
  {
    id: 'deus',
    title: 'Para com Deus',
    commandments: [
      {
        id: 'm1',
        title: '1º mandamento',
        subtitle: 'Amar a Deus sobre todas as coisas',
        items: [
          'Deixei de rezar por muito tempo ou rezei só por obrigação',
          'Duvidei da fé de propósito ou a neguei diante dos outros',
          'Recorri a horóscopo, simpatias, cartas, búzios ou espiritismo',
          'Usei amuletos ou confiei em superstições',
          'Coloquei dinheiro, trabalho, fama ou prazer acima de Deus',
          'Desesperei da misericórdia de Deus ou abusei dela, pecando porque "depois me confesso"',
          'Recebi a Comunhão em pecado grave',
          'Escondi de propósito um pecado grave numa confissão',
        ],
      },
      {
        id: 'm2',
        title: '2º mandamento',
        subtitle: 'Não tomar seu santo nome em vão',
        items: [
          'Usei o nome de Deus, de Maria ou dos santos com desrespeito ou em brincadeiras',
          'Blasfemei ou falei mal de Deus ou da Igreja',
          'Jurei em falso ou jurei sem necessidade',
          'Fiz uma promessa a Deus e não cumpri',
        ],
      },
      {
        id: 'm3',
        title: '3º mandamento',
        subtitle: 'Guardar domingos e festas de guarda',
        items: [
          'Faltei à Missa no domingo ou num dia santo de preceito sem motivo grave',
          'Cheguei atrasado ou saí antes do fim da Missa sem motivo',
          'Fiquei distraído de propósito durante a Missa (celular, conversas)',
          'Trabalhei ou fiz outros trabalhar no domingo sem necessidade',
        ],
      },
    ],
  },
  {
    id: 'proximo',
    title: 'Para com o próximo e comigo mesmo',
    commandments: [
      {
        id: 'm4',
        title: '4º mandamento',
        subtitle: 'Honrar pai e mãe',
        items: [
          'Desobedeci ou faltei com respeito aos meus pais ou responsáveis',
          'Abandonei ou não ajudei meus pais na velhice ou na doença',
          'Descuidei da educação e da fé dos meus filhos',
          'Fui injusto ou ríspido com quem depende de mim',
          'Desrespeitei professores, chefes ou autoridades legítimas',
        ],
      },
      {
        id: 'm5',
        title: '5º mandamento',
        subtitle: 'Não matar',
        items: [
          'Agredi alguém fisicamente ou com palavras',
          'Guardei ódio, rancor ou desejo de vingança',
          'Recusei-me a perdoar',
          'Fiz, aconselhei ou ajudei num aborto',
          'Coloquei vidas em risco dirigindo de forma imprudente ou após beber',
          'Abusei de bebida, drogas ou comida, prejudicando minha saúde',
          'Desejei ou tentei tirar a própria vida, ou me feri de propósito',
          'Dei mau exemplo e levei alguém a pecar',
        ],
      },
      {
        id: 'm6',
        title: '6º e 9º mandamentos',
        subtitle: 'Não pecar contra a castidade e não desejar a mulher (ou o marido) do próximo',
        items: [
          'Consumi pornografia',
          'Pratiquei atos impuros sozinho ou com outra pessoa',
          'Tive relações fora do matrimônio',
          'Fui infiel ao meu cônjuge, em atos ou em pensamento consentido',
          'Alimentei de propósito pensamentos ou desejos impuros',
          'Usei roupas, conversas ou mensagens para provocar desejos impuros',
          'Usei métodos contraceptivos no matrimônio',
        ],
      },
      {
        id: 'm7',
        title: '7º e 10º mandamentos',
        subtitle: 'Não roubar e não cobiçar as coisas alheias',
        items: [
          'Roubei ou fiquei com algo que não era meu',
          'Não devolvi algo emprestado ou não paguei uma dívida',
          'Enganei alguém em compras, vendas ou no trabalho',
          'Sonegei impostos ou fraudei documentos',
          'Desperdicei dinheiro ou fui avarento com quem precisava',
          'Danifiquei o que é dos outros ou o que é público',
          'Senti inveja dos bens ou do sucesso dos outros',
        ],
      },
      {
        id: 'm8',
        title: '8º mandamento',
        subtitle: 'Não levantar falso testemunho',
        items: [
          'Menti',
          'Falei mal dos outros pelas costas ou espalhei fofocas',
          'Caluniei alguém, atribuindo-lhe o que não fez',
          'Julguei os outros de forma precipitada',
          'Revelei segredos que me foram confiados',
          'Fui hipócrita ou fingi o que não sou',
        ],
      },
    ],
  },
  {
    id: 'igreja',
    title: 'Mandamentos da Igreja',
    commandments: [
      {
        id: 'igreja',
        title: 'Preceitos da Igreja',
        subtitle: 'O mínimo que a Igreja pede aos fiéis',
        items: [
          'Não me confessei ao menos uma vez por ano',
          'Não comunguei ao menos na Páscoa',
          'Não fiz jejum e abstinência na Quarta-feira de Cinzas e na Sexta-feira Santa',
          'Não fiz abstinência de carne (ou outra penitência) nas sextas-feiras',
          'Não ajudei a Igreja nas suas necessidades, conforme as minhas possibilidades',
        ],
      },
    ],
  },
];

// Pecados capitais: raízes dos outros pecados, úteis para olhar o que se repete.
export const capitalSins = [
  ['Soberba', 'Achar-me melhor que os outros, não aceitar correção, buscar aplausos.'],
  ['Avareza', 'Apego exagerado ao dinheiro e às coisas.'],
  ['Luxúria', 'Busca desordenada do prazer sexual.'],
  ['Ira', 'Explosões de raiva, impaciência, desejo de vingança.'],
  ['Gula', 'Excesso na comida e na bebida.'],
  ['Inveja', 'Tristeza pelo bem dos outros.'],
  ['Preguiça', 'Descuido das obrigações, inclusive as espirituais.'],
];

export const confessionSteps = [
  ['Reze ao Espírito Santo', 'Peça luz para ver com sinceridade os seus pecados, sem medo e sem desespero.'],
  ['Faça o exame', 'Marque abaixo o que se aplica a você. Para pecados graves, lembre-se, se puder, de quantas vezes aconteceram.'],
  ['Arrependa-se', 'Peça perdão a Deus de coração, pelo amor que Ele merece, e não só pelo medo do castigo.'],
  ['Faça o propósito', 'Decida, com a ajuda de Deus, evitar o pecado e as ocasiões que levam a ele.'],
  [
    'Confesse ao padre',
    'Comece com o sinal da cruz e diga: "Padre, dê-me a sua bênção, porque pequei. Minha última confissão foi há [tempo]." Depois conte os pecados com simplicidade.',
  ],
  ['Reze o Ato de Contrição', 'Quando o padre pedir, reze o Ato de Contrição (está no fim desta página) e receba a absolvição.'],
  ['Cumpra a penitência', 'Faça logo a oração ou a ação que o padre indicar, em agradecimento pelo perdão recebido.'],
];
