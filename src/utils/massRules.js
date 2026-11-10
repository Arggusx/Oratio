/* ============================================================
   Regras do Ordinário da Missa para um dia, segundo a Instrução
   Geral do Missal Romano (IGMR 53, 64, 68 e 346) e as normas do
   Missal: Glória, Credo, aclamação ao Evangelho, cor e despedida.

   A API "Liturgia Diária" informa o nome da celebração (com o grau
   no fim, como ", Solenidade") e a cor, mas não diz se há Glória ou
   Credo. Então o grau vem da API e o resto é calculado aqui. Sem a
   API, vale o calendário local: domingo ou dia de semana do tempo.
   ============================================================ */

import { addDays, getEaster, getLiturgicalSeason, makeDate, startOfDay, toKey } from './liturgicalCalendar';

export const SEASON_LABEL = {
  advento: 'Advento',
  natal: 'Tempo do Natal',
  quaresma: 'Quaresma',
  triduo: 'Tríduo Pascal',
  pascoa: 'Tempo Pascal',
  comum: 'Tempo Comum',
};

export const GRADE_LABEL = {
  solenidade: 'Solenidade',
  festa: 'Festa',
  memoria: 'Memória',
  domingo: 'Domingo',
  feria: 'Dia de semana',
};

// Cor de cada tempo, quando a API não informa a do dia.
const SEASON_COLOR = {
  advento: 'Roxo',
  natal: 'Branco',
  quaresma: 'Roxo',
  pascoa: 'Branco',
  comum: 'Verde',
};

/** Grau da celebração a partir do nome que a API devolve ("…, Solenidade", "…, Festa", "…, Memória"). */
export function parseGrade(name = '', isSunday = false) {
  if (/solenidade/i.test(name)) return 'solenidade';
  if (/,\s*festa\b/i.test(name) || /^festa\b/i.test(name)) return 'festa';
  if (/mem[oó]ria/i.test(name)) return 'memoria';
  if (isSunday || /domingo/i.test(name)) return 'domingo';
  return 'feria';
}

/** Dias especiais da Semana Santa e das oitavas, calculados a partir da Páscoa. */
function specialDay(day) {
  const year = day.getFullYear();
  const easter = getEaster(year);
  const key = toKey(day);
  const is = (date) => toKey(date) === key;

  if (is(addDays(easter, -46))) return 'cinzas';
  if (is(addDays(easter, -7))) return 'ramos';
  if (is(addDays(easter, -3))) return 'ceia';
  if (is(addDays(easter, -2))) return 'paixao';
  if (is(addDays(easter, -1))) return 'sabado-santo';
  if (is(addDays(easter, 49))) return 'pentecostes';
  if (day >= easter && day <= addDays(easter, 7)) return 'oitava-pascoa';
  if (day >= makeDate(year, 12, 25) && day <= makeDate(year, 12, 31)) return 'oitava-natal';
  if (is(makeDate(year, 11, 2))) return 'finados';
  return null;
}

const SEASON_THEME_TO_SEASON = { pentecostes: 'pascoa' };

/**
 * Regras do dia.
 * @param {Date} date   dia celebrado
 * @param {object|null} api  resposta da API para esse dia (ou null, sem rede)
 * @param {string|null} previewTheme  tempo da pré-visualização (?tempo=...), se houver
 * @param {boolean} isToday  false troca "Hoje" por "Neste dia" nas explicações
 */
export function getMassRules(date, api = null, previewTheme = null, isToday = true) {
  const day = startOfDay(date);
  const isSunday = day.getDay() === 0;
  const preview = previewTheme ? SEASON_THEME_TO_SEASON[previewTheme] ?? previewTheme : null;
  const season = preview ?? getLiturgicalSeason(day);

  // Na pré-visualização, o dia real não combina com o tempo escolhido: vale um domingo ou dia de semana típico.
  const useApi = Boolean(api) && !preview;
  const special = preview ? null : specialDay(day);
  const grade = useApi ? parseGrade(api.liturgia, isSunday) : isSunday ? 'domingo' : 'feria';
  const celebration = useApi ? api.liturgia : null;

  let colorName = useApi && api.cor ? api.cor : SEASON_COLOR[season];
  if (!colorName) colorName = special === 'paixao' ? 'Vermelho' : 'Branco'; // Tríduo
  if (!useApi && special === 'pentecostes') colorName = 'Vermelho';

  const inPenitentialSeason = season === 'advento' || season === 'quaresma' || season === 'triduo';
  const seasonName = SEASON_LABEL[season];
  const notes = [];

  // ── Glória (IGMR 53) ──
  let gloria;
  if (special === 'ceia') {
    gloria = { say: true, reason: 'Na Missa da Ceia do Senhor canta-se o Glória, e os sinos tocam pela última vez até a Vigília Pascal.' };
  } else if (special === 'finados') {
    gloria = { say: false, reason: 'Hoje não se reza o Glória porque é a Missa pelos fiéis defuntos.' };
  } else if (grade === 'solenidade' || grade === 'festa') {
    gloria = {
      say: true,
      reason: `Hoje se reza o Glória porque é ${grade === 'solenidade' ? 'solenidade' : 'festa'}${inPenitentialSeason ? `, mesmo durante ${season === 'advento' ? 'o Advento' : 'a Quaresma'}` : ''}.`,
    };
  } else if (special === 'oitava-pascoa' || special === 'oitava-natal') {
    gloria = { say: true, reason: `Hoje se reza o Glória porque estamos na oitava ${special === 'oitava-pascoa' ? 'da Páscoa' : 'do Natal'}, celebrada como uma grande festa.` };
  } else if (season === 'advento') {
    gloria = { say: false, reason: 'Hoje não se reza o Glória porque estamos no Advento: ele volta no Natal, com o canto dos anjos.' };
  } else if (season === 'quaresma') {
    gloria = { say: false, reason: 'Hoje não se reza o Glória porque estamos na Quaresma: ele volta na Vigília Pascal.' };
  } else if (season === 'triduo') {
    gloria = { say: false, reason: 'Hoje não se reza o Glória: ele volta na Vigília Pascal.' };
  } else if (grade === 'domingo') {
    gloria = { say: true, reason: `Hoje se reza o Glória porque é domingo, fora do Advento e da Quaresma.` };
  } else {
    gloria = {
      say: false,
      reason: `Hoje não se reza o Glória porque é ${grade === 'memoria' ? 'memória' : 'dia de semana (féria)'}: ele fica para os domingos, as festas e as solenidades.`,
    };
  }

  // ── Credo (IGMR 68) ──
  let credo;
  if (special === 'ceia' || special === 'cinzas') {
    credo = { say: false, reason: 'Hoje não se reza o Credo: ele fica para os domingos e as solenidades.' };
  } else if (isSunday || grade === 'solenidade') {
    credo = { say: true, reason: `Hoje se reza o Credo porque é ${isSunday ? 'domingo' : 'solenidade'}.` };
  } else {
    credo = {
      say: false,
      reason: `Hoje não se reza o Credo: ele fica para os domingos e as solenidades, e hoje é ${grade === 'festa' ? 'festa' : grade === 'memoria' ? 'memória' : 'dia de semana'}.`,
    };
  }

  // ── Aclamação ao Evangelho ──
  const lent = season === 'quaresma' || (season === 'triduo' && special !== 'sabado-santo');
  const acclamation = lent
    ? {
        lent: true,
        reason: season === 'triduo'
          ? 'No Tríduo Pascal o Aleluia ainda não é cantado: ele volta na Vigília Pascal.'
          : 'Na Quaresma o Aleluia é trocado por outra aclamação ao Evangelho. Ele volta na Vigília Pascal.',
      }
    : { lent: false, reason: null };

  // ── Despedida ──
  const doubleAlleluia = special === 'oitava-pascoa' || special === 'pentecostes';

  // ── Dias especiais ──
  let noMass = null;
  let penitential = null;
  let blessing = null;
  if (special === 'cinzas') {
    penitential = 'Hoje não há ato penitencial no começo: as cinzas são abençoadas e impostas depois da homilia.';
    notes.push('Quarta-feira de Cinzas: dia de jejum e abstinência.');
  }
  if (special === 'ramos') {
    penitential = 'Quando há a procissão ou a entrada solene com os ramos, o ato penitencial é omitido.';
    notes.push('Domingo de Ramos: a Missa começa com a bênção dos ramos e a leitura da Paixão substitui o Evangelho do dia.');
  }
  if (special === 'ceia') {
    blessing = 'Hoje não há bênção nem despedida: a Missa termina com a trasladação do Santíssimo Sacramento.';
    notes.push('Depois da homilia pode haver o lava-pés.');
  }
  if (special === 'paixao') {
    noMass = 'Na Sexta-feira Santa a Igreja não celebra a Missa: há a Celebração da Paixão do Senhor, com a adoração da cruz e a comunhão.';
  }
  if (special === 'sabado-santo') {
    noMass = 'No Sábado Santo, durante o dia, não há Missa. À noite, a Vigília Pascal traz de volta o Glória e o Aleluia, e a renovação das promessas do Batismo toma o lugar do Credo.';
  }
  if (special === 'oitava-pascoa' || special === 'pentecostes') {
    notes.push('A despedida ganha o duplo aleluia.');
  }

  if (!isToday) {
    const onThatDay = (text) => text?.replace(/^Hoje/, 'Neste dia');
    gloria.reason = onThatDay(gloria.reason);
    credo.reason = onThatDay(credo.reason);
    penitential = onThatDay(penitential);
    blessing = onThatDay(blessing);
  }

  return {
    date: day,
    season,
    seasonLabel: seasonName,
    preview: Boolean(preview),
    fromApi: useApi,
    celebration,
    grade,
    gradeLabel: GRADE_LABEL[grade],
    isSunday,
    colorName,
    gloria,
    credo,
    acclamation,
    doubleAlleluia,
    penitential,
    blessing,
    noMass,
    notes,
  };
}
