// Orações tradicionais. Campos opcionais:
//   saint      → slug do santo em src/data/saints.js
//   main       → oração principal do santo
//   intentions → ids de intenções em src/data/saints.js
//   latin      → texto em latim
//   note       → observação exibida junto da oração
//   moments    → ids de momentos do dia (lista abaixo)
const prayers = [
  {
    "id": "sinal-da-cruz",
    "category": "Diárias",
    "title": "Sinal da Cruz",
    "text": "Em nome do Pai, do Filho e do Espírito Santo. Amém.",
    "moments": [
      "manha",
      "noite"
    ]
  },
  {
    "id": "pai-nosso",
    "category": "Diárias",
    "title": "Pai-Nosso",
    "text": "Pai nosso, que estais nos céus, santificado seja o vosso nome; venha a nós o vosso Reino; seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém."
  },
  {
    "id": "gloria-ao-pai",
    "category": "Diárias",
    "title": "Glória ao Pai",
    "text": "Glória ao Pai, e ao Filho, e ao Espírito Santo. Como era no princípio, agora e sempre. Amém."
  },
  {
    "id": "credo",
    "category": "Diárias",
    "title": "Credo (Símbolo dos Apóstolos)",
    "text": "Creio em Deus Pai Todo-Poderoso, Criador do céu e da terra; e em Jesus Cristo, seu único Filho, nosso Senhor; que foi concebido pelo poder do Espírito Santo; nasceu da Virgem Maria; padeceu sob Pôncio Pilatos, foi crucificado, morto e sepultado; desceu à mansão dos mortos; ressuscitou ao terceiro dia; subiu aos Céus, está sentado à direita de Deus Pai Todo-Poderoso, de onde há de vir a julgar os vivos e os mortos. Creio no Espírito Santo, na Santa Igreja Católica, na comunhão dos Santos, na remissão dos pecados, na ressurreição da carne, na vida eterna. Amém."
  },
  {
    "id": "ato-de-contricao",
    "category": "Diárias",
    "title": "Ato de Contrição",
    "text": "Meu Deus, porque sois infinitamente bom e Vos amo de todo o meu coração, pesa-me de Vos ter ofendido, e com o auxílio da Vossa divina graça, proponho firmemente emendar-me e nunca mais Vos tornar a ofender. Peço e espero o perdão das minhas culpas pela Vossa infinita misericórdia. Amém.",
    "moments": [
      "noite"
    ]
  },
  {
    "id": "ato-de-fe",
    "category": "Diárias",
    "title": "Ato de Fé",
    "text": "Meu Deus, creio firmemente em tudo o que revelastes e que a Santa Igreja nos propõe para crer, porque sois a verdade infalível. Nesta fé quero viver e morrer. Amém."
  },
  {
    "id": "ato-de-esperanca",
    "category": "Diárias",
    "title": "Ato de Esperança",
    "text": "Meu Deus, espero com firme confiança que, pelos merecimentos de Jesus Cristo, me dareis a vossa graça neste mundo e, se observar os vossos mandamentos, a felicidade eterna no céu. Amém."
  },
  {
    "id": "ato-de-caridade",
    "category": "Diárias",
    "title": "Ato de Caridade",
    "text": "Meu Deus, amo-Vos de todo o meu coração e sobre todas as coisas, porque sois infinitamente bom e digno de ser amado. Por amor de Vós, amo o meu próximo como a mim mesmo. Amém."
  },
  {
    "id": "oracao-da-manha",
    "category": "Diárias",
    "title": "Oração da Manhã",
    "text": "Senhor, no início deste dia, eu Vos ofereço todos os meus pensamentos, palavras, obras, alegrias e sofrimentos. Concedei-me a graça de fazer em tudo a vossa vontade e de permanecer unido a Vós. Amém.",
    "intentions": [
      "trabalho"
    ],
    "moments": [
      "manha"
    ]
  },
  {
    "id": "oracao-da-noite",
    "category": "Diárias",
    "title": "Oração da Noite",
    "text": "Senhor, ao terminar este dia, agradeço-Vos por todos os benefícios recebidos. Perdoai as faltas que cometi e concedei-me uma noite tranquila sob a vossa proteção. Amém.",
    "intentions": [
      "paz"
    ],
    "moments": [
      "noite"
    ]
  },
  {
    "id": "confissao-penitencial",
    "category": "Diárias",
    "title": "Confissão Penitencial",
    "text": "Confesso a Deus todo-poderoso e a vós, irmãos e irmãs, que pequei muitas vezes por pensamentos e palavras, atos e omissões, por minha culpa, minha tão grande culpa. E peço à Virgem Maria, aos anjos e santos e a vós, irmãos e irmãs, que rogueis por mim a Deus, nosso Senhor. Amém."
  },
  {
    "id": "ave-maria",
    "category": "Marianas",
    "title": "Ave-Maria",
    "text": "Ave Maria, cheia de graça, o Senhor é convosco. Bendita sois vós entre as mulheres, e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós, pecadores, agora e na hora de nossa morte. Amém."
  },
  {
    "id": "salve-rainha",
    "category": "Marianas",
    "title": "Salve-Rainha",
    "text": "Salve, Rainha, mãe de misericórdia, vida, doçura e esperança nossa, salve! A vós bradamos, os degredados filhos de Eva. A vós gemendo e chorando neste vale de lágrimas. Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei, e depois deste desterro, mostrai-nos Jesus, bendito fruto do vosso ventre. Ó clemente, ó piedosa, ó doce sempre Virgem Maria. Rogai por nós, Santa Mãe de Deus, para que sejamos dignos das promessas de Cristo. Amém.",
    "moments": [
      "noite"
    ]
  },
  {
    "id": "angelus",
    "category": "Marianas",
    "title": "Angelus (Ângelus)",
    "text": "V. O Anjo do Senhor anunciou a Maria. R. E ela concebeu do Espírito Santo.\n\nAve Maria...\n\nV. Eis aqui a escrava do Senhor. R. Faça-se em mim segundo a vossa palavra.\n\nAve Maria...\n\nV. E o Verbo se fez carne. R. E habitou entre nós.\n\nAve Maria...\n\nV. Rogai por nós, Santa Mãe de Deus. R. Para que sejamos dignos das promessas de Cristo.\n\nOremos: Infundi, Senhor, nós Vos pedimos, a vossa graça em nossas almas, para que nós, que pela anunciação do Anjo conhecemos a encarnação de Cristo, vosso Filho, por sua paixão e morte na cruz sejamos conduzidos à glória da ressurreição. Pelo mesmo Cristo, nosso Senhor. Amém.",
    "moments": [
      "meio-dia"
    ]
  },
  {
    "id": "magnificat",
    "category": "Marianas",
    "title": "Magnificat",
    "text": "A minha alma engrandece o Senhor, e o meu espírito se alegra em Deus, meu Salvador, porque olhou para a humildade de sua serva. Doravante todas as gerações me chamarão bem-aventurada, porque o Todo-Poderoso fez em mim maravilhas. Santo é o seu nome. Sua misericórdia se estende, de geração em geração, sobre os que o temem. Manifestou o poder de seu braço: dispersou os soberbos. Derrubou os poderosos de seus tronos e exaltou os humildes. Cumulou de bens os famintos e despediu os ricos de mãos vazias. Socorreu Israel, seu servo, lembrando-se de sua misericórdia, conforme prometera a nossos pais, em favor de Abraão e de sua descendência, para sempre."
  },
  {
    "id": "regina-caeli",
    "category": "Marianas",
    "title": "Regina Caeli",
    "text": "Rainha do céu, alegrai-Vos, aleluia. Pois Aquele que merecestes trazer em vosso seio, aleluia, ressuscitou como disse, aleluia. Rogai a Deus por nós, aleluia. Alegrai-Vos e exultai, ó Virgem Maria, aleluia, porque o Senhor ressuscitou verdadeiramente, aleluia.",
    "moments": [
      "meio-dia"
    ]
  },
  {
    "id": "lembrai-vos",
    "category": "Marianas",
    "title": "Lembrai-vos",
    "text": "Lembrai-Vos, ó piedosíssima Virgem Maria, que nunca se ouviu dizer que algum daqueles que têm recorrido à vossa proteção, implorado a vossa assistência e reclamado o vosso socorro, fosse por Vós desamparado. Animado eu, pois, com igual confiança, a Vós, Virgem entre todas singular, como Mãe recorro, de Vós me valho e, gemendo sob o peso dos meus pecados, me prostro a vossos pés. Não desprezeis as minhas súplicas, ó Mãe do Verbo encarnado, mas dignai-Vos de as ouvir propícia e de me alcançar o que Vos rogo. Amém.",
    "intentions": [
      "causas-impossiveis"
    ]
  },
  {
    "id": "a-vossa-protecao",
    "category": "Marianas",
    "title": "À vossa proteção",
    "text": "À vossa proteção recorremos, Santa Mãe de Deus. Não desprezeis as nossas súplicas em nossas necessidades, mas livrai-nos sempre de todos os perigos, ó Virgem gloriosa e bendita. Amém."
  },
  {
    "id": "nossa-senhora-aparecida",
    "category": "Marianas",
    "title": "Nossa Senhora Aparecida",
    "text": "Ó incomparável Senhora da Conceição Aparecida, Mãe de Deus, Rainha dos Anjos, Advogada dos pecadores, refúgio e consolação dos aflitos e atribulados, livrai-nos de tudo o que possa ofender vosso bendito Filho e vosso Imaculado Coração. Dai-nos a graça de viver e morrer sob o manto de vossa proteção. Amém.",
    "intentions": [
      "familia",
      "protecao"
    ]
  },
  {
    "id": "oracao-ao-espirito-santo",
    "category": "Santos",
    "title": "Oração ao Espírito Santo",
    "text": "Vinde, Espírito Santo, enchei os corações dos vossos fiéis e acendei neles o fogo do vosso amor. Enviai o vosso Espírito e tudo será criado, e renovareis a face da terra. Oremos: Ó Deus, que instruístes os corações dos vossos fiéis com a luz do Espírito Santo, fazei que apreciemos retamente todas as coisas segundo o mesmo Espírito e gozemos sempre de sua consolação. Por Cristo, nosso Senhor. Amém.",
    "moments": [
      "estudo"
    ]
  },
  {
    "id": "oracao-de-sao-francisco",
    "category": "Santos",
    "title": "Oração de São Francisco",
    "text": "Senhor, fazei de mim um instrumento da vossa paz. Onde houver ódio, que eu leve o amor. Onde houver ofensa, que eu leve o perdão. Onde houver discórdia, que eu leve a união. Onde houver dúvida, que eu leve a fé. Onde houver erro, que eu leve a verdade. Onde houver desespero, que eu leve a esperança. Onde houver tristeza, que eu leve a alegria. Onde houver trevas, que eu leve a luz.",
    "saint": "sao-francisco",
    "main": true,
    "intentions": [
      "paz"
    ]
  },
  {
    "id": "oracao-ao-anjo-da-guarda",
    "category": "Santos",
    "title": "Oração ao Anjo da Guarda",
    "text": "Santo Anjo do Senhor, meu zeloso guardador, se a ti me confiou a piedade divina, sempre me rege, guarda, governa e ilumina. Amém.",
    "intentions": [
      "protecao"
    ],
    "moments": [
      "manha",
      "noite"
    ]
  },
  {
    "id": "sao-miguel-arcanjo",
    "category": "Santos",
    "title": "São Miguel Arcanjo",
    "text": "São Miguel Arcanjo, defendei-nos no combate, sede o nosso refúgio contra as maldades e ciladas do demônio. Ordene-lhe Deus, instantemente o pedimos; e vós, príncipe da milícia celeste, pelo divino poder, precipitai no inferno a Satanás e aos outros espíritos malignos que andam pelo mundo para perder as almas. Amém.",
    "saint": "sao-miguel",
    "main": true,
    "intentions": [
      "protecao"
    ]
  },
  {
    "id": "sao-jose",
    "category": "Santos",
    "title": "São José",
    "text": "Glorioso São José, pai adotivo de Jesus e castíssimo esposo da Virgem Maria, rogai por nós. Alcançai-nos a graça de viver com fé, pureza e fidelidade, e ajudai-nos a cumprir a vontade de Deus em nossa vida. Amém.",
    "saint": "sao-jose",
    "main": true,
    "intentions": [
      "familia",
      "trabalho"
    ]
  },
  {
    "id": "santo-antonio",
    "category": "Santos",
    "title": "Santo Antônio",
    "text": "Glorioso Santo Antônio, que recebestes de Deus o poder de encontrar as coisas perdidas, ajudai-me a reencontrar a graça de Deus e a viver segundo a sua vontade. Intercedei por mim em minhas necessidades. Amém.",
    "saint": "santo-antonio",
    "main": true,
    "intentions": [
      "coisas-perdidas",
      "relacionamento"
    ]
  },
  {
    "id": "santa-rita-de-cassia",
    "category": "Santos",
    "title": "Santa Rita de Cássia",
    "text": "Ó poderosa Santa Rita, chamada Santa dos impossíveis, advogada dos casos desesperados, socorrei-me nesta aflição. Alcançai-me de Deus a graça de aceitar a sua vontade e de perseverar na fé. Amém.",
    "saint": "santa-rita",
    "main": true,
    "intentions": [
      "causas-impossiveis",
      "familia"
    ]
  },
  {
    "id": "santa-teresinha-do-menino-jesus",
    "category": "Santos",
    "title": "Santa Teresinha do Menino Jesus",
    "text": "Santa Teresinha, que prometestes fazer cair uma chuva de rosas sobre a terra, alcançai-me a simplicidade, a confiança e o amor para seguir Jesus no pequeno caminho de cada dia. Amém.",
    "saint": "santa-teresinha",
    "main": true,
    "intentions": [
      "paz"
    ]
  },
  {
    "id": "sao-carlo-acutis",
    "category": "Santos",
    "title": "Oração a São Carlo Acutis",
    "text": "São Carlo Acutis, que fizestes da Eucaristia a vossa autoestrada para o Céu, ensinai-me a amar Jesus presente no Santíssimo Sacramento e a viver a fé com alegria no meio do mundo de hoje. Ajudai-me a não ser uma cópia de ninguém, mas o original que Deus sonhou para mim. Intercedei pela minha saúde, pelos meus estudos e pelo meu trabalho [faça aqui o seu pedido], para que tudo sirva à glória de Deus. Amém.",
    "saint": "sao-carlo-acutis",
    "main": true,
    "intentions": [
      "saude",
      "trabalho"
    ]
  },
  {
    "id": "sao-carlo-acutis-tecnologia",
    "category": "Santos",
    "title": "Antes de usar a internet e o computador",
    "text": "São Carlo Acutis, que usastes o computador para levar as pessoas até Jesus, ajudai-me a usar a internet e a tecnologia com sabedoria e equilíbrio. Que o meu trabalho diante da tela seja honesto e bem feito, que eu não perca tempo com o que me afasta de Deus e que as minhas palavras nas redes construam e não destruam. Amém.",
    "saint": "sao-carlo-acutis",
    "moments": [
      "estudo"
    ],
    "intentions": [
      "trabalho"
    ]
  },
  {
    "id": "jaculatoria-de-fatima",
    "category": "Sacramentais",
    "title": "Jaculatória de Fátima",
    "text": "Ó meu Jesus, perdoai-nos, livrai-nos do fogo do inferno, levai as almas todas para o Céu, e socorrei principalmente as que mais precisarem. Amém."
  },
  {
    "id": "consagracao-ao-imaculado-coracao",
    "category": "Sacramentais",
    "title": "Consagração ao Imaculado Coração",
    "text": "Ó Maria, Mãe de Deus e nossa Mãe, eu me consagro inteiramente ao vosso Imaculado Coração, com tudo o que sou e o que tenho. Acolhei-me sob a vossa maternal proteção. Guardai-me e defendei-me como coisa e propriedade vossa. Amém."
  },
  {
    "id": "alma-de-cristo",
    "category": "Sacramentais",
    "title": "Alma de Cristo",
    "text": "Alma de Cristo, santificai-me. Corpo de Cristo, salvai-me. Sangue de Cristo, inebriai-me. Água do lado de Cristo, lavai-me. Paixão de Cristo, confortai-me. Ó bom Jesus, ouvi-me. Dentro de vossas chagas, escondi-me. Não permitais que eu me separe de Vós. Do espírito maligno, defendei-me. Na hora da morte, chamai-me e mandai-me ir para Vós, para que, com os vossos santos, Vos louve por todos os séculos dos séculos. Amém."
  },
  {
    "id": "comunhao-espiritual",
    "category": "Sacramentais",
    "title": "Comunhão Espiritual",
    "text": "Meu Jesus, creio que estais realmente presente no Santíssimo Sacramento. Amo-Vos sobre todas as coisas e desejo receber-Vos em minha alma. Já que agora não posso receber-Vos sacramentalmente, vinde ao menos espiritualmente ao meu coração. Abraço-Vos como se já estivésseis comigo e uno-me inteiramente a Vós. Não permitais que eu jamais me separe de Vós. Amém."
  },
  {
    "id": "jesus-eu-confio-em-vos",
    "category": "Sacramentais",
    "title": "Jesus, eu confio em Vós",
    "text": "Jesus, eu confio em Vós.",
    "intentions": [
      "paz"
    ]
  },
  {
    "id": "sagrado-coracao-de-jesus",
    "category": "Sacramentais",
    "title": "Sagrado Coração de Jesus",
    "text": "Sagrado Coração de Jesus, eu confio em Vós. Dai-me um coração semelhante ao vosso: humilde, manso, generoso e fiel. Amém."
  },
  {
    "id": "pelas-almas-do-purgatorio",
    "category": "Sacramentais",
    "title": "Pelas almas do purgatório",
    "text": "Dai-lhes, Senhor, o descanso eterno, e brilhe para elas a vossa luz. Descansem em paz. Amém.",
    "intentions": [
      "boa-morte"
    ]
  },
  {
    "id": "oracao-de-sao-bento",
    "category": "Sacramentais",
    "title": "Oração de São Bento (Vade retro)",
    "text": "A Cruz Sagrada seja a minha luz, não seja o dragão o meu guia. Retira-te, Satanás! Nunca me aconselhes coisas vãs! É mau o que tu me ofereces; bebe tu mesmo os teus venenos.",
    "latin": "Crux sacra sit mihi lux, non draco sit mihi dux. Vade retro, Satana! Numquam suade mihi vana! Sunt mala quae libas, ipse venena bibas.",
    "saint": "sao-bento",
    "main": true,
    "intentions": [
      "protecao"
    ]
  },
  {
    "id": "oferecimento-do-terco",
    "category": "Terço",
    "title": "Oferecimento do Terço",
    "text": "Divino Jesus, nós Vos oferecemos este terço que vamos rezar, meditando nos mistérios da nossa Redenção. Concedei-nos, por intercessão da Virgem Maria, Mãe de Deus e nossa Mãe, as virtudes que nos são necessárias para bem rezá-lo e a graça de ganharmos as indulgências desta santa devoção. <strong>Oferecemos particularmente por [dizer aqui as suas intenções, como a paz no mundo, a familia ou os doentes]</strong>. Amém."
  },
  {
    "id": "a-vos-sao-jose",
    "category": "Santos",
    "title": "A vós, São José (Leão XIII)",
    "text": "A vós, São José, recorremos em nossa tribulação e, depois de ter implorado o auxílio de vossa santíssima Esposa, cheios de confiança solicitamos também o vosso patrocínio. Por esse laço sagrado de caridade que vos uniu à Virgem Imaculada, Mãe de Deus, e pelo amor paternal que tivestes ao Menino Jesus, ardentemente suplicamos que lanceis um olhar benigno para a herança que Jesus Cristo conquistou com seu sangue e nos socorrais em nossas necessidades com o vosso auxílio e poder. Protegei, ó guarda providente da divina Família, o povo eleito de Jesus Cristo. Afastai para longe de nós, ó pai amantíssimo, a peste do erro e do vício. Assisti-nos do alto do céu, ó nosso fortíssimo sustentáculo, na luta contra o poder das trevas; e assim como outrora salvastes da morte a vida ameaçada do Menino Jesus, assim também defendei agora a Santa Igreja de Deus das ciladas de seus inimigos e de toda adversidade. Amparai a cada um de nós com o vosso constante patrocínio, a fim de que, a vosso exemplo e sustentados com o vosso auxílio, possamos viver virtuosamente, piedosamente morrer e obter no céu a eterna bem-aventurança. Amém.",
    "saint": "sao-jose",
    "intentions": [
      "familia",
      "protecao",
      "boa-morte"
    ]
  },
  {
    "id": "oracao-a-sao-bento",
    "category": "Santos",
    "title": "Oração a São Bento",
    "saint": "sao-bento",
    "intentions": [
      "protecao",
      "familia"
    ],
    "note": "Oração de devoção popular; o texto pode variar de uma região para outra.",
    "text": "Ó glorioso patriarca São Bento, que vos mostrastes sempre compassivo com os necessitados, fazei que também nós, recorrendo à vossa poderosa intercessão, obtenhamos auxílio em todas as nossas aflições. Que nas famílias reinem a paz e a tranquilidade; que se afastem de nós todas as desgraças, tanto corporais quanto espirituais, especialmente o pecado. Alcançai do Senhor a graça que vos pedimos [faça aqui o seu pedido] e, ao término de nossa vida terrena, possamos ir louvar a Deus convosco no Paraíso. Amém."
  },
  {
    "id": "oracao-a-sao-rafael",
    "category": "Santos",
    "title": "Oração a São Rafael Arcanjo",
    "saint": "sao-rafael",
    "main": true,
    "intentions": [
      "saude",
      "viagens"
    ],
    "note": "Oração de devoção popular; o texto pode variar de uma região para outra.",
    "text": "Glorioso São Rafael Arcanjo, que acompanhastes o jovem Tobias em sua viagem, livrando-o de todos os perigos, e curastes a cegueira de seu pai, Tobit, sede também o meu guia e companheiro. Protegei-me nos caminhos da vida, curai as enfermidades do meu corpo e da minha alma e ajudai-me a cumprir em tudo a vontade de Deus. Apresentai ao Senhor as minhas orações, vós que estais diante do seu trono. Amém."
  },
  {
    "id": "sao-rafael-encontros",
    "category": "Santos",
    "title": "São Rafael, anjo dos encontros felizes",
    "saint": "sao-rafael",
    "intentions": [
      "relacionamento"
    ],
    "note": "Oração tradicional a São Rafael como padroeiro dos encontros, rezada por quem pede a Deus um(a) companheiro(a).",
    "text": "Ó Rafael, anjo dos encontros felizes, conduzi-nos pela mão ao encontro daqueles que procuramos e daqueles que nos procuram. Que todos os nossos passos sejam guiados pela vossa luz e transfigurados pela vossa alegria.\n\nAnjo guia de Tobias, depositai o pedido que agora vos fazemos aos pés daquele cuja face contemplais sem véu: [faça aqui o seu pedido, como encontrar um(a) companheiro(a) segundo o coração de Deus].\n\nSozinhos e cansados, entristecidos pelas separações e pelas dores da terra, sentimos a necessidade de vos chamar e de pedir a proteção de vossas asas, para que não sejamos estrangeiros na terra da alegria. Lembrai-vos dos fracos, vós que sois forte, vós cuja morada está além das tempestades, numa terra sempre serena e iluminada pela glória de Deus. Amém."
  },
  {
    "id": "responsorio-santo-antonio",
    "category": "Santos",
    "title": "Responsório de Santo Antônio",
    "saint": "santo-antonio",
    "intentions": [
      "coisas-perdidas"
    ],
    "note": "Tradicionalmente rezado para encontrar objetos perdidos.",
    "text": "Se milagres desejais,\nrecorrei a Santo Antônio:\nvereis fugir o demônio\ne as tentações infernais.\n\nRecupera-se o perdido,\nrompe-se a dura prisão,\ne no auge do furacão\ncede o mar embravecido.\n\nTodos os males humanos\nse moderam, se retiram;\ndigam-no aqueles que o viram\ne digam-no os paduanos.\n\nPela sua intercessão\nfoge a peste, o erro, a morte;\no fraco torna-se forte\ne torna-se o enfermo são.\n\nGlória ao Pai, e ao Filho, e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.\n\nV. Rogai por nós, bem-aventurado Santo Antônio.\nR. Para que sejamos dignos das promessas de Cristo."
  },
  {
    "id": "oracao-a-sao-judas-tadeu",
    "category": "Santos",
    "title": "Oração a São Judas Tadeu",
    "saint": "sao-judas-tadeu",
    "main": true,
    "intentions": [
      "causas-impossiveis"
    ],
    "text": "Ó glorioso Apóstolo São Judas Tadeu, servo fiel e amigo de Jesus! O nome do traidor fez com que muitos vos esquecessem, mas a Igreja vos honra e invoca como padroeiro dos casos difíceis e desesperados. Rogai por mim, que estou tão aflito. Fazei uso, eu vos peço, do privilégio que vos foi concedido de socorrer visível e prontamente onde quase não há esperança. Vinde em meu auxílio nesta grande necessidade, para que eu receba as consolações e o socorro do Céu em todas as minhas aflições, tribulações e sofrimentos, particularmente [faça aqui o seu pedido], e para que eu possa bendizer a Deus convosco e com todos os eleitos por toda a eternidade. Prometo, ó bendito São Judas, lembrar-me sempre deste grande favor e nunca deixar de vos honrar como meu especial e poderoso padroeiro. Amém."
  },
  {
    "id": "oracao-a-santa-luzia",
    "category": "Santos",
    "title": "Oração a Santa Luzia",
    "saint": "santa-luzia",
    "main": true,
    "intentions": [
      "saude"
    ],
    "note": "Oração de devoção popular; o texto pode variar de uma região para outra.",
    "text": "Ó Santa Luzia, que preferistes perder a vida a negar a vossa fé em Jesus Cristo, alcançai-nos de Deus a graça de conservar sãos os olhos do corpo e, mais ainda, os olhos da alma, para que vejamos sempre a luz da verdade. Protegei a nossa visão e curai os nossos olhos [faça aqui o seu pedido], para que, livres de todo mal, possamos um dia contemplar a luz eterna no Céu. Santa Luzia, rogai por nós. Amém."
  },
  {
    "id": "bencao-de-sao-bras",
    "category": "Santos",
    "title": "Bênção de São Brás",
    "saint": "sao-bras",
    "main": true,
    "intentions": [
      "saude"
    ],
    "note": "Fórmula da bênção da garganta dada pelo sacerdote no dia 3 de fevereiro, com duas velas cruzadas. Fora da celebração, pode ser rezada como oração pessoal.",
    "text": "Por intercessão de São Brás, bispo e mártir, livre-te Deus do mal da garganta e de qualquer outra doença. Em nome do Pai, e do Filho e do Espírito Santo. Amém."
  },
  {
    "id": "oferecimento-do-dia",
    "category": "Diárias",
    "title": "Oferecimento do dia",
    "moments": [
      "manha"
    ],
    "intentions": [
      "trabalho"
    ],
    "note": "Oração tradicional do Apostolado da Oração (Rede Mundial de Oração do Papa).",
    "text": "Ó Jesus, pelo Coração Imaculado de Maria, eu vos ofereço as orações, obras, alegrias e sofrimentos deste dia, em reparação de nossas ofensas e por todas as intenções pelas quais vos ofereceis continuamente sobre o altar. Eu vo-los ofereço, em particular, pelas intenções do Santo Padre para este mês. Amém."
  },
  {
    "id": "bencao-da-mesa",
    "category": "Diárias",
    "title": "Bênção da mesa (antes das refeições)",
    "moments": [
      "refeicoes"
    ],
    "intentions": [
      "familia"
    ],
    "text": "Abençoai-nos, Senhor, e a estes dons que, da vossa bondade, vamos receber. Por Cristo, nosso Senhor. Amém."
  },
  {
    "id": "acao-de-gracas-refeicao",
    "category": "Diárias",
    "title": "Ação de graças (depois das refeições)",
    "moments": [
      "refeicoes"
    ],
    "intentions": [
      "familia"
    ],
    "text": "Nós vos damos graças, Deus todo-poderoso, por todos os vossos benefícios, vós que viveis e reinais para sempre. Amém.\n\nV. Que as almas dos fiéis defuntos, pela misericórdia de Deus, descansem em paz.\nR. Amém."
  },
  {
    "id": "oracao-antes-de-dormir",
    "category": "Diárias",
    "title": "Antes de dormir (Completas)",
    "moments": [
      "noite"
    ],
    "intentions": [
      "paz",
      "protecao"
    ],
    "note": "Trechos da Completas, a última oração do dia na Liturgia das Horas.",
    "text": "Em vossas mãos, Senhor, entrego o meu espírito.\n\nProtegei-nos, Senhor, enquanto velamos; guardai-nos enquanto dormimos, para que velemos com Cristo e descansemos em paz.\n\nVisitai, Senhor, esta casa e afastai dela as ciladas do inimigo. Que os vossos santos anjos nela habitem e nos guardem em paz, e que a vossa bênção permaneça sempre sobre nós. Por Cristo, nosso Senhor. Amém.\n\nO Senhor todo-poderoso nos conceda uma noite tranquila e, no fim da vida, uma morte santa. Amém."
  },
  {
    "id": "exame-de-consciencia",
    "category": "Diárias",
    "title": "Exame de consciência da noite",
    "moments": [
      "noite"
    ],
    "intentions": [
      "paz"
    ],
    "note": "Pequeno roteiro inspirado no exame de Santo Inácio de Loyola. Termine com o Ato de Contrição.",
    "text": "1. Coloque-se na presença de Deus e agradeça pelos dons recebidos hoje.\n2. Peça a luz do Espírito Santo para ver o seu dia com sinceridade.\n3. Repasse o dia: onde você amou a Deus e ao próximo? Onde falhou?\n4. Peça perdão pelas faltas, com confiança na misericórdia de Deus.\n5. Faça um propósito concreto para amanhã."
  },
  {
    "id": "antes-de-estudar",
    "category": "Diárias",
    "title": "Antes de estudar ou trabalhar",
    "moments": [
      "estudo"
    ],
    "intentions": [
      "trabalho"
    ],
    "text": "Senhor, Pai de bondade, ao começar este estudo (ou trabalho), eu vos ofereço o meu esforço. Iluminai a minha inteligência com a luz do Espírito Santo, dai-me atenção, memória e perseverança, e fazei que tudo o que eu aprender e realizar sirva para a vossa glória e para o bem dos meus irmãos. Por Cristo, nosso Senhor. Amém.\n\nSede da Sabedoria, rogai por nós.\nSanto Tomás de Aquino, rogai por nós."
  },
];

// Momentos do dia para o filtro "Quando rezar?".
export const moments = [
  { id: 'manha', label: 'Ao acordar' },
  { id: 'meio-dia', label: 'Ao meio-dia (Ângelus)' },
  { id: 'refeicoes', label: 'Antes e depois das refeições' },
  { id: 'estudo', label: 'Antes de estudar ou trabalhar' },
  { id: 'noite', label: 'Antes de dormir' },
];

export { prayers };
