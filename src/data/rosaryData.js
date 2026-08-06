import { mysteriesData } from './mysteries';

export const traditionalRosaryData = {
  id: 'tradicional',
  title: 'Terço Tradicional de Nossa Senhora',
  introduction: 'O Santo Terço é uma contemplação dos mistérios da salvação através da oração vocal e mental, recomendada pela Virgem Maria em diversas aparições.',
  mysteriesList: mysteriesData,
  steps: [
    {
      id: 'step-1',
      bead: 'Cruz',
      beadBadge: 'Início',
      action: 'Sinal da Cruz e Oferecimento',
      summary: 'Inicie fazendo o Sinal da Cruz e recitando a oração de oferecimento das intenções do terço.',
      prayerText: `Sinal da Cruz:\nEm nome do Pai, do Filho e do Espírito Santo. Amém.\n\nOferecimento:\nDivino Jesus, nós Vos oferecemos este terço que vamos rezar, meditando nos mistérios da nossa Redenção. Concedei-nos, por intercessão da Virgem Maria, Mãe de Deus e nossa Mãe, as virtudes que nos são necessárias para bem rezá-lo e a graça de ganharmos as indulgências desta santa devoção. Amém.`
    },
    {
      id: 'step-2',
      bead: 'Cruz',
      beadBadge: 'Cruz',
      action: 'Creio (Símbolo dos Apóstolos)',
      summary: 'Segurando o crucifixo, professe a fé católica recitando o Credo.',
      prayerText: `Creio em Deus Pai Todo-Poderoso, Criador do céu e da terra; e em Jesus Cristo, seu único Filho, nosso Senhor; que foi concebido pelo poder do Espírito Santo; nasceu da Virgem Maria; padeceu sob Pôncio Pilatos, foi crucificado, morto e sepultado; desceu à mansão dos mortos; ressuscitou ao terceiro dia; subiu aos Céus, está sentado à direita de Deus Pai Todo-Poderoso, de onde há de vir a julgar os vivos e os mortos. Creio no Espírito Santo, na Santa Igreja Católica, na comunhão dos Santos, na remissão dos pecados, na ressurreição da carne, na vida eterna. Amém.`
    },
    {
      id: 'step-3',
      bead: 'Conta Grande',
      beadBadge: 'Pai Nosso',
      action: 'Pai Nosso inicial',
      summary: 'Na primeira conta grande logo após a cruz, reze 1 Pai Nosso.',
      prayerText: `Pai nosso, que estais nos céus, santificado seja o vosso nome; venha a nós o vosso Reino; seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.`
    },
    {
      id: 'step-4',
      bead: 'Contas Pequenas (3x)',
      beadBadge: 'Ave Maria',
      action: 'Três Ave-Marias',
      summary: 'Nas três contas pequenas seguintes, reze uma Ave-Maria em cada uma pedindo o aumento da Fé, Esperança e Caridade.',
      prayerText: `1. Pelo aumento da Fé\n2. Pelo aumento da Esperança\n3. Pelo aumento da Caridade\n\nAve Maria, cheia de graça, o Senhor é convosco. Bendita sois vós entre as mulheres, e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós, pecadores, agora e na hora de nossa morte. Amém.`
    },
    {
      id: 'step-5',
      bead: 'Espaço / Conta',
      beadBadge: 'Glória',
      action: 'Glória ao Pai',
      summary: 'Reze o Glória ao Pai quando rezar as três Ave-Maria.',
      prayerText: `Glória ao Pai, e ao Filho, e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.`
    },
    {
      id: 'step-6',
      bead: 'Medalha / Dezenas (5x)',
      beadBadge: 'Meditação',
      action: 'Anunciação do Mistério e as 5 Dezenas (As 10 contas menores)',
      summary: 'Em cada uma das 5 dezenas: anuncie o mistério do dia, reze 1 Pai Nosso na conta grande, 10 Ave-Marias nas contas pequenas, 1 Glória ao Pai e a Jaculatória de Fátima.',
      prayerText: `Para cada uma das 5 dezenas:\n\n1. Anuncie o mistério contemplado.\n2. Reze 1 Pai Nosso (na conta grande).\n3. Reze 10 Ave-Marias (nas 10 contas pequenas).\n4. Reze 1 Glória ao Pai.\n5. Reze a Jaculatória de Fátima: "Ó meu Jesus, perdoai-nos, livrai-nos do fogo do inferno, levai as almas todas para o Céu e socorrei principalmente as que mais precisarem."`
    },
    {
      id: 'step-7',
      bead: 'Medalha / Fecho',
      beadBadge: 'Encerramento',
      action: 'Salve Rainha (Agradecimento)',
      summary: 'Ao concluir as 5 dezenas, segurando a medalha central, reze a Salve Rainha em agradecimento.',
      prayerText: `Salve, Rainha, mãe de misericórdia, vida, doçura e esperança nossa, salve! A vós bradamos, os degredados filhos de Eva. A vós suspiramos, gemendo e chorando neste vale de lágrimas. Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei, e depois deste desterro, mostrai-nos Jesus, bendito fruto do vosso ventre. Ó clemente, ó piedosa, ó doce sempre Virgem Maria. Rogai por nós, Santa Mãe de Deus, para que sejamos dignos das promessas de Cristo. Amém.`
    }
  ]
};

export const nordicRosaryData = {
  id: 'nordico',
  title: 'Rosário Nórdico (Rosário das Cláusulas)',
  introduction: 'Tradição meditativa originária do norte da Europa em que uma frase de contemplação bíblica (cláusula) é inserida no meio de cada Ave-Maria após o nome de Jesus.',
  mysteriesList: mysteriesData,
  steps: [
    {
      id: 'n-step-1',
      bead: 'Cruz',
      beadBadge: 'Início',
      action: 'Sinal da Cruz e Invocação',
      summary: 'Inicie invocando a Santíssima Trindade com fé e serenidade.',
      prayerText: `Em nome do Pai, do Filho e do Espírito Santo. Amém.\n\n"Abri, Senhor, os meus lábios para louvar o vosso Santo Nome e purificai o meu coração de todos os pensamentos vãos e distraídos."`
    },
    {
      id: 'n-step-2',
      bead: 'Contas da Dezena',
      beadBadge: 'Estrutura da Cláusula',
      action: 'Inserção da Cláusula na Ave-Maria',
      summary: 'Em cada Ave-Maria da dezena, a cláusula do mistério escolhido é pronunciada suavemente logo após dizer "...e bendito é o fruto do vosso ventre, Jesus".',
      prayerText: `Fórmula da Ave Maria com Cláusula:\n\n"Ave Maria, cheia de graça, o Senhor é convosco, bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus,\n\n[INSERIR CLÁUSULA DO MISTÉRIO AQUI]\n\nSanta Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém."`
    },
    {
      id: 'n-step-3',
      bead: 'Contas Grandes & Fecho',
      beadBadge: 'Orações de Apoio',
      action: 'Pai Nosso, Glória e Encerramento',
      summary: 'Cada dezena é iniciada com o Pai Nosso e concluída com o Glória ao Pai, mantendo a harmonia tradicional do rosário.',
      prayerText: `Pai Nosso:\nPai nosso, que estais nos céus, santificado seja o vosso nome...\n\nGlória ao Pai:\nGlória ao Pai, e ao Filho, e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.`
    }
  ]
};
