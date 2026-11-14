/* ============================================================
   Terço por intenção: o terço de sempre, com um oferecimento
   próprio no começo, uma sugestão de pedido para cada dezena e,
   no fim, a oração ao santo que a Igreja liga àquela intenção.

   As intenções são as mesmas de src/data/saints.js (intentions)
   e a oração final vem de src/data/prayers.js (prayerId, ou
   prayerIds quando são mais de uma), para não repetir textos.

   O terço não é fórmula nem garantia: é entregar o pedido a Deus,
   pela intercessão de Maria e dos santos, aceitando a sua vontade.
   ============================================================ */


export const rosaryIntentions = [
  {
    id: 'relacionamento',
    title: 'Terço para encontrar um(a) companheiro(a)',
    short: 'Namoro e casamento',
    saint: 'Santo Antônio',
    closingLabel: 'Santo Antônio e a São Rafael',
    saintSlug: 'santo-antonio',
    prayerIds: ['santo-antonio', 'sao-rafael-encontros'],
    about:
      'Santo Antônio é lembrado como protetor dos noivos e das famílias, e São Rafael, como o anjo dos encontros felizes. Peça uma pessoa que te aproxime de Deus, e não só alguém para não ficar sozinho(a).',
    offerFor: 'pelo(a) companheiro(a) que Vós preparastes para mim: que eu o(a) encontre no tempo certo, que nos reconheçamos e que caminhemos juntos para Vós.',
    decades: [
      'Agradeça pelas pessoas que já te amam: família, amigos, quem reza por você.',
      'Peça um coração preparado: paciência, maturidade e capacidade de amar de verdade.',
      'Peça pela pessoa que Deus tem para você, onde ela estiver agora.',
      'Peça discernimento para reconhecer quem te aproxima de Deus, e coragem para dar o primeiro passo.',
      'Entregue o seu tempo a Deus: “seja feita a vossa vontade, e não a minha”.',
    ],
    tips: {
      offer: 'A espera, a solidão e as decepções passadas.',
      thank: 'O amor que você já recebe e as pessoas que Deus colocou no seu caminho.',
      ask: 'Um encontro que leve os dois para mais perto de Deus, e a cura do que ainda dói.',
    },
  },
  {
    id: 'saude',
    title: 'Terço pela saúde e pela cura',
    short: 'Saúde',
    saint: 'São Rafael Arcanjo',
    saintSlug: 'sao-rafael',
    prayerId: 'oracao-a-sao-rafael',
    about:
      'São Rafael, cujo nome quer dizer “Deus cura”, acompanhou Tobias e curou o seu pai. Reze pela cura, pelos médicos e pela força de quem cuida.',
    offerFor: 'pela saúde de [nome]: que ele(a) receba a cura, se for da vossa vontade, e a paz em qualquer caso.',
    decades: [
      'Agradeça pelo dom da vida e pela saúde que você ainda tem.',
      'Peça a cura do corpo e da alma de quem está doente.',
      'Peça pelos médicos, enfermeiros e cuidadores: mãos firmes e coração atento.',
      'Peça força e esperança para a família de quem sofre.',
      'Una a dor de quem está doente à cruz de Jesus e entregue o resultado a Deus.',
    ],
    tips: {
      offer: 'O cansaço do tratamento, a dor e a espera pelos exames.',
      thank: 'Cada melhora, cada dia a mais e as pessoas que cuidam.',
      ask: 'A cura, a serenidade e um bom tratamento.',
    },
  },
  {
    id: 'familia',
    title: 'Terço pela família',
    short: 'Família',
    saint: 'São José',
    saintSlug: 'sao-jose',
    prayerId: 'a-vos-sao-jose',
    about:
      'São José guardou a Sagrada Família nas horas difíceis. Reze por cada pessoa da sua casa, inclusive por quem está longe ou brigado.',
    offerFor: 'pela nossa família: pela união, pelo perdão entre nós e pela fé de cada um.',
    decades: [
      'Agradeça por cada pessoa da sua família, dizendo o nome dela.',
      'Peça pela união do casal (ou dos seus pais) e pelo diálogo em casa.',
      'Peça pelos filhos, sobrinhos e netos: fé, saúde e boas escolhas.',
      'Peça o perdão onde há mágoa e a volta de quem se afastou.',
      'Reze pelos familiares que já morreram.',
    ],
    tips: {
      offer: 'As brigas, as preocupações e os cuidados de cada dia.',
      thank: 'A casa, o pão e as pessoas que Deus te deu.',
      ask: 'Paz em casa, perdão e fé para todos.',
    },
  },
  {
    id: 'protecao',
    title: 'Terço pela proteção',
    short: 'Proteção',
    saint: 'São Miguel Arcanjo',
    saintSlug: 'sao-miguel',
    prayerId: 'sao-miguel-arcanjo',
    about:
      'São Miguel é o defensor do povo de Deus no combate espiritual. Reze pela proteção da sua casa, do seu caminho e da sua fé.',
    offerFor: 'pela nossa proteção: livrai-nos de todo mal, do perigo e da tentação, e guardai a nossa casa.',
    decades: [
      'Agradeça pelos perigos de que você foi livrado(a), mesmo sem saber.',
      'Peça proteção para a sua casa e para quem mora nela.',
      'Peça proteção nos caminhos: no trânsito, no trabalho, na escola.',
      'Peça força contra a tentação e contra o que te afasta de Deus.',
      'Peça pelo seu anjo da guarda e confie a Deus o que você não controla.',
    ],
    tips: {
      offer: 'O medo, a insegurança e as noites mal dormidas.',
      thank: 'Cada dia em que você chegou bem em casa.',
      ask: 'Proteção, paz e fé firme.',
    },
  },
  {
    id: 'trabalho',
    title: 'Terço pelo trabalho',
    short: 'Trabalho',
    saint: 'São José',
    saintSlug: 'sao-jose',
    prayerId: 'sao-jose',
    about:
      'São José, o carpinteiro de Nazaré, é o padroeiro dos trabalhadores. Reze por um emprego, pelo trabalho que você tem e por quem trabalha com você.',
    offerFor: 'pelo nosso trabalho: que nunca falte o sustento e que o nosso trabalho seja honesto e sirva aos outros.',
    decades: [
      'Agradeça pelo trabalho que você tem (ou já teve) e pelo que aprendeu nele.',
      'Peça um emprego digno, para você ou para quem está desempregado.',
      'Peça pelos colegas e pelos chefes: respeito, justiça e paz no ambiente.',
      'Peça sabedoria para as decisões e honestidade em tudo.',
      'Ofereça o seu trabalho de amanhã a Deus, do começo ao fim.',
    ],
    tips: {
      offer: 'O cansaço, as cobranças e o trabalho que ninguém vê.',
      thank: 'O sustento de cada mês e as portas que se abriram.',
      ask: 'Um trabalho digno, justo e que dê sentido aos dias.',
    },
  },
  {
    id: 'causas-impossiveis',
    title: 'Terço pelas causas difíceis',
    short: 'Causas difíceis',
    saint: 'São Judas Tadeu',
    saintSlug: 'sao-judas-tadeu',
    prayerId: 'oracao-a-sao-judas-tadeu',
    about:
      'São Judas Tadeu e Santa Rita são lembrados nas causas que parecem sem saída. Reze com confiança e com abandono: Deus sabe o que é melhor.',
    offerFor: 'por esta causa que parece impossível: [diga qual]. Que se faça a vossa vontade, e que nos deis força para aceitá-la.',
    decades: [
      'Agradeça pelas outras vezes em que Deus te ajudou quando parecia não haver saída.',
      'Apresente o seu pedido com todas as palavras, sem esconder nada.',
      'Peça paciência para esperar o tempo de Deus.',
      'Peça pelas outras pessoas que estão passando pela mesma dificuldade.',
      'Diga a Deus: “Jesus, eu confio em Vós”, e entregue o resultado.',
    ],
    tips: {
      offer: 'A angústia e a sensação de que nada vai mudar.',
      thank: 'As graças que você já recebeu antes.',
      ask: 'A solução, se for da vontade de Deus, e a paz em qualquer caso.',
    },
  },
  {
    id: 'paz',
    title: 'Terço pela paz interior',
    short: 'Paz interior',
    saint: 'Jesus Misericordioso',
    prayerId: 'jesus-eu-confio-em-vos',
    about:
      'Para os dias de ansiedade, tristeza ou cabeça cheia. Reze devagar, sem pressa de terminar: o terço também é um descanso em Deus.',
    offerFor: 'pela paz do nosso coração: acalmai a ansiedade, curai a tristeza e ensinai-nos a confiar.',
    decades: [
      'Agradeça por três coisas boas do seu dia, mesmo pequenas.',
      'Entregue a Deus a preocupação que mais pesa agora.',
      'Peça perdão pelo que te tira a paz por dentro, e perdoe quem te feriu.',
      'Peça pelas pessoas que sofrem de ansiedade e depressão.',
      'Fique um momento em silêncio antes da última Ave-Maria.',
    ],
    tips: {
      offer: 'A ansiedade, o medo do futuro e o que você não consegue resolver.',
      thank: 'Os momentos de paz que você já teve.',
      ask: 'Serenidade, confiança e um sono tranquilo.',
    },
  },
  {
    id: 'estudos',
    title: 'Terço pelos estudos e provas',
    short: 'Estudos e provas',
    saint: 'São Tomás de Aquino',
    prayerId: 'antes-de-estudar',
    about:
      'Para quem estuda, faz prova, vestibular ou concurso. Reze pedindo memória, calma e honestidade, e estude como se tudo dependesse de você.',
    offerFor: 'pelos nossos estudos: inteligência para aprender, memória para lembrar e calma na hora da prova.',
    decades: [
      'Agradeça pela oportunidade de estudar e pelos seus professores.',
      'Peça foco e disciplina para os dias de estudo.',
      'Peça memória e calma na hora da prova.',
      'Peça pelos colegas que estão na mesma luta.',
      'Entregue o resultado a Deus e peça luz para o seu futuro.',
    ],
    tips: {
      offer: 'As horas de estudo, o cansaço e o medo de não passar.',
      thank: 'Tudo o que você já aprendeu.',
      ask: 'Clareza, memória, serenidade e um bom resultado.',
    },
  },
  {
    id: 'coisas-perdidas',
    title: 'Terço para achar o que se perdeu',
    short: 'Coisas perdidas',
    saint: 'Santo Antônio',
    saintSlug: 'santo-antonio',
    prayerId: 'responsorio-santo-antonio',
    about:
      'Santo Antônio é lembrado por quem perdeu algo. Vale para objetos e também para o que se perde por dentro: a fé, a esperança, a alegria.',
    offerFor: 'para reencontrar [o que se perdeu], e também a fé e a esperança, se elas se perderam.',
    decades: [
      'Agradeça pelo que você tem e às vezes esquece de valorizar.',
      'Peça para reencontrar o que se perdeu.',
      'Peça para reencontrar a fé, a alegria ou a paz, se elas se perderam.',
      'Reze por quem está perdido, sem rumo ou longe de Deus.',
      'Entregue a Deus o que não pode ser recuperado.',
    ],
    tips: {
      offer: 'A aflição de procurar sem achar.',
      thank: 'O que você já reencontrou outras vezes.',
      ask: 'Achar o que se perdeu e não perder a calma.',
    },
  },
  {
    id: 'viagens',
    title: 'Terço por uma boa viagem',
    short: 'Viagens',
    saint: 'São Rafael Arcanjo',
    saintSlug: 'sao-rafael',
    prayerId: 'oracao-a-sao-rafael',
    about: 'São Rafael guiou Tobias no caminho, na ida e na volta. Reze antes de viajar ou por alguém que está na estrada.',
    offerFor: 'por esta viagem: que todos vão e voltem em paz e com saúde.',
    decades: [
      'Agradeça pela viagem e pelo motivo dela.',
      'Peça proteção na estrada, no ar ou no mar.',
      'Peça por quem dirige, pilota ou conduz.',
      'Peça pelos que ficam em casa e pela volta de todos.',
      'Peça que a viagem também te aproxime de Deus.',
    ],
    tips: {
      offer: 'A ansiedade da partida e o cansaço do caminho.',
      thank: 'O lugar para onde você vai e quem vai te receber.',
      ask: 'Proteção na ida e na volta.',
    },
  },
  {
    id: 'maternidade',
    title: 'Terço pela gravidez e pela maternidade',
    short: 'Gravidez e maternidade',
    saint: 'Nossa Senhora',
    prayerId: 'lembrai-vos',
    about:
      'Maria esperou Jesus por nove meses. Reze pelo desejo de ter um filho, por uma gravidez tranquila ou pelas mães que você conhece.',
    offerFor: 'pela [gravidez / pelo desejo de ser mãe e pai]: que a criança seja acolhida com amor e que tudo corra bem.',
    decades: [
      'Agradeça pelo dom da vida e pela sua própria mãe.',
      'Peça pela saúde da mãe e do bebê (ou pelo desejo de engravidar).',
      'Peça pelo pai: que ele cuide e esteja presente.',
      'Peça pelas mães que perderam um filho e pelas que esperam há muito tempo.',
      'Consagre a criança (ou o desejo dela) a Nossa Senhora.',
    ],
    tips: {
      offer: 'Os enjoos, o medo e a espera.',
      thank: 'Cada exame bom e cada sinal de vida.',
      ask: 'Saúde para a mãe e o bebê, e um parto tranquilo.',
    },
  },
  {
    id: 'dividas',
    title: 'Terço pelas dívidas e dificuldades financeiras',
    short: 'Dívidas',
    saint: 'São José',
    saintSlug: 'sao-jose',
    prayerId: 'sao-jose',
    about:
      'São José sustentou a Sagrada Família com o seu trabalho. Reze pela solução das dívidas e por sabedoria para cuidar do dinheiro.',
    offerFor: 'pelas nossas dificuldades financeiras: que nunca falte o necessário e que encontremos o caminho para sair das dívidas.',
    decades: [
      'Agradeça pelo que não faltou até hoje.',
      'Peça uma saída para as dívidas e um trabalho que dê o sustento.',
      'Peça sabedoria e disciplina para cuidar do dinheiro.',
      'Peça pelos que passam fome e pelos que estão sem trabalho.',
      'Entregue a preocupação a Deus: “o pão nosso de cada dia nos dai hoje”.',
    ],
    tips: {
      offer: 'A preocupação com as contas e a vergonha de pedir ajuda.',
      thank: 'O pão de cada dia e quem te ajudou.',
      ask: 'A solução das dívidas, trabalho e sabedoria.',
    },
  },
  {
    id: 'boa-morte',
    title: 'Terço por uma boa morte e pelos falecidos',
    short: 'Boa morte e falecidos',
    saint: 'São José',
    saintSlug: 'sao-jose',
    prayerId: 'pelas-almas-do-purgatorio',
    about:
      'São José, que morreu ao lado de Jesus e Maria, é o padroeiro da boa morte. Reze por quem está perto de partir e pelas almas de quem já partiu.',
    offerFor: 'por [nome], que está perto de partir (ou que já partiu): que seja acolhido(a) na casa do Pai.',
    decades: [
      'Agradeça pela vida de quem está partindo ou já partiu.',
      'Peça que ele(a) receba os sacramentos e morra em paz com Deus.',
      'Reze pelas almas do purgatório, principalmente as mais esquecidas.',
      'Peça consolo para a família que fica.',
      'Peça por você: que esteja preparado(a) quando chegar a sua hora.',
    ],
    tips: {
      offer: 'A saudade e o medo da perda.',
      thank: 'Os anos vividos juntos e o que você aprendeu com essa pessoa.',
      ask: 'O descanso eterno e o consolo de quem fica.',
    },
  },
];

export const getRosaryIntention = (id) => rosaryIntentions.find((i) => i.id === id) ?? null;

/** Ids das orações do fim do terço (uma ou mais, na ordem). */
export const closingPrayerIds = (intention) => intention.prayerIds ?? [intention.prayerId];

/** Até cinco intenções: uma para cada dezena. */
export const MAX_INTENTIONS = 5;

/**
 * Oferecimento do terço com as intenções escolhidas (offerFor de cada uma),
 * no mesmo texto do terço tradicional.
 */
export function buildOffering(list) {
  const end = (t) => (/[.!?]$/.test(t) ? t : `${t}.`);
  const parts = list.map((it, i) => `${i === 0 ? 'Oferecemos particularmente' : 'Oferecemos também'} ${end(it.offerFor)}`);
  return [
    'Divino Jesus, nós Vos oferecemos este terço que vamos rezar, meditando nos mistérios da nossa Redenção.',
    ...parts,
    'Concedei-nos, por intercessão da Virgem Maria, Mãe de Deus e nossa Mãe, as virtudes que nos são necessárias para bem rezá-lo. Amém.',
  ].join(' ');
}

/**
 * A intenção de cada dezena: com menos de cinco, elas se revezam
 * (duas intenções → 1ª, 3ª e 5ª para a primeira; 2ª e 4ª para a segunda).
 * O pedido sugerido é o da própria intenção para aquela dezena.
 */
export function decadePlan(list) {
  if (!list.length) return [];
  return [0, 1, 2, 3, 4].map((d) => {
    const intention = list[d % list.length];
    return { intention, hint: intention.decades[d] };
  });
}
