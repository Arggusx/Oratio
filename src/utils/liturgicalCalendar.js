/* ============================================================
   Calendário litúrgico (Rito Romano, normas da CNBB) e feriados
   nacionais do Brasil. Tudo é calculado localmente a partir da
   data da Páscoa, sem depender de API.
   ============================================================ */

import { saints } from '../data/saints';

export const EVENT_TYPES = {
  domingo: { label: 'Domingo de preceito', color: '#B84A13' },
  santo: { label: 'Dia santo de guarda', color: '#73537B' },
  solenidade: { label: 'Celebração litúrgica', color: '#C8963E' },
  festaSanto: { label: 'Festa de santo', color: '#B95E78' },
  feriado: { label: 'Feriado nacional', color: '#5B8060' },
  facultativo: { label: 'Ponto facultativo', color: '#8AA8D0' },
};

const DAY_MS = 24 * 60 * 60 * 1000;

export function makeDate(year, month, day) {
  // Meio-dia evita erros de horário de verão ao somar dias.
  return new Date(year, month - 1, day, 12);
}

export function addDays(date, days) {
  return new Date(date.getTime() + days * DAY_MS);
}

export function toKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function fromKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return makeDate(y, m, d);
}

export function startOfDay(date) {
  return makeDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

function daysBetween(a, b) {
  return Math.round((startOfDay(b) - startOfDay(a)) / DAY_MS);
}

/** Domingo de Páscoa (algoritmo de Meeus/Jones/Butcher). */
export function getEaster(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return makeDate(year, month, day);
}

/** Primeiro domingo igual ou posterior à data. */
function sundayOnOrAfter(date) {
  return addDays(date, (7 - date.getDay()) % 7);
}

function getKeyDates(year) {
  const easter = getEaster(year);
  const christmas = makeDate(year, 12, 25);
  const advent4 = addDays(christmas, christmas.getDay() === 0 ? -7 : -christmas.getDay());
  const advent1 = addDays(advent4, -21);

  // No Brasil a Epifania é celebrada no domingo entre 2 e 8 de janeiro.
  const epiphany = sundayOnOrAfter(makeDate(year, 1, 2));
  // Se a Epifania cair em 7 ou 8 de janeiro, o Batismo passa para a segunda-feira.
  const baptism = epiphany.getDate() >= 7 ? addDays(epiphany, 1) : addDays(epiphany, 7);

  return {
    easter,
    ashWednesday: addDays(easter, -46),
    palmSunday: addDays(easter, -7),
    holyThursday: addDays(easter, -3),
    goodFriday: addDays(easter, -2),
    holySaturday: addDays(easter, -1),
    divineMercy: addDays(easter, 7),
    ascension: addDays(easter, 42), // Transferida para o domingo no Brasil
    pentecost: addDays(easter, 49),
    trinity: addDays(easter, 56),
    corpusChristi: addDays(easter, 60),
    sacredHeart: addDays(easter, 68),
    advent1,
    christKing: addDays(advent1, -7),
    christmas,
    epiphany,
    baptism,
  };
}

/**
 * Tempo litúrgico de uma data: 'advento' | 'natal' | 'quaresma' | 'triduo' | 'pascoa' | 'comum'.
 */
export function getLiturgicalSeason(date = new Date()) {
  const day = startOfDay(date);
  const year = day.getFullYear();
  const k = getKeyDates(year);

  // Tempo do Natal que começou no ano anterior vai até o Batismo do Senhor.
  if (day <= k.baptism) return 'natal';
  if (day >= k.christmas) return 'natal';
  if (day >= k.advent1) return 'advento';
  if (day >= k.ashWednesday && day < k.holyThursday) return 'quaresma';
  if (day >= k.holyThursday && day < k.easter) return 'triduo';
  if (day >= k.easter && day <= k.pentecost) return 'pascoa';
  return 'comum';
}

/** Na Quaresma (e no Tríduo) não se canta o Aleluia. */
export function isAlleluiaSuppressed(date = new Date()) {
  const season = getLiturgicalSeason(date);
  return season === 'quaresma' || season === 'triduo';
}

/**
 * Mistério do terço indicado para o dia: segue o dia da semana, mas os
 * domingos do Advento são gozosos e os da Quaresma, dolorosos.
 */
export function getTodayMysteryKey(date = new Date()) {
  const weekday = date.getDay();
  if (weekday === 0) {
    const season = getLiturgicalSeason(date);
    if (season === 'advento') return 'gozosos';
    if (season === 'quaresma') return 'dolorosos';
    return 'gloriosos';
  }
  switch (weekday) {
    case 1:
    case 6:
      return 'gozosos';
    case 2:
    case 5:
      return 'dolorosos';
    case 4:
      return 'luminosos';
    default:
      return 'gloriosos';
  }
}

const ORDINALS = ['', '1º', '2º', '3º', '4º', '5º', '6º', '7º'];

function sundayName(date, k) {
  if (date >= k.advent1 && date < k.christmas) {
    return `${ORDINALS[daysBetween(k.advent1, date) / 7 + 1]} Domingo do Advento`;
  }
  if (date > k.ashWednesday && date < k.palmSunday) {
    return `${ORDINALS[Math.ceil(daysBetween(k.ashWednesday, date) / 7)]} Domingo da Quaresma`;
  }
  if (date > k.easter && date < k.pentecost) {
    const n = daysBetween(k.easter, date) / 7 + 1;
    return `${ORDINALS[n]} Domingo da Páscoa`;
  }
  if (date > k.baptism && date < k.ashWednesday) {
    const firstSunday = sundayOnOrAfter(addDays(k.baptism, 1));
    return `${daysBetween(firstSunday, date) / 7 + 2}º Domingo do Tempo Comum`;
  }
  if (date > k.pentecost && date < k.advent1) {
    return `${34 - daysBetween(date, k.christKing) / 7}º Domingo do Tempo Comum`;
  }
  return 'Domingo';
}

/**
 * Lista todos os dias marcados do ano.
 * Retorna um Map: 'AAAA-MM-DD' -> [{ name, types: [...], note? }]
 */
export function getYearEvents(year) {
  const k = getKeyDates(year);
  const events = new Map();

  // saintSlugs: santos com página no site ligados a este evento.
  const add = (date, name, types, note, saintSlugs = []) => {
    const key = toKey(date);
    const list = events.get(key) ?? [];
    const existing = list.find((e) => e.name === name);
    if (existing) {
      existing.types = [...new Set([...existing.types, ...types])];
      existing.saints = [...new Set([...existing.saints, ...saintSlugs])];
      if (note && !existing.note) existing.note = note;
    } else {
      list.push({ name, types: [...types], note, saints: [...saintSlugs] });
    }
    events.set(key, list);
  };

  // ── Solenidades e festas móveis ──
  add(k.epiphany, 'Epifania do Senhor', ['solenidade'], 'No Brasil, celebrada no domingo entre 2 e 8 de janeiro.');
  add(k.baptism, 'Batismo do Senhor', ['solenidade'], 'Encerra o Tempo do Natal.');
  add(addDays(k.easter, -48), 'Carnaval', ['facultativo']);
  add(addDays(k.easter, -47), 'Carnaval', ['facultativo']);
  add(k.ashWednesday, 'Quarta-feira de Cinzas', ['solenidade', 'facultativo'], 'Início da Quaresma. Dia de jejum e abstinência. Ponto facultativo até as 14h.');
  add(k.palmSunday, 'Domingo de Ramos da Paixão do Senhor', ['solenidade']);
  add(k.holyThursday, 'Quinta-feira Santa — Ceia do Senhor', ['solenidade'], 'Início do Tríduo Pascal.');
  add(k.goodFriday, 'Sexta-feira Santa — Paixão do Senhor', ['solenidade', 'feriado'], 'Dia de jejum e abstinência.');
  add(k.holySaturday, 'Sábado Santo — Vigília Pascal', ['solenidade']);
  add(k.easter, 'Domingo de Páscoa da Ressurreição do Senhor', ['solenidade']);
  add(k.divineMercy, '2º Domingo da Páscoa — Divina Misericórdia', ['solenidade']);
  add(k.ascension, 'Ascensão do Senhor', ['solenidade'], 'No Brasil, transferida para o domingo.');
  add(k.pentecost, 'Domingo de Pentecostes', ['solenidade'], 'Encerra o Tempo Pascal.');
  add(k.trinity, 'Santíssima Trindade', ['solenidade']);
  add(k.corpusChristi, 'Corpus Christi — Santíssimo Corpo e Sangue de Cristo', ['santo', 'solenidade', 'facultativo']);
  add(k.sacredHeart, 'Sagrado Coração de Jesus', ['solenidade']);
  add(k.christKing, 'Nosso Senhor Jesus Cristo, Rei do Universo', ['solenidade'], 'Último domingo do Tempo Comum.');
  add(k.advent1, '1º Domingo do Advento', ['solenidade'], 'Início do Ano Litúrgico.');

  // Sagrada Família: domingo na oitava do Natal ou, se não houver, 30 de dezembro.
  const holyFamilySunday = sundayOnOrAfter(makeDate(year, 12, 26));
  add(
    holyFamilySunday.getFullYear() === year ? holyFamilySunday : makeDate(year, 12, 30),
    'Sagrada Família de Jesus, Maria e José',
    ['solenidade']
  );

  // São José e Anunciação mudam de data quando caem na Semana Santa/Oitava da Páscoa.
  let joseph = makeDate(year, 3, 19);
  if (joseph >= k.palmSunday && joseph <= k.easter) joseph = addDays(k.palmSunday, -1);
  else if (joseph.getDay() === 0) joseph = addDays(joseph, 1);
  add(joseph, 'São José, Esposo da Virgem Maria', ['solenidade']);

  let annunciation = makeDate(year, 3, 25);
  if (annunciation >= k.palmSunday && annunciation <= k.divineMercy) annunciation = addDays(k.divineMercy, 1);
  else if (annunciation.getDay() === 0) annunciation = addDays(annunciation, 1);
  add(annunciation, 'Anunciação do Senhor', ['solenidade']);

  // ── Datas fixas ──
  add(makeDate(year, 1, 1), 'Santa Maria, Mãe de Deus', ['santo', 'solenidade']);
  add(makeDate(year, 1, 1), 'Confraternização Universal', ['feriado']);
  add(makeDate(year, 2, 2), 'Apresentação do Senhor', ['solenidade']);
  add(makeDate(year, 4, 21), 'Tiradentes', ['feriado']);
  add(makeDate(year, 5, 1), 'Dia do Trabalho', ['feriado']);
  add(makeDate(year, 5, 1), 'São José Operário', ['solenidade']);
  add(makeDate(year, 5, 13), 'Nossa Senhora de Fátima', ['solenidade']);
  add(makeDate(year, 6, 24), 'Natividade de São João Batista', ['solenidade']);
  add(sundayOnOrAfter(makeDate(year, 6, 29)), 'São Pedro e São Paulo, Apóstolos', ['solenidade'], 'No Brasil, celebrada no domingo seguinte a 29 de junho.');
  add(makeDate(year, 8, 6), 'Transfiguração do Senhor', ['solenidade']);
  add(sundayOnOrAfter(makeDate(year, 8, 15)), 'Assunção de Nossa Senhora', ['solenidade'], 'No Brasil, celebrada no domingo seguinte a 15 de agosto.');
  add(makeDate(year, 9, 7), 'Independência do Brasil', ['feriado']);
  add(makeDate(year, 9, 14), 'Exaltação da Santa Cruz', ['solenidade']);
  add(makeDate(year, 10, 7), 'Nossa Senhora do Rosário', ['solenidade']);
  add(makeDate(year, 10, 12), 'Nossa Senhora da Conceição Aparecida', ['solenidade', 'feriado'], 'Padroeira do Brasil.');
  add(sundayOnOrAfter(makeDate(year, 11, 1)), 'Todos os Santos', ['solenidade'], 'No Brasil, celebrada no domingo seguinte a 1º de novembro.');
  add(makeDate(year, 11, 2), 'Finados — Comemoração dos Fiéis Defuntos', ['solenidade', 'feriado']);
  add(makeDate(year, 11, 15), 'Proclamação da República', ['feriado']);
  add(makeDate(year, 11, 20), 'Dia Nacional de Zumbi e da Consciência Negra', ['feriado']);
  add(makeDate(year, 12, 8), 'Imaculada Conceição de Nossa Senhora', ['santo', 'solenidade']);
  add(makeDate(year, 12, 25), 'Natal do Senhor', ['santo', 'solenidade', 'feriado']);

  // ── Festas dos santos com página no site ──
  for (const saint of saints) {
    const [month, day] = saint.feast.split('-').map(Number);
    const date = makeDate(year, month, day);
    if (saint.inCalendar) {
      // A data já existe no calendário base: só liga o evento à página do santo.
      const existing = events.get(toKey(date))?.find((e) => e.name.includes(saint.name));
      if (existing) existing.saints = [...new Set([...existing.saints, saint.slug])];
      continue;
    }
    add(date, saint.feastName ?? saint.name, ['festaSanto'], saint.feastNote, [saint.slug]);
  }

  // ── Domingos de preceito ──
  for (let day = sundayOnOrAfter(makeDate(year, 1, 1)); day.getFullYear() === year; day = addDays(day, 7)) {
    const key = toKey(day);
    const list = events.get(key) ?? [];
    const sundaySolemnity = list.find((e) => e.types.includes('solenidade'));
    if (sundaySolemnity) {
      sundaySolemnity.types = ['domingo', ...sundaySolemnity.types];
    } else {
      add(day, sundayName(day, k), ['domingo']);
    }
  }

  return events;
}

export const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export const WEEKDAY_SHORT = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export function normalizeText(text) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}
