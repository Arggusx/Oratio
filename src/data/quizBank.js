// Quiz das ilhas: no caminho de cada trilha há paradas de quiz do assunto da ilha, que ficam mais difíceis
// (fácil, médio, difícil e um desafio final). Também há o desafio aleatório, que mistura os assuntos.
// Em cada pergunta, "a" é a resposta certa e "w" são as erradas; o jogo embaralha a ordem das perguntas e das
// alternativas a cada partida. "why" aparece depois da resposta, acertando ou não.

export const LEVELS = [
  { id: 1, title: 'Quiz fácil', icon: 'pergunta', size: 4, pass: 3 },
  { id: 2, title: 'Quiz médio', icon: 'pergunta', size: 4, pass: 3 },
  { id: 3, title: 'Quiz difícil', icon: 'pergunta', size: 4, pass: 3 },
  { id: 4, title: 'Desafio final', icon: 'coroa', size: 6, pass: 5, mixed: true },
];

// Assuntos do banco, ligados às ilhas das trilhas (campo quizTopic em data/trails.js).
export const QUIZ_TOPICS = [
  { id: 'missa', label: 'Missa' },
  { id: 'biblia', label: 'Bíblia' },
  { id: 'maria', label: 'Maria' },
  { id: 'santos', label: 'Santos' },
  { id: 'simbolos', label: 'Símbolos' },
  { id: 'fe', label: 'Sacramentos e fé' },
];

export const quizBank = [
  // ── Missa ──
  { topic: 'missa', level: 1, q: 'Qual é a cor litúrgica do Tempo Comum?', a: 'Verde', w: ['Roxo', 'Branco', 'Vermelho'], why: 'O verde lembra a esperança e o crescimento. O roxo é do Advento e da Quaresma; o branco, do Natal e da Páscoa.' },
  { topic: 'missa', level: 1, q: 'Qual é o momento mais importante da Missa?', a: 'A consagração', w: ['O ofertório', 'A homilia', 'O abraço da paz'], why: 'Na consagração, o pão e o vinho se tornam o Corpo e o Sangue de Cristo. Por isso muitos se ajoelham.' },
  { topic: 'missa', level: 1, q: 'Aos domingos, quantas leituras há na Missa, sem contar o salmo?', a: 'Três', w: ['Uma', 'Duas', 'Quatro'], why: 'Uma do Antigo Testamento, uma das cartas dos apóstolos e o Evangelho, com o salmo entre a primeira e a segunda.' },
  { topic: 'missa', level: 1, q: 'Quanto tempo de jejum a Igreja pede antes de comungar?', a: 'Uma hora', w: ['Três horas', 'Desde a meia-noite', 'Não há jejum'], why: 'Uma hora sem comer nem beber, exceto água e remédios. Idosos e doentes estão dispensados.' },
  { topic: 'missa', level: 2, q: 'Diante de quem se faz a genuflexão (o joelho direito no chão)?', a: 'Do Santíssimo Sacramento no sacrário', w: ['Do altar', 'Do padre', 'Da imagem do padroeiro'], why: 'A genuflexão é adoração a Jesus presente na Eucaristia. Diante do altar faz-se uma inclinação profunda.' },
  { topic: 'missa', level: 2, q: 'De onde vem a palavra "Missa"?', a: 'Do latim "missio", envio', w: ['Do grego "mysterion", mistério', 'Do latim "mensa", mesa', 'Do hebraico "mishná", ensino'], why: 'Vem do envio final, "Ite, missa est": a Missa termina mandando os fiéis em missão.' },
  { topic: 'missa', level: 2, q: 'Qual cor o padre usa no domingo de Pentecostes?', a: 'Vermelho', w: ['Branco', 'Verde', 'Dourado'], why: 'O vermelho lembra o fogo do Espírito Santo. Também é usado na Paixão e nas festas dos mártires.' },
  { topic: 'missa', level: 2, q: 'Quem proclama o Evangelho na Missa?', a: 'O diácono ou o padre', w: ['Qualquer leitor', 'O coral', 'O ministro da Eucaristia'], why: 'O Evangelho é reservado ao ministro ordenado: o diácono, ou o padre quando não há diácono.' },
  { topic: 'missa', level: 3, q: 'Em que domingos se pode usar a cor rosa?', a: 'No 3º do Advento e no 4º da Quaresma', w: ['No Natal e na Páscoa', 'Em todas as festas de Maria', 'No 1º domingo de cada mês'], why: 'São os domingos Gaudete e Laetare, de alegria no meio do tempo de preparação.' },
  { topic: 'missa', level: 3, q: 'Em que língua está o "Kyrie eleison" (Senhor, tende piedade)?', a: 'Grego', w: ['Latim', 'Hebraico', 'Aramaico'], why: 'É uma das poucas expressões em grego que ficaram na Missa romana, lembrança das primeiras comunidades.' },
  { topic: 'missa', level: 3, q: 'Como se chama o hino "Santo, Santo, Santo"?', a: 'Sanctus', w: ['Agnus Dei', 'Gloria', 'Kyrie'], why: 'O Sanctus encerra o Prefácio e une a assembleia ao canto dos anjos (Is 6,3).' },
  { topic: 'missa', level: 3, q: 'O que é a epiclese?', a: 'A invocação do Espírito Santo sobre as ofertas', w: ['A oração depois da comunhão', 'O beijo do padre no altar', 'A bênção final'], why: 'Na epiclese, o padre estende as mãos sobre o pão e o vinho e pede que o Espírito Santo os santifique.' },

  // ── Bíblia ──
  { topic: 'biblia', level: 1, q: 'Quantos livros tem a Bíblia católica?', a: '73', w: ['66', '72', '81'], why: '46 no Antigo Testamento e 27 no Novo. A protestante tem 66 porque não inclui sete livros.' },
  { topic: 'biblia', level: 1, q: 'Qual é o primeiro livro da Bíblia?', a: 'Gênesis', w: ['Êxodo', 'Salmos', 'Mateus'], why: 'Gênesis quer dizer "origem": conta a criação e a história dos patriarcas.' },
  { topic: 'biblia', level: 1, q: 'Quantos são os Evangelhos?', a: 'Quatro', w: ['Três', 'Cinco', 'Doze'], why: 'Mateus, Marcos, Lucas e João.' },
  { topic: 'biblia', level: 1, q: 'Quem construiu a arca para se salvar do dilúvio?', a: 'Noé', w: ['Moisés', 'Abraão', 'Davi'], why: 'Deus mandou Noé construir a arca para salvar a sua família e os animais (Gn 6–9).' },
  { topic: 'biblia', level: 2, q: 'Quantos livros tem o Novo Testamento?', a: '27', w: ['22', '30', '46'], why: 'Os 4 Evangelhos, Atos, 21 cartas e o Apocalipse.' },
  { topic: 'biblia', level: 2, q: 'Quem escreveu a maior parte das cartas do Novo Testamento?', a: 'São Paulo', w: ['São Pedro', 'São João', 'São Tiago'], why: 'Treze cartas levam o nome de Paulo, como Romanos, Coríntios e Gálatas.' },
  { topic: 'biblia', level: 2, q: 'Qual Evangelho começa com "No princípio era o Verbo"?', a: 'João', w: ['Mateus', 'Marcos', 'Lucas'], why: 'O prólogo de João (Jo 1,1-18) apresenta Jesus como a Palavra eterna de Deus que se fez carne.' },
  { topic: 'biblia', level: 2, q: 'Qual livro tem 150 capítulos?', a: 'Salmos', w: ['Isaías', 'Gênesis', 'Provérbios'], why: 'Os 150 salmos são as orações cantadas de Israel e da Igreja.' },
  { topic: 'biblia', level: 3, q: 'Qual destes livros está na Bíblia católica, mas não na protestante?', a: 'Tobias', w: ['Rute', 'Jó', 'Lamentações'], why: 'Tobias, Judite, Sabedoria, Eclesiástico, Baruc e os dois de Macabeus são os deuterocanônicos.' },
  { topic: 'biblia', level: 3, q: 'Em que língua foi escrita a maior parte do Antigo Testamento?', a: 'Hebraico', w: ['Grego', 'Latim', 'Aramaico'], why: 'A maior parte está em hebraico; alguns trechos em aramaico e alguns livros em grego.' },
  { topic: 'biblia', level: 3, q: 'Qual profeta anunciou "A virgem conceberá e dará à luz um filho"?', a: 'Isaías', w: ['Jeremias', 'Ezequiel', 'Daniel'], why: 'Is 7,14, citada por Mateus ao contar o nascimento de Jesus (Mt 1,23).' },
  { topic: 'biblia', level: 3, q: 'Por quantos anos o povo de Israel andou no deserto?', a: '40', w: ['7', '12', '70'], why: 'Quarenta anos, entre a saída do Egito e a entrada na Terra Prometida. Por isso a Quaresma tem 40 dias.' },

  // ── Maria ──
  { topic: 'maria', level: 1, q: 'Quantas Ave-Marias se rezam em cada dezena do terço?', a: 'Dez', w: ['Cinco', 'Sete', 'Doze'], why: 'Cada dezena tem um Pai-Nosso, dez Ave-Marias e um Glória.' },
  { topic: 'maria', level: 1, q: 'Como se chamava a mãe de Nossa Senhora?', a: 'Sant’Ana', w: ['Santa Isabel', 'Santa Marta', 'Santa Mônica'], why: 'A tradição chama os pais de Maria de Joaquim e Ana, avós de Jesus (festa em 26 de julho).' },
  { topic: 'maria', level: 1, q: 'Onde Nossa Senhora apareceu aos três pastorinhos em 1917?', a: 'Fátima', w: ['Lourdes', 'Guadalupe', 'Aparecida'], why: 'Em Fátima, Portugal, a Lúcia, Francisco e Jacinta, pedindo oração e o terço pela paz.' },
  { topic: 'maria', level: 1, q: 'Qual anjo anunciou a Maria que ela seria a Mãe de Jesus?', a: 'Gabriel', w: ['Miguel', 'Rafael', 'Uriel'], why: 'O anjo Gabriel foi enviado a Nazaré (Lc 1,26-38).' },
  { topic: 'maria', level: 2, q: 'Quantos são os dogmas sobre Maria?', a: 'Quatro', w: ['Dois', 'Três', 'Sete'], why: 'Mãe de Deus, Virgindade perpétua, Imaculada Conceição e Assunção.' },
  { topic: 'maria', level: 2, q: 'Quem viu Nossa Senhora em Lourdes, em 1858?', a: 'Santa Bernadette', w: ['Santa Teresinha', 'Lúcia de Fátima', 'Santa Catarina Labouré'], why: 'Bernadette Soubirous, uma jovem pobre que viu a "Imaculada Conceição" na gruta de Massabielle.' },
  { topic: 'maria', level: 2, q: 'A quem Nossa Senhora de Guadalupe apareceu, em 1531?', a: 'São Juan Diego', w: ['São Francisco', 'Santo Antônio', 'São José de Anchieta'], why: 'Ao indígena Juan Diego, no México. Sua imagem ficou estampada na tilma (manto) dele.' },
  { topic: 'maria', level: 2, q: 'Em que dia se celebra a Imaculada Conceição?', a: '8 de dezembro', w: ['15 de agosto', '12 de outubro', '1º de janeiro'], why: 'Em 8 de dezembro. O 15 de agosto é a Assunção; o 12 de outubro, Aparecida; o 1º de janeiro, Santa Maria Mãe de Deus.' },
  { topic: 'maria', level: 3, q: 'Qual papa definiu o dogma da Assunção, em 1950?', a: 'Pio XII', w: ['Pio IX', 'João XXIII', 'Leão XIII'], why: 'Pio XII, na constituição Munificentissimus Deus, em 1º de novembro de 1950.' },
  { topic: 'maria', level: 3, q: 'Qual concílio proclamou Maria Mãe de Deus (Theotokos)?', a: 'Éfeso, em 431', w: ['Niceia, em 325', 'Trento, em 1545', 'Vaticano II, em 1962'], why: 'O Concílio de Éfeso afirmou que Jesus é uma só pessoa, Deus e homem; por isso Maria é Mãe de Deus.' },
  { topic: 'maria', level: 3, q: 'Em qual Evangelho está o Magnificat?', a: 'Lucas', w: ['Mateus', 'Marcos', 'João'], why: 'Lc 1,46-55: "A minha alma engrandece o Senhor", o canto de Maria na visita a Isabel.' },
  { topic: 'maria', level: 3, q: 'Em que ano foi definido o dogma da Imaculada Conceição?', a: '1854', w: ['1858', '1917', '1950'], why: 'Pio IX, em 1854. Quatro anos depois, em Lourdes, Maria se apresentou como a Imaculada Conceição.' },

  // ── Santos ──
  { topic: 'santos', level: 1, q: 'Qual santo é invocado para encontrar objetos perdidos?', a: 'Santo Antônio', w: ['São Bento', 'São Francisco', 'São Jorge'], why: 'Conta-se que um noviço devolveu o livro que tinha levado de Santo Antônio depois que o santo rezou.' },
  { topic: 'santos', level: 1, q: 'Quem é a padroeira do Brasil?', a: 'Nossa Senhora Aparecida', w: ['Santa Rita', 'Santa Teresinha', 'Nossa Senhora de Fátima'], why: 'A imagem foi encontrada no rio Paraíba do Sul em 1717. A festa é em 12 de outubro.' },
  { topic: 'santos', level: 1, q: 'Quem foi o primeiro Papa?', a: 'São Pedro', w: ['São Paulo', 'São João', 'São Tiago'], why: 'Jesus disse: "Tu és Pedro, e sobre esta pedra edificarei a minha Igreja" (Mt 16,18).' },
  { topic: 'santos', level: 1, q: 'Qual santo é lembrado pelo amor à natureza e aos animais?', a: 'São Francisco de Assis', w: ['São Domingos', 'São Bento', 'São Pio'], why: 'Francisco chamava as criaturas de irmãos e escreveu o Cântico das Criaturas.' },
  { topic: 'santos', level: 2, q: 'Quem montou uma exposição sobre os milagres eucarísticos do mundo?', a: 'São Carlo Acutis', w: ['São João Paulo II', 'Santa Teresinha', 'São Pio de Pietrelcina'], why: 'Ainda adolescente, Carlo pesquisou e organizou a exposição, que já percorreu os cinco continentes.' },
  { topic: 'santos', level: 2, q: 'Qual santa é chamada de "santa das causas impossíveis"?', a: 'Santa Rita de Cássia', w: ['Santa Clara', 'Santa Luzia', 'Santa Mônica'], why: 'Santa Rita viveu um casamento difícil, perdeu a família e entrou no convento quando parecia impossível.' },
  { topic: 'santos', level: 2, q: 'De quem é a medalha com a cruz e letras que pedem proteção contra o mal?', a: 'São Bento', w: ['São Miguel', 'São Bento José Labre', 'Santo Inácio'], why: 'A medalha de São Bento traz as iniciais de orações como "Vade retro, Satana".' },
  { topic: 'santos', level: 2, q: 'Quem é o padroeiro dos padres?', a: 'São João Maria Vianney, o Cura d’Ars', w: ['São Francisco Xavier', 'São Tomás de Aquino', 'São José'], why: 'Pároco de uma pequena aldeia na França, passava até 16 horas por dia confessando.' },
  { topic: 'santos', level: 3, q: 'Quem ensinou a "pequena via" de confiança e amor nas coisas simples?', a: 'Santa Teresinha do Menino Jesus', w: ['Santa Teresa d’Ávila', 'Santa Faustina', 'Santa Clara'], why: 'Teresinha de Lisieux, doutora da Igreja, morreu aos 24 anos e escreveu História de uma Alma.' },
  { topic: 'santos', level: 3, q: 'Quem escreveu o livro "Confissões"?', a: 'Santo Agostinho', w: ['São Jerônimo', 'Santo Tomás de Aquino', 'São Gregório Magno'], why: 'Agostinho conta a sua conversão: "Fizeste-nos para ti, e inquieto está o nosso coração enquanto não repousa em ti."' },
  { topic: 'santos', level: 3, q: 'O nome de qual arcanjo significa "Deus cura"?', a: 'Rafael', w: ['Miguel', 'Gabriel', 'Uriel'], why: 'Rafael acompanhou Tobias e curou a cegueira de Tobit (livro de Tobias).' },
  { topic: 'santos', level: 3, q: 'Quem foi canonizado junto com Carlo Acutis, em setembro de 2025?', a: 'Pier Giorgio Frassati', w: ['João Paulo I', 'Chiara Badano', 'Oscar Romero'], why: 'Os dois jovens italianos foram canonizados por Leão XIV em 7 de setembro de 2025.' },

  // ── Símbolos ──
  { topic: 'simbolos', level: 1, q: 'Na arte cristã, a pomba representa quem?', a: 'O Espírito Santo', w: ['Nossa Senhora', 'Os anjos', 'A paz entre os povos'], why: 'No batismo de Jesus, o Espírito desceu "como uma pomba" (Mt 3,16).' },
  { topic: 'simbolos', level: 1, q: 'O que querem dizer as letras Alfa e Ômega?', a: 'O princípio e o fim', w: ['Pai e Filho', 'Céu e terra', 'Antigo e Novo Testamento'], why: 'São a primeira e a última letra do alfabeto grego: "Eu sou o Alfa e o Ômega" (Ap 22,13).' },
  { topic: 'simbolos', level: 1, q: 'O cordeiro, na arte cristã, representa quem?', a: 'Jesus', w: ['São João Batista', 'Os apóstolos', 'O povo de Israel'], why: 'João Batista disse: "Eis o Cordeiro de Deus, que tira o pecado do mundo" (Jo 1,29).' },
  { topic: 'simbolos', level: 1, q: 'Fazer o sinal da cruz com água benta ao entrar na igreja lembra qual sacramento?', a: 'O Batismo', w: ['A Crisma', 'A Confissão', 'A Unção dos Enfermos'], why: 'É uma lembrança da água do Batismo, que nos fez filhos de Deus.' },
  { topic: 'simbolos', level: 2, q: 'O que o peixe (Ichthys) significava para os primeiros cristãos?', a: 'As iniciais, em grego, de "Jesus Cristo, Filho de Deus, Salvador"', w: ['A pesca milagrosa', 'O batismo no Jordão', 'Os apóstolos pescadores'], why: 'Ichthys é "peixe" em grego, e cada letra inicia uma palavra da frase. Era um sinal discreto de fé.' },
  { topic: 'simbolos', level: 2, q: 'O que significa o monograma IHS?', a: 'As primeiras letras do nome de Jesus em grego', w: ['Igreja, Hóstia e Santos', 'Uma ordem religiosa', 'In Hoc Signo, "neste sinal"'], why: 'Vem de ΙΗΣΟΥΣ; depois também foi lido como "Iesus Hominum Salvator", Jesus Salvador dos homens.' },
  { topic: 'simbolos', level: 2, q: 'O que é o Chi-Rho (☧)?', a: 'As duas primeiras letras de "Cristo" em grego', w: ['Uma cruz com um pastor', 'O símbolo da Trindade', 'A âncora dos mártires'], why: 'X (chi) e P (rô) de ΧΡΙΣΤΟΣ, um dos monogramas mais antigos de Cristo.' },
  { topic: 'simbolos', level: 2, q: 'A âncora, nas catacumbas, era símbolo de quê?', a: 'Da esperança', w: ['Da pesca', 'Do martírio', 'Da viagem dos apóstolos'], why: 'A esperança é "como âncora da alma, segura e firme" (Hb 6,19).' },
  { topic: 'simbolos', level: 3, q: 'O pelicano que alimenta os filhotes com o próprio sangue representa:', a: 'Cristo que nos dá o seu Corpo e Sangue', w: ['A caridade dos santos', 'A maternidade de Maria', 'Os mártires da Igreja'], why: 'Uma lenda antiga dizia que o pelicano se feria para alimentar os filhotes; virou símbolo da Eucaristia.' },
  { topic: 'simbolos', level: 3, q: 'O que se grava no Círio Pascal?', a: 'A cruz, o Alfa e o Ômega e o ano', w: ['O nome do Papa', 'As sete palavras de Jesus', 'O nome da paróquia'], why: 'Na Vigília Pascal, o padre grava a cruz, as letras e os números do ano: Cristo é o Senhor do tempo.' },
  { topic: 'simbolos', level: 3, q: 'Qual evangelista é representado pelo leão?', a: 'Marcos', w: ['Mateus', 'Lucas', 'João'], why: 'Marcos começa com a voz que grita no deserto. Mateus é o homem; Lucas, o touro; João, a águia.' },
  { topic: 'simbolos', level: 3, q: 'Qual evangelista é representado pela águia?', a: 'João', w: ['Lucas', 'Marcos', 'Mateus'], why: 'A águia voa alto: o Evangelho de João começa contemplando o Verbo eterno.' },

  // ── Fé e Igreja ──
  { topic: 'fe', level: 1, q: 'Quantos são os sacramentos?', a: 'Sete', w: ['Cinco', 'Três', 'Dez'], why: 'Batismo, Crisma, Eucaristia, Confissão, Unção dos Enfermos, Ordem e Matrimônio.' },
  { topic: 'fe', level: 1, q: 'Os católicos adoram as imagens dos santos?', a: 'Não, elas são veneradas, não adoradas', w: ['Sim, como a Deus', 'Só as de Nossa Senhora', 'Só as que fazem milagres'], why: 'A adoração é só para Deus. As imagens são lembranças que ajudam a rezar, como fotos de família.' },
  { topic: 'fe', level: 1, q: 'Qual sacramento perdoa os pecados cometidos depois do Batismo?', a: 'A Confissão', w: ['A Crisma', 'O Matrimônio', 'A Ordem'], why: 'Na Reconciliação, Deus perdoa pelo ministério do padre (Jo 20,23).' },
  { topic: 'fe', level: 1, q: 'Qual é o primeiro sacramento que se recebe?', a: 'O Batismo', w: ['A Eucaristia', 'A Crisma', 'A Confissão'], why: 'O Batismo é a porta de todos os outros sacramentos.' },
  { topic: 'fe', level: 2, q: 'Quando aconteceu o Concílio Vaticano II?', a: 'De 1962 a 1965', w: ['De 1869 a 1870', 'De 1545 a 1563', 'De 1978 a 1981'], why: 'Convocado por São João XXIII e concluído por São Paulo VI.' },
  { topic: 'fe', level: 2, q: 'O que é o Purgatório?', a: 'Uma purificação final dos que morrem na amizade de Deus', w: ['Um segundo inferno', 'Uma nova chance de conversão', 'O lugar das crianças não batizadas'], why: 'Quem morre em graça, mas ainda precisa ser purificado, passa por ela antes do céu. Por isso rezamos pelos falecidos.' },
  { topic: 'fe', level: 2, q: 'Qual destes NÃO é um pecado capital?', a: 'Medo', w: ['Soberba', 'Gula', 'Preguiça'], why: 'Os sete são soberba, avareza, luxúria, ira, gula, inveja e preguiça.' },
  { topic: 'fe', level: 2, q: 'Quantos são os mandamentos da Lei de Deus?', a: 'Dez', w: ['Sete', 'Cinco', 'Doze'], why: 'Os Dez Mandamentos (Ex 20), resumidos por Jesus no amor a Deus e ao próximo.' },
  { topic: 'fe', level: 3, q: 'O que é a "latria"?', a: 'A adoração devida somente a Deus', w: ['A veneração aos santos', 'A honra especial a Maria', 'O respeito às relíquias'], why: 'Latria é adoração; dulia é a veneração aos santos; hiperdulia, a honra especial a Maria.' },
  { topic: 'fe', level: 3, q: 'A quem se dá a "hiperdulia"?', a: 'A Nossa Senhora', w: ['Aos anjos', 'Aos mártires', 'Ao Papa'], why: 'É a veneração especial a Maria, acima dos santos, mas que não é adoração.' },
  { topic: 'fe', level: 3, q: 'Em que ano foi publicado o Catecismo da Igreja Católica atual?', a: '1992', w: ['1965', '1983', '2005'], why: 'Por São João Paulo II, em 1992. Em 2005 saiu o Compêndio, uma versão resumida.' },
  { topic: 'fe', level: 3, q: 'Quantos papas se chamaram Leão até hoje?', a: 'Catorze', w: ['Treze', 'Dez', 'Doze'], why: 'O atual, eleito em 2025, é Leão XIV. Leão XIII escreveu a Rerum Novarum.' },
];

const shuffle = (list) => {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

/** Monta uma partida: sorteia as perguntas e embaralha as alternativas de cada uma. */
export function buildRound({ topic = null, level = null, size = 5, mixed = false }) {
  const pool = quizBank.filter((q) => (!topic || q.topic === topic) && (mixed || !level || q.level === level));
  return shuffle(pool)
    .slice(0, size)
    .map((q) => {
      const options = shuffle([q.a, ...q.w]);
      return { ...q, options, answer: options.indexOf(q.a) };
    });
}

