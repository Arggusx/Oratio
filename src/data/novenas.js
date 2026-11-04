// Novenas: nove dias de oração por uma intenção. Cada dia tem um tema curto para meditar;
// a oração da novena é a mesma todos os dias e vem depois da meditação.

export const novenas = [
  {
    id: 'espirito-santo',
    title: 'Novena ao Espírito Santo',
    when: 'Tradicionalmente entre a Ascensão e Pentecostes, mas pode ser rezada em qualquer época.',
    intro:
      'É a novena mais antiga da Igreja: depois da Ascensão, os apóstolos e Maria ficaram nove dias em oração, esperando o Espírito Santo prometido por Jesus (At 1,14). Peça a cada dia um dom do Espírito.',
    prayer:
      'Vinde, Espírito Santo, enchei os corações dos vossos fiéis e acendei neles o fogo do vosso amor. Concedei-me hoje a graça que vos peço [faça aqui o seu pedido], se for para a glória de Deus e o bem da minha alma. Pai-Nosso, Ave-Maria, Glória.',
    days: [
      ['O Espírito prometido', 'Jesus não nos deixou órfãos: prometeu o Consolador. Peça a graça de esperar com fé.'],
      ['Dom da sabedoria', 'Ver as coisas como Deus as vê e saborear o que é do alto.'],
      ['Dom do entendimento', 'Compreender melhor as verdades da fé e a Palavra de Deus.'],
      ['Dom do conselho', 'Saber o que fazer nas decisões difíceis, ouvindo a voz de Deus.'],
      ['Dom da fortaleza', 'Coragem para fazer o bem e perseverar nas provações.'],
      ['Dom da ciência', 'Usar bem as coisas criadas, sem se apegar a elas.'],
      ['Dom da piedade', 'Tratar Deus como Pai e os outros como irmãos.'],
      ['Dom do temor de Deus', 'Respeito amoroso, que tem medo de ofender quem tanto nos ama.'],
      ['Os frutos do Espírito', 'Amor, alegria, paz, paciência, bondade e fidelidade (Gl 5,22). Peça que eles cresçam em você.'],
    ],
  },
  {
    id: 'natal',
    title: 'Novena de Natal',
    when: 'De 16 a 24 de dezembro, preparando a chegada do Menino Jesus.',
    intro:
      'Nove dias para acompanhar Maria e José a caminho de Belém e preparar o coração, como uma manjedoura, para receber Jesus.',
    prayer:
      'Menino Jesus, que vindes a nós na pobreza de Belém, preparai o meu coração para vos receber. Abençoai a minha família e atendei o meu pedido [faça aqui o seu pedido]. Maria e José, ensinai-me a esperar. Pai-Nosso, Ave-Maria, Glória.',
    days: [
      ['A promessa', 'Deus prometeu um Salvador e cumpriu. Agradeça as promessas que Ele já cumpriu na sua vida.'],
      ['O sim de Maria', '"Faça-se em mim segundo a tua palavra." Peça um coração disponível.'],
      ['O silêncio de José', 'José acolheu o plano de Deus sem entender tudo. Peça confiança.'],
      ['A visita a Isabel', 'Maria levou Jesus a quem precisava. Visite ou ligue para alguém hoje.'],
      ['A viagem a Belém', 'Um caminho cansativo, feito com fé. Ofereça os seus cansaços.'],
      ['Não havia lugar', 'Abra espaço para Jesus: o que ocupa demais o seu coração?'],
      ['Os pastores', 'Os simples foram os primeiros a ouvir a boa notícia. Peça humildade.'],
      ['A estrela', 'Os magos seguiram a luz até Jesus. O que guia os seus passos?'],
      ['A noite santa', 'Deus se fez pequeno por amor. Prepare-se para a Missa do Natal.'],
    ],
  },
  {
    id: 'aparecida',
    title: 'Novena a Nossa Senhora Aparecida',
    when: 'De 3 a 11 de outubro, terminando na véspera da festa da Padroeira do Brasil (12/10).',
    intro:
      'Em 1717, três pescadores encontraram no rio Paraíba do Sul a pequena imagem da Imaculada Conceição. Reze pelo Brasil e pelas suas intenções.',
    prayer:
      'Ó Maria Santíssima, Senhora Aparecida, Mãe do Brasil, olhai por mim e pela minha família. Apresentai a Jesus o meu pedido [faça aqui o seu pedido] e protegei o nosso povo. Pai-Nosso, Ave-Maria, Glória.',
    days: [
      ['A rede vazia', 'Os pescadores não pescavam nada. Entregue a Maria o que parece sem saída.'],
      ['O corpo da imagem', 'Primeiro veio o corpo, depois a cabeça: Deus age aos poucos. Peça paciência.'],
      ['A pesca abundante', 'Depois do encontro, as redes se encheram. Agradeça as graças recebidas.'],
      ['Mãe dos pobres', 'Ela apareceu a pescadores simples. Reze pelos que passam necessidade.'],
      ['Mãe das famílias', 'Confie a ela cada pessoa da sua casa.'],
      ['Mãe dos doentes', 'Reze por quem está doente, em casa ou no hospital.'],
      ['Mãe dos que estão longe', 'Reze por quem se afastou de Deus e da Igreja.'],
      ['Mãe do Brasil', 'Reze pelos governantes, pela paz e pela justiça no país.'],
      ['Imaculada Conceição', 'Maria, sem pecado, nos ensina a dizer sim a Deus. Prepare-se para a festa.'],
    ],
  },
  {
    id: 'santo-antonio',
    saint: 'santo-antonio',
    title: 'Novena a Santo Antônio',
    when: 'De 4 a 12 de junho, terminando na véspera da festa (13/06).',
    intro:
      'Santo Antônio, pregador incansável e amigo dos pobres, é invocado para encontrar o que se perdeu, por um bom casamento e pelos necessitados.',
    prayer:
      'Glorioso Santo Antônio, que tanto amastes a Jesus e os pobres, intercedei por mim junto a Deus e alcançai-me a graça que peço [faça aqui o seu pedido]. Ajudai-me a encontrar, acima de tudo, o caminho do céu. Pai-Nosso, Ave-Maria, Glória.',
    days: [
      ['Chamado de Deus', 'Antônio deixou tudo para seguir a Cristo. O que Deus pede de você?'],
      ['Amor à Palavra', 'Ele conhecia a Bíblia de cor. Leia hoje o Evangelho do dia.'],
      ['Pregador da verdade', 'Peça coragem para falar de Deus com amor.'],
      ['Amigo dos pobres', 'O "pão de Santo Antônio" alimenta quem tem fome. Faça uma caridade.'],
      ['O que se perdeu', 'Peça para reencontrar não só objetos, mas a paz e a fé.'],
      ['As famílias', 'Reze pelos casais, pelos noivos e por quem busca um bom casamento.'],
      ['O Menino Jesus nos braços', 'Antônio acolheu Jesus com ternura. Acolha-o na oração.'],
      ['Humildade', 'Mesmo sábio, viveu como um frade simples. Peça um coração humilde.'],
      ['Santo de todo o mundo', 'Agradeça as graças recebidas por sua intercessão.'],
    ],
  },
];

export const getNovena = (id) => novenas.find((n) => n.id === id);
