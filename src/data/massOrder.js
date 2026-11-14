/* ============================================================
   Ordinário da Missa: as partes fixas, na ordem da celebração.

   Direitos autorais: a tradução oficial do Missal Romano é da CNBB.
   Aqui ficam só as respostas curtas, de uso comum na assembleia, e
   as orações que o site já tinha (src/data/prayers.js). Hinos longos
   (Glória, Credo niceno) aparecem só no começo.

   Cada passo:
     lines   → falas: who = 'sacerdote' | 'diacono' | 'leitor' | 'povo' | 'todos'
     prayer  → id de uma oração de src/data/prayers.js, rezada por todos
     rule    → 'gloria' | 'credo' | 'acclamation' | 'penitential' | 'dismissal' | 'blessing'
     proper  → parte própria do dia, vinda da API ('entrada', 'coleta', 'oferendas', 'comunhao', 'posComunhao')
     readings→ chaves das leituras do dia (o texto fica na página de Leituras)
   ============================================================ */

/** Aclamação ao Evangelho: o Aleluia e a que o substitui na Quaresma. */
export const ACCLAMATION = {
  alleluia: 'Aleluia, aleluia, aleluia!',
  lent: 'Louvor e glória a vós, Senhor Jesus Cristo!',
};

/** Diálogos curtos que se repetem (também usados na página de Leituras). */
export const DIALOGUE = {
  greeting: ['O Senhor esteja convosco.', 'Ele está no meio de nós.'],
  wordOfTheLord: ['Palavra do Senhor.', 'Graças a Deus.'],
  gospelAnnounce: 'Glória a vós, Senhor.',
  gospelEnd: ['Palavra da Salvação.', 'Glória a vós, Senhor.'],
};

const amen = { who: 'povo', text: 'Amém.' };

export const WHO_LABEL = {
  sacerdote: 'Sacerdote',
  diacono: 'Diácono ou sacerdote',
  leitor: 'Leitor',
  povo: 'Povo',
  todos: 'Todos',
};

export const MASS_ORDER = [
  {
    id: 'ritos-iniciais',
    title: 'Ritos iniciais',
    intro: 'A assembleia se reúne, reconhece os pecados e louva a Deus antes de ouvir a Palavra.',
    steps: [
      {
        id: 'entrada',
        title: 'Canto de entrada',
        note: 'Todos de pé. Sem canto, reza-se a antífona de entrada.',
        proper: 'entrada',
      },
      {
        id: 'sinal-da-cruz',
        title: 'Sinal da cruz',
        lines: [{ who: 'sacerdote', text: 'Em nome do Pai e do Filho e do Espírito Santo.' }, amen],
      },
      {
        id: 'saudacao',
        title: 'Saudação',
        lines: [
          { who: 'sacerdote', text: 'A graça de nosso Senhor Jesus Cristo, o amor do Pai e a comunhão do Espírito Santo estejam convosco.' },
          { who: 'povo', text: 'Bendito seja Deus, que nos reuniu no amor de Cristo.' },
        ],
        note: 'O sacerdote pode usar outra saudação, como “O Senhor esteja convosco”. A resposta, então, é “Ele está no meio de nós”.',
      },
      {
        id: 'ato-penitencial',
        title: 'Ato penitencial',
        rule: 'penitential',
        lines: [{ who: 'sacerdote', text: 'Irmãos e irmãs, reconheçamos as nossas culpas para celebrarmos dignamente os santos mistérios.' }],
        prayer: 'confissao-penitencial',
        after: [
          { who: 'sacerdote', text: 'Deus todo-poderoso tenha compaixão de nós, perdoe os nossos pecados e nos conduza à vida eterna.' },
          amen,
        ],
        note: 'Aos domingos, sobretudo no Tempo Pascal, o ato penitencial pode ser trocado pela aspersão com água benta.',
      },
      {
        id: 'kyrie',
        title: 'Senhor, tende piedade',
        lines: [
          { who: 'sacerdote', text: 'Senhor, tende piedade de nós.' },
          { who: 'povo', text: 'Senhor, tende piedade de nós.' },
          { who: 'sacerdote', text: 'Cristo, tende piedade de nós.' },
          { who: 'povo', text: 'Cristo, tende piedade de nós.' },
          { who: 'sacerdote', text: 'Senhor, tende piedade de nós.' },
          { who: 'povo', text: 'Senhor, tende piedade de nós.' },
        ],
      },
      {
        id: 'gloria',
        title: 'Glória',
        rule: 'gloria',
        lines: [{ who: 'todos', text: 'Glória a Deus nas alturas, e paz na terra aos homens por ele amados…' }],
        note: 'Hino antigo de louvor, cantado ou rezado por todos. O texto completo está no folheto da Missa.',
      },
      {
        id: 'coleta',
        title: 'Oração do dia (coleta)',
        lines: [{ who: 'sacerdote', text: 'Oremos.' }],
        proper: 'coleta',
        after: [amen],
        note: 'Um instante de silêncio, para cada um apresentar a Deus as suas intenções.',
      },
    ],
  },
  {
    id: 'liturgia-da-palavra',
    title: 'Liturgia da Palavra',
    intro: 'Deus fala ao seu povo. Os textos mudam a cada dia; as respostas, não.',
    steps: [
      {
        id: 'primeira-leitura',
        title: 'Primeira leitura',
        note: 'Todos sentados.',
        readings: ['primeiraLeitura'],
        after: [{ who: 'leitor', text: DIALOGUE.wordOfTheLord[0] }, { who: 'povo', text: DIALOGUE.wordOfTheLord[1] }],
      },
      {
        id: 'salmo',
        title: 'Salmo responsorial',
        note: 'O povo repete o refrão depois de cada estrofe.',
        readings: ['salmo'],
      },
      {
        id: 'segunda-leitura',
        title: 'Segunda leitura',
        note: 'Aos domingos e nas solenidades.',
        readings: ['segundaLeitura'],
        after: [{ who: 'leitor', text: DIALOGUE.wordOfTheLord[0] }, { who: 'povo', text: DIALOGUE.wordOfTheLord[1] }],
        onlyWithReading: 'segundaLeitura',
      },
      {
        id: 'aclamacao',
        title: 'Aclamação ao Evangelho',
        rule: 'acclamation',
        note: 'Todos de pé.',
      },
      {
        id: 'evangelho',
        title: 'Evangelho',
        readings: ['evangelho'],
        lines: [
          { who: 'diacono', text: DIALOGUE.greeting[0] },
          { who: 'povo', text: DIALOGUE.greeting[1] },
          { who: 'diacono', text: 'Proclamação do Evangelho de Jesus Cristo segundo…' },
          { who: 'povo', text: DIALOGUE.gospelAnnounce },
        ],
        after: [{ who: 'diacono', text: DIALOGUE.gospelEnd[0] }, { who: 'povo', text: DIALOGUE.gospelEnd[1] }],
        note: 'Ao anúncio, faz-se o sinal da cruz pequeno na testa, nos lábios e no peito.',
      },
      {
        id: 'homilia',
        title: 'Homilia',
        note: 'Todos sentados. O sacerdote ou o diácono explica a Palavra e a aproxima da vida.',
      },
      {
        id: 'credo',
        title: 'Profissão de fé (Credo)',
        rule: 'credo',
        lines: [{ who: 'todos', text: 'Creio em um só Deus, Pai todo-poderoso, criador do céu e da terra, de todas as coisas visíveis e invisíveis…' }],
        note: 'Todos de pé. Nas palavras “e se encarnou pelo Espírito Santo…”, todos se inclinam. Também se pode rezar o Símbolo dos Apóstolos, sobretudo na Quaresma e no Tempo Pascal.',
        altPrayer: 'credo',
      },
      {
        id: 'oracao-dos-fieis',
        title: 'Oração dos fiéis',
        lines: [
          { who: 'leitor', text: 'Rezemos ao Senhor.' },
          { who: 'povo', text: 'Senhor, escutai a nossa prece.' },
        ],
        note: 'A resposta pode variar de uma comunidade para outra.',
      },
    ],
  },
  {
    id: 'liturgia-eucaristica',
    title: 'Liturgia eucarística',
    intro: 'O pão e o vinho são oferecidos, consagrados e repartidos: é o coração da Missa.',
    steps: [
      {
        id: 'ofertorio',
        title: 'Preparação das oferendas',
        lines: [
          { who: 'sacerdote', text: 'Bendito sejais, Senhor, Deus do universo, pelo pão que recebemos de vossa bondade…' },
          { who: 'povo', text: 'Bendito seja Deus para sempre!' },
        ],
        note: 'Se houver canto, o sacerdote reza em silêncio e não há resposta.',
      },
      {
        id: 'orai-irmaos',
        title: 'Orai, irmãos e irmãs',
        lines: [
          { who: 'sacerdote', text: 'Orai, irmãos e irmãs, para que o meu e o vosso sacrifício seja aceito por Deus Pai todo-poderoso.' },
          { who: 'povo', text: 'Receba o Senhor por tuas mãos este sacrifício, para glória do seu nome, para nosso bem e de toda a sua santa Igreja.' },
        ],
      },
      {
        id: 'oferendas',
        title: 'Oração sobre as oferendas',
        proper: 'oferendas',
        after: [amen],
      },
      {
        id: 'prefacio',
        title: 'Prefácio',
        lines: [
          { who: 'sacerdote', text: DIALOGUE.greeting[0] },
          { who: 'povo', text: DIALOGUE.greeting[1] },
          { who: 'sacerdote', text: 'Corações ao alto.' },
          { who: 'povo', text: 'O nosso coração está em Deus.' },
          { who: 'sacerdote', text: 'Demos graças ao Senhor, nosso Deus.' },
          { who: 'povo', text: 'É nosso dever e nossa salvação.' },
        ],
      },
      {
        id: 'santo',
        title: 'Santo',
        lines: [
          {
            who: 'todos',
            text: 'Santo, Santo, Santo, Senhor, Deus do universo! O céu e a terra proclamam a vossa glória. Hosana nas alturas! Bendito o que vem em nome do Senhor! Hosana nas alturas!',
          },
        ],
      },
      {
        id: 'oracao-eucaristica',
        title: 'Oração eucarística e consagração',
        note: 'Todos de joelhos durante a consagração, se for possível.',
        lines: [
          { who: 'sacerdote', text: 'Mistério da fé!' },
          { who: 'povo', text: 'Anunciamos, Senhor, a vossa morte e proclamamos a vossa ressurreição. Vinde, Senhor Jesus!' },
        ],
      },
      {
        id: 'doxologia',
        title: 'Doxologia final',
        lines: [
          { who: 'sacerdote', text: 'Por Cristo, com Cristo, e em Cristo, a vós, Deus Pai todo-poderoso, na unidade do Espírito Santo, toda a honra e toda a glória, por todos os séculos dos séculos.' },
          amen,
        ],
      },
      {
        id: 'pai-nosso',
        title: 'Pai-Nosso',
        lines: [{ who: 'sacerdote', text: 'Obedientes à palavra do Salvador e formados por seu divino ensinamento, ousamos dizer:' }],
        prayer: 'pai-nosso',
        after: [
          { who: 'sacerdote', text: 'Livrai-nos de todos os males, ó Pai…' },
          { who: 'povo', text: 'Vosso é o reino, o poder e a glória para sempre!' },
        ],
      },
      {
        id: 'paz',
        title: 'Rito da paz',
        lines: [
          { who: 'sacerdote', text: 'A paz do Senhor esteja sempre convosco.' },
          { who: 'povo', text: 'O amor de Cristo nos uniu.' },
        ],
      },
      {
        id: 'cordeiro',
        title: 'Cordeiro de Deus',
        lines: [
          { who: 'todos', text: 'Cordeiro de Deus, que tirais o pecado do mundo, tende piedade de nós.' },
          { who: 'todos', text: 'Cordeiro de Deus, que tirais o pecado do mundo, tende piedade de nós.' },
          { who: 'todos', text: 'Cordeiro de Deus, que tirais o pecado do mundo, dai-nos a paz.' },
        ],
      },
      {
        id: 'comunhao',
        title: 'Comunhão',
        lines: [
          { who: 'sacerdote', text: 'Felizes os convidados para a Ceia do Senhor. Eis o Cordeiro de Deus, que tira o pecado do mundo.' },
          { who: 'povo', text: 'Senhor, eu não sou digno(a) de que entreis em minha morada, mas dizei uma palavra e serei salvo(a).' },
          { who: 'sacerdote', text: 'O Corpo de Cristo.' },
          amen,
        ],
        proper: 'comunhao',
        note: 'Quem não pode comungar pode fazer a comunhão espiritual.',
      },
      {
        id: 'pos-comunhao',
        title: 'Oração depois da comunhão',
        lines: [{ who: 'sacerdote', text: 'Oremos.' }],
        proper: 'posComunhao',
        after: [amen],
      },
    ],
  },
  {
    id: 'ritos-finais',
    title: 'Ritos finais',
    intro: 'A assembleia é abençoada e enviada para viver o que celebrou.',
    steps: [
      {
        id: 'bencao',
        title: 'Bênção',
        rule: 'blessing',
        lines: [
          { who: 'sacerdote', text: DIALOGUE.greeting[0] },
          { who: 'povo', text: DIALOGUE.greeting[1] },
          { who: 'sacerdote', text: 'Abençoe-vos Deus todo-poderoso, Pai e Filho e Espírito Santo.' },
          amen,
        ],
      },
      {
        id: 'despedida',
        title: 'Despedida',
        rule: 'dismissal',
        lines: [
          { who: 'diacono', text: 'Ide em paz, e o Senhor vos acompanhe.' },
          { who: 'povo', text: 'Graças a Deus.' },
        ],
      },
    ],
  },
];
