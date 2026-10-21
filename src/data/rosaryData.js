import { mysteriesData } from './mysteries';
import { prayers } from './prayers';

const prayerText = (id) => prayers.find((p) => p.id === id)?.text ?? '';

export const SIGN_OF_THE_CROSS = 'Em nome do Pai, do Filho e do Espírito Santo. Amém.';

export const HOLY_SPIRIT_INVOCATION = `Vinde, Espírito Santo, enchei os corações dos vossos fiéis e acendei neles o fogo do vosso amor.
V. Enviai o vosso Espírito e tudo será criado.
R. E renovareis a face da terra.

Oremos: Ó Deus, que instruístes os corações dos vossos fiéis com a luz do Espírito Santo, fazei que apreciemos retamente todas as coisas segundo o mesmo Espírito e gozemos sempre de sua consolação. Por Cristo, nosso Senhor. Amém.`;

export const OUR_FATHER = 'Pai nosso, que estais nos céus, santificado seja o vosso nome; venha a nós o vosso Reino; seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.';

export const GLORY_BE = 'Glória ao Pai, e ao Filho, e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.';

export const FATIMA_PRAYER = 'Ó meu Jesus, perdoai-nos, livrai-nos do fogo do inferno, levai as almas todas para o Céu e socorrei principalmente as que mais precisarem.';

export const THANKSGIVING = 'Infinitas graças vos damos, soberana Rainha, pelos benefícios que todos os dias recebemos de vossas mãos liberais. Dignai-vos, agora e para sempre, tomar-nos debaixo do vosso poderoso amparo e, para mais vos obrigar, vos saudamos com uma Salve-Rainha.';

export const HAIL_HOLY_QUEEN = 'Salve, Rainha, mãe de misericórdia, vida, doçura e esperança nossa, salve! A vós bradamos, os degredados filhos de Eva. A vós suspiramos, gemendo e chorando neste vale de lágrimas. Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei, e depois deste desterro, mostrai-nos Jesus, bendito fruto do vosso ventre. Ó clemente, ó piedosa, ó doce sempre Virgem Maria. Rogai por nós, Santa Mãe de Deus, para que sejamos dignos das promessas de Cristo. Amém.';

// Agradecimento pessoal ao terminar as dezenas, antes do "Infinitas graças".
export const ROSARY_THANKS = 'Senhor, obrigado pela graça de ter rezado este terço e por todos os benefícios que recebi de Vós. Coloco nas mãos de Nossa Senhora cada intenção que apresentei hoje, confiando que ela as levará até Vós. Amém.';

export const ORDINAL_WORDS = ['primeiro', 'segundo', 'terceiro', 'quarto', 'quinto'];

/** Orações que podem ser rezadas depois da Salve-Rainha (todas opcionais). */
export const closingPrayers = [
  {
    id: 'oracao-rosario',
    title: 'Oração do Rosário',
    description: 'Oração da Igreja que costuma concluir o terço.',
    text: 'Oremos: Ó Deus, cujo Filho Unigênito, por sua vida, morte e ressurreição, nos alcançou o prêmio da salvação eterna, concedei-nos, nós vos pedimos, que, meditando estes mistérios no sacratíssimo Rosário da bem-aventurada Virgem Maria, imitemos o que contêm e alcancemos o que prometem. Pelo mesmo Cristo, nosso Senhor. Amém.',
  },
  {
    id: 'ladainha',
    title: 'Ladainha de Nossa Senhora',
    description: 'Ladainha Lauretana, com as invocações acrescentadas pelos últimos papas.',
    text: `Senhor, tende piedade de nós.
Jesus Cristo, tende piedade de nós.
Senhor, tende piedade de nós.
Jesus Cristo, ouvi-nos.
Jesus Cristo, atendei-nos.

Deus Pai do Céu, tende piedade de nós.
Deus Filho, Redentor do mundo, tende piedade de nós.
Deus Espírito Santo, tende piedade de nós.
Santíssima Trindade, que sois um só Deus, tende piedade de nós.

(A cada invocação, responde-se: rogai por nós.)
Santa Maria,
Santa Mãe de Deus,
Santa Virgem das virgens,
Mãe de Cristo,
Mãe da Igreja,
Mãe de misericórdia,
Mãe da divina graça,
Mãe da esperança,
Mãe puríssima,
Mãe castíssima,
Mãe sempre virgem,
Mãe imaculada,
Mãe amável,
Mãe admirável,
Mãe do bom conselho,
Mãe do Criador,
Mãe do Salvador,
Virgem prudentíssima,
Virgem venerável,
Virgem louvável,
Virgem poderosa,
Virgem clemente,
Virgem fiel,
Espelho de justiça,
Sede da sabedoria,
Causa da nossa alegria,
Vaso espiritual,
Vaso honorífico,
Vaso insigne de devoção,
Rosa mística,
Torre de Davi,
Torre de marfim,
Casa de ouro,
Arca da aliança,
Porta do céu,
Estrela da manhã,
Saúde dos enfermos,
Refúgio dos pecadores,
Conforto dos migrantes,
Consoladora dos aflitos,
Auxílio dos cristãos,
Rainha dos Anjos,
Rainha dos Patriarcas,
Rainha dos Profetas,
Rainha dos Apóstolos,
Rainha dos Mártires,
Rainha dos Confessores,
Rainha das Virgens,
Rainha de todos os Santos,
Rainha concebida sem pecado original,
Rainha assunta ao céu,
Rainha do sacratíssimo Rosário,
Rainha da família,
Rainha da paz.

Cordeiro de Deus, que tirais o pecado do mundo, perdoai-nos, Senhor.
Cordeiro de Deus, que tirais o pecado do mundo, ouvi-nos, Senhor.
Cordeiro de Deus, que tirais o pecado do mundo, tende piedade de nós.

V. Rogai por nós, Santa Mãe de Deus.
R. Para que sejamos dignos das promessas de Cristo.

Oremos: Senhor Deus, nós vos suplicamos que concedais aos vossos servos perpétua saúde de alma e de corpo; e que, pela gloriosa intercessão da bem-aventurada sempre Virgem Maria, sejamos livres da presente tristeza e gozemos da eterna alegria. Por Cristo, nosso Senhor. Amém.`,
  },
  {
    id: 'sao-miguel',
    title: 'Oração a São Miguel Arcanjo',
    description: 'Composta pelo Papa Leão XIII, pede proteção no combate espiritual.',
    text: prayerText('sao-miguel-arcanjo'),
  },
  {
    id: 'sao-jose',
    title: 'A vós, São José',
    description: 'Oração de Leão XIII, tradicionalmente rezada no mês do Rosário (outubro).',
    text: prayerText('a-vos-sao-jose'),
  },
  {
    id: 'lembrai-vos',
    title: 'Lembrai-vos (Memorare)',
    description: 'Súplica confiante à intercessão de Nossa Senhora.',
    text: prayerText('lembrai-vos'),
  },
  {
    id: 'sub-tuum',
    title: 'À vossa proteção',
    description: 'A oração mariana mais antiga que se conhece (século III).',
    text: prayerText('a-vossa-protecao'),
  },
  {
    id: 'santo-padre',
    title: 'Pelas intenções do Santo Padre',
    description: 'Uma das condições para lucrar a indulgência plenária do terço.',
    text: `Reze 1 Pai-Nosso, 1 Ave-Maria e 1 Glória ao Pai pelas intenções do Papa.

A Igreja concede indulgência plenária a quem reza o terço em uma igreja ou oratório, ou em família, comunidade religiosa ou associação de fiéis, cumprindo as condições habituais: confissão sacramental, comunhão eucarística, oração pelas intenções do Sumo Pontífice e desapego de todo pecado, mesmo venial.`,
  },
  {
    id: 'sinal-final',
    title: 'Sinal da Cruz final',
    description: 'Encerre a oração como começou.',
    text: SIGN_OF_THE_CROSS,
  },
];

export const traditionalRosaryData = {
  id: 'tradicional',
  title: 'Terço Tradicional de Nossa Senhora',
  introduction: 'O Santo Terço é uma contemplação dos mistérios da salvação através da oração vocal e mental, recomendada pela Virgem Maria em diversas aparições.',
  mysteriesList: mysteriesData,
  // Resumo do roteiro em três momentos, exibido antes do passo a passo.
  practicalStructure: [
    {
      id: 'inicio',
      title: 'Início',
      prayers: 'Sinal da Cruz, Creio, Pai Nosso e 3 Ave-Marias',
      text: 'Faça o oferecimento geral do terço e mencione os seus principais agradecimentos.',
    },
    {
      id: 'dezenas',
      title: 'Nas dezenas',
      prayers: 'Da 1ª à 5ª dezena',
      text: 'Antes de cada Pai Nosso, anuncie o mistério do dia e acrescente um pedido ou oferecimento específico para aquela dezena.',
    },
    {
      id: 'final',
      title: 'No final',
      prayers: 'Agradecimento final e Salve-Rainha',
      text: 'Agradeça a oportunidade de ter rezado e confie as suas intenções às mãos de Nossa Senhora.',
    },
  ],
  steps: [
    {
      id: 'step-1',
      bead: 'Cruz',
      beadBadge: 'Início',
      action: 'Sinal da Cruz e Invocação do Espírito Santo',
      summary: 'Faça o Sinal da Cruz e peça ao Espírito Santo que ilumine a sua oração.',
      prayerText: `Sinal da Cruz:\n${SIGN_OF_THE_CROSS}\n\nInvocação do Espírito Santo:\n${HOLY_SPIRIT_INVOCATION}`,
    },
    {
      id: 'step-2',
      bead: 'Cruz',
      beadBadge: 'Oferecimento',
      action: 'Oferecimento geral e agradecimentos',
      summary: 'Ofereça o terço, apresente suas intenções gerais e agradeça as principais graças que recebeu.',
      prayerText: 'Divino Jesus, nós Vos oferecemos este terço que vamos rezar, meditando nos mistérios da nossa Redenção. Concedei-nos, por intercessão da Virgem Maria, Mãe de Deus e nossa Mãe, as virtudes que nos são necessárias para bem rezá-lo e a graça de ganharmos as indulgências desta santa devoção. Oferecemos particularmente por [suas intenções: a paz no mundo, a família, os doentes...].\n\nAgradecemos também por [as graças que você recebeu: a saúde, o trabalho, uma oração atendida...]. Amém.',
    },
    {
      id: 'step-3',
      bead: 'Cruz',
      beadBadge: 'Credo',
      action: 'Creio (Símbolo dos Apóstolos)',
      summary: 'Segurando o crucifixo, professe a fé católica recitando o Credo.',
      prayerText: 'Creio em Deus Pai Todo-Poderoso, Criador do céu e da terra; e em Jesus Cristo, seu único Filho, nosso Senhor; que foi concebido pelo poder do Espírito Santo; nasceu da Virgem Maria; padeceu sob Pôncio Pilatos, foi crucificado, morto e sepultado; desceu à mansão dos mortos; ressuscitou ao terceiro dia; subiu aos Céus, está sentado à direita de Deus Pai Todo-Poderoso, de onde há de vir a julgar os vivos e os mortos. Creio no Espírito Santo, na Santa Igreja Católica, na comunhão dos Santos, na remissão dos pecados, na ressurreição da carne, na vida eterna. Amém.',
    },
    {
      id: 'step-4',
      bead: 'Conta Grande',
      beadBadge: 'Pai Nosso',
      action: 'Pai Nosso inicial',
      summary: 'Na primeira conta grande logo após a cruz, reze 1 Pai Nosso.',
      prayerText: OUR_FATHER,
    },
    {
      id: 'step-5',
      bead: 'Contas Pequenas (3x)',
      beadBadge: 'Ave Maria',
      action: 'Três Ave-Marias',
      summary: 'Nas três contas pequenas seguintes, reze uma Ave-Maria em cada uma pedindo o aumento da Fé, Esperança e Caridade.',
      prayerText: '1. Pelo aumento da Fé\n2. Pelo aumento da Esperança\n3. Pelo aumento da Caridade\n\nAve Maria, cheia de graça, o Senhor é convosco. Bendita sois vós entre as mulheres, e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós, pecadores, agora e na hora de nossa morte. Amém.',
    },
    {
      id: 'step-6',
      bead: 'Espaço / Conta',
      beadBadge: 'Glória',
      action: 'Glória ao Pai',
      summary: 'Depois das três Ave-Marias, reze o Glória ao Pai.',
      prayerText: GLORY_BE,
    },
    {
      id: 'step-7',
      bead: 'Medalha / Dezenas (5x)',
      beadBadge: 'Meditação',
      action: 'Anúncio dos Mistérios e as 5 Dezenas',
      summary: 'Em cada uma das 5 dezenas: anuncie o mistério e faça um pedido ou oferecimento para aquela dezena; depois reze 1 Pai Nosso, 10 Ave-Marias, 1 Glória ao Pai e a Jaculatória de Fátima.',
      showMysteries: true,
      prayerText: `Para cada uma das 5 dezenas:\n\n1. Anuncie o mistério contemplado e apresente um pedido ou oferecimento só para aquela dezena (ex.: "Ofereço esta dezena pela saúde da minha mãe").\n2. Reze 1 Pai Nosso (na conta grande).\n3. Reze 10 Ave-Marias (nas 10 contas pequenas).\n4. Reze 1 Glória ao Pai.\n5. Reze a Jaculatória de Fátima: "${FATIMA_PRAYER}"`,
    },
    {
      id: 'step-8',
      bead: 'Medalha / Fecho',
      beadBadge: 'Encerramento',
      action: 'Agradecimento final e Salve-Rainha',
      summary: 'Ao concluir as 5 dezenas, agradeça a oportunidade de ter rezado, confie suas intenções às mãos de Nossa Senhora e reze a Salve-Rainha.',
      prayerText: `Agradecimento do terço:\n${ROSARY_THANKS}\n\nInfinitas graças:\n${THANKSGIVING}\n\nSalve-Rainha:\n${HAIL_HOLY_QUEEN}`,
    },
  ],
};

export const nordicRosaryData = {
  id: 'nordico',
  title: 'Rosário Nórdico (Rosário das Cláusulas)',
  introduction: 'Tradição meditativa originária do norte da Europa em que uma frase de contemplação bíblica (cláusula) é inserida no meio de cada Ave-Maria após o nome de Jesus.',
  mysteriesList: mysteriesData,
};
