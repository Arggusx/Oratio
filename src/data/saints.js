/* ============================================================
   Santos e intenções de oração.
   Organizado como "tabelas" (santos, intenções e, em prayers.js,
   orações com saint/intentions) para facilitar uma futura
   migração para o banco de dados.
   ============================================================ */

export const intentions = [
  { id: 'protecao', label: 'Proteção espiritual' },
  { id: 'relacionamento', label: 'Encontrar um(a) companheiro(a)' },
  { id: 'familia', label: 'Família e casamento' },
  { id: 'saude', label: 'Saúde e cura' },
  { id: 'trabalho', label: 'Trabalho' },
  { id: 'causas-impossiveis', label: 'Causas difíceis' },
  { id: 'coisas-perdidas', label: 'Coisas perdidas' },
  { id: 'viagens', label: 'Viagens' },
  { id: 'boa-morte', label: 'Boa morte' },
  { id: 'paz', label: 'Paz interior' },
];

export const intentionLabel = (id) => intentions.find((i) => i.id === id)?.label ?? id;

/**
 * feast: 'MM-DD' da festa ou memória no calendário romano.
 * feastName: nome do evento no Calendário (santos com a mesma festa
 * compartilham o nome, e o evento aparece uma vez só).
 * inCalendar: true quando a data já existe no calendário litúrgico base.
 */
export const saints = [
  {
    slug: 'sao-bento',
    name: 'São Bento',
    title: 'Abade, padroeiro da Europa',
    feast: '07-11',
    feastName: 'São Bento, Abade',
    lifespan: 'c. 480 – 547',
    patronOf: ['Europa', 'Proteção contra o mal', 'Monges e religiosos', 'Agricultores'],
    intentions: ['protecao', 'paz'],
    bio: 'Nascido em Núrsia, na Itália, deixou os estudos em Roma para viver como eremita em Subiaco. Fundou o mosteiro de Montecassino e escreveu a Regra que orienta os monges até hoje, resumida no lema “Ora et labora” (reza e trabalha). É considerado o pai do monaquismo no Ocidente e foi proclamado padroeiro da Europa pelo Papa Paulo VI em 1964.',
    hasMedal: true,
  },
  {
    slug: 'sao-rafael',
    name: 'São Rafael Arcanjo',
    title: 'Arcanjo, “Deus cura”',
    feast: '09-29',
    feastName: 'Santos Arcanjos Miguel, Gabriel e Rafael',
    patronOf: ['Encontros e noivos', 'Viajantes', 'Doentes e médicos'],
    intentions: ['relacionamento', 'viagens', 'saude'],
    bio: 'Seu nome significa “Deus cura”. No livro de Tobias, ele se apresenta como “um dos sete anjos que estão diante do Senhor” (Tb 12,15): acompanha o jovem Tobias em sua viagem, livra-o dos perigos, conduz o encontro com Sara, que se torna sua esposa, e cura a cegueira de seu pai, Tobit. Por isso é invocado por quem procura um(a) companheiro(a), por quem viaja e pelos doentes.',
  },
  {
    slug: 'sao-miguel',
    name: 'São Miguel Arcanjo',
    title: 'Arcanjo, príncipe da milícia celeste',
    feast: '09-29',
    feastName: 'Santos Arcanjos Miguel, Gabriel e Rafael',
    patronOf: ['Proteção contra o mal', 'Igreja', 'Policiais e militares'],
    intentions: ['protecao'],
    bio: 'Seu nome é uma pergunta: “Quem como Deus?”. A Escritura o apresenta como o grande defensor do povo de Deus (Dn 12,1) e o líder dos anjos no combate contra o dragão (Ap 12,7). A oração a São Miguel, composta pelo Papa Leão XIII, foi rezada por décadas ao final das Missas e continua sendo uma das mais conhecidas orações de proteção.',
  },
  {
    slug: 'sao-jose',
    name: 'São José',
    title: 'Esposo da Virgem Maria',
    feast: '03-19',
    inCalendar: true,
    patronOf: ['Igreja universal', 'Famílias e pais', 'Trabalhadores', 'Boa morte'],
    intentions: ['familia', 'trabalho', 'boa-morte'],
    bio: 'Homem justo e silencioso, acolheu Maria como esposa e cuidou de Jesus como pai, ensinando-lhe o ofício de carpinteiro. Foi proclamado padroeiro da Igreja universal pelo Papa Pio IX em 1870. É invocado pelas famílias, pelos trabalhadores (festa de São José Operário, 1º de maio) e por quem pede uma boa morte, já que, segundo a tradição, morreu nos braços de Jesus e Maria.',
  },
  {
    slug: 'santo-antonio',
    name: 'Santo Antônio',
    title: 'Presbítero e Doutor da Igreja',
    feast: '06-13',
    feastName: 'Santo Antônio de Pádua',
    lifespan: '1195 – 1231',
    patronOf: ['Coisas perdidas', 'Casamentos', 'Pobres'],
    intentions: ['coisas-perdidas', 'relacionamento', 'familia'],
    bio: 'Nascido em Lisboa como Fernando de Bulhões, entrou para a Ordem Franciscana e se tornou um dos maiores pregadores de seu tempo. Morreu em Pádua, na Itália, e foi canonizado menos de um ano depois. Doutor da Igreja, é popularmente conhecido no Brasil como “santo casamenteiro” e invocado para encontrar objetos perdidos.',
  },
  {
    slug: 'santa-rita',
    name: 'Santa Rita de Cássia',
    title: 'Religiosa, a santa das causas impossíveis',
    feast: '05-22',
    feastName: 'Santa Rita de Cássia',
    lifespan: '1381 – 1457',
    patronOf: ['Causas impossíveis', 'Esposas e mães', 'Famílias em dificuldade'],
    intentions: ['causas-impossiveis', 'familia'],
    bio: 'Casou-se jovem com um homem violento, que se converteu por sua paciência e oração. Depois de ficar viúva e perder os dois filhos, entrou para o mosteiro agostiniano de Cássia, na Itália. Recebeu na testa a marca de um espinho da coroa de Cristo. É invocada nas situações que parecem sem saída.',
  },
  {
    slug: 'sao-judas-tadeu',
    name: 'São Judas Tadeu',
    title: 'Apóstolo',
    feast: '10-28',
    feastName: 'São Simão e São Judas, Apóstolos',
    patronOf: ['Causas desesperadas', 'Situações difíceis'],
    intentions: ['causas-impossiveis'],
    bio: 'Um dos doze Apóstolos, parente de Jesus segundo a tradição e autor da Carta de Judas no Novo Testamento. Não deve ser confundido com Judas Iscariotes, e talvez por isso tenha sido pouco lembrado por séculos. Tornou-se muito popular como intercessor nas causas desesperadas. A Igreja celebra sua festa junto com a do Apóstolo São Simão.',
  },
  {
    slug: 'santa-luzia',
    name: 'Santa Luzia',
    title: 'Virgem e mártir',
    feast: '12-13',
    feastName: 'Santa Luzia',
    lifespan: '† 304',
    patronOf: ['Olhos e visão', 'Oftalmologistas'],
    intentions: ['saude'],
    bio: 'Jovem cristã de Siracusa, na Sicília, consagrou sua virgindade a Deus e distribuiu seus bens aos pobres. Foi martirizada na perseguição de Diocleciano. Seu nome vem de “luz”, e por isso é invocada como protetora dos olhos e da visão.',
  },
  {
    slug: 'sao-bras',
    name: 'São Brás',
    title: 'Bispo e mártir',
    feast: '02-03',
    feastName: 'São Brás',
    lifespan: '† c. 316',
    patronOf: ['Doenças da garganta', 'Otorrinolaringologistas'],
    intentions: ['saude'],
    bio: 'Bispo de Sebaste, na Armênia, foi martirizado no início do século IV. Conta a tradição que salvou um menino que se engasgava com uma espinha de peixe. Por isso, em sua festa, a Igreja dá a bênção da garganta com duas velas cruzadas.',
  },
  {
    slug: 'sao-francisco',
    name: 'São Francisco de Assis',
    title: 'Fundador dos Frades Menores',
    feast: '10-04',
    feastName: 'São Francisco de Assis',
    lifespan: '1181/1182 – 1226',
    patronOf: ['Ecologia', 'Animais', 'Itália'],
    intentions: ['paz'],
    bio: 'Filho de um rico comerciante, deixou tudo para viver o Evangelho na pobreza e na alegria. Fundou a Ordem dos Frades Menores, recebeu os estigmas de Cristo e compôs o Cântico das Criaturas. Foi proclamado padroeiro da ecologia pelo Papa João Paulo II em 1979.',
  },
  {
    slug: 'santa-teresinha',
    name: 'Santa Teresinha do Menino Jesus',
    title: 'Virgem e Doutora da Igreja',
    feast: '10-01',
    feastName: 'Santa Teresinha do Menino Jesus',
    lifespan: '1873 – 1897',
    patronOf: ['Missões', 'Missionários', 'Floristas'],
    intentions: ['paz'],
    bio: 'Carmelita de Lisieux, na França, morreu aos 24 anos. Em sua autobiografia, “História de uma Alma”, ensinou o “pequeno caminho”: a santidade vivida no amor às coisas simples de cada dia. Foi proclamada Doutora da Igreja em 1997 e é padroeira das missões, embora nunca tenha saído do convento.',
  },
];

export const getSaint = (slug) => saints.find((s) => s.slug === slug);

/** 'MM-DD' → '11 de julho' */
export function formatFeast(feast) {
  const [month, day] = feast.split('-').map(Number);
  const monthName = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date(2000, month - 1, 1));
  return `${day === 1 ? '1º' : day} de ${monthName}`;
}
