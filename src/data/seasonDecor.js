/* ============================================================
   Textos da decoração de cada tempo litúrgico e dos dias especiais:
   nome e frase da faixa da página inicial, etiqueta do topo e o
   item extra do "Para hoje". O tempo e o dia vêm de useSeasonTheme.
   ============================================================ */

/** Tempos: nome longo, nome curto (etiqueta no celular), cor dos paramentos e frase. */
export const SEASON_INFO = {
  advento: { label: 'Tempo do Advento', short: 'Advento', color: 'roxo', note: 'Preparamos o coração para a vinda do Senhor.' },
  natal: { label: 'Tempo do Natal', short: 'Natal', color: 'branco', note: 'O Verbo se fez carne e habitou entre nós.' },
  quaresma: { label: 'Tempo da Quaresma', short: 'Quaresma', color: 'roxo', note: 'Quarenta dias de oração, jejum e caridade.' },
  triduo: { label: 'Tríduo Pascal', short: 'Tríduo', color: 'vermelho', note: 'Paixão, morte e ressurreição do Senhor.' },
  pascoa: { label: 'Tempo Pascal', short: 'Páscoa', color: 'branco', note: 'Cristo ressuscitou! Aleluia!' },
  pentecostes: { label: 'Domingo de Pentecostes', short: 'Pentecostes', color: 'vermelho', note: 'Vinde, Espírito Santo!' },
  comum: { label: 'Tempo Comum', short: 'Comum', color: 'verde', note: '' },
};

/**
 * Dias especiais. Os que caem num tempo forte (Natal, Cinzas, Sexta-feira Santa, Páscoa)
 * usam a decoração do tempo e só mudam os textos; os outros têm decoração própria.
 */
export const FEAST_INFO = {
  'natal-dia': { label: 'Natal do Senhor', short: 'Natal', color: 'branco', note: 'Hoje nasceu para nós o Salvador.' },
  cinzas: { label: 'Quarta-feira de Cinzas', short: 'Cinzas', color: 'roxo', note: 'Lembra-te de que és pó, e ao pó voltarás.' },
  'sexta-santa': { label: 'Sexta-feira da Paixão', short: 'Sexta Santa', color: 'vermelho', note: 'Dia de jejum e silêncio. Hoje não há Missa.' },
  'pascoa-dia': { label: 'Domingo da Ressurreição', short: 'Páscoa', color: 'branco', note: 'Cristo ressuscitou! Aleluia!' },
  'corpus-christi': { label: 'Corpus Christi', short: 'Corpus Christi', color: 'branco', note: 'Eu sou o pão vivo descido do céu.' },
  aparecida: { label: 'Nossa Senhora Aparecida', short: 'Aparecida', color: 'azul', note: 'Rainha e Padroeira do Brasil, rogai por nós.' },
  'todos-os-santos': { label: 'Todos os Santos', short: 'Todos os Santos', color: 'branco', note: 'Bem-aventurados os puros de coração, porque verão a Deus.' },
};

/** Nome, nome curto, cor e frase do dia: o dia especial tem prioridade sobre o tempo. */
export function seasonDisplay({ theme, feast }) {
  const season = SEASON_INFO[theme] ?? SEASON_INFO.comum;
  const day = feast ? FEAST_INFO[feast] : null;
  if (!day) return season;
  // Num tempo forte, o nome do tempo vem antes: "Tempo Pascal · Domingo da Ressurreição".
  const inStrongSeason = theme !== 'comum';
  return {
    label: inStrongSeason ? `${season.label} · ${day.label}` : day.label,
    chipLabel: day.label,
    short: day.short,
    color: day.color,
    note: day.note,
  };
}

/** Item a mais no "Para hoje" da página inicial, conforme o dia ou o tempo. */
const TODAY_BY_FEAST = {
  cinzas: { title: 'Jejum e abstinência', hint: 'Quarta-feira de Cinzas · início da Quaresma', to: '/home/calendario' },
  'sexta-santa': { title: 'Celebração da Paixão', hint: 'Hoje não há Missa · jejum e abstinência', to: '/home/calendario' },
  'corpus-christi': { title: 'Corpus Christi', hint: 'Dia santo de guarda · procissão do Santíssimo', to: '/home/calendario' },
  aparecida: { title: 'Oração a Nossa Senhora Aparecida', hint: 'Padroeira do Brasil', to: '/home/oracoes?secao=oracoes' },
  'todos-os-santos': { title: 'Todos os Santos', hint: 'Conheça a vida dos santos', to: '/home/santos' },
};

const TODAY_BY_SEASON = {
  natal: { title: 'Cânticos do Natal', hint: 'Para rezar e cantar em família', to: '/home/canticos' },
  quaresma: { title: 'Tempo da Quaresma', hint: 'Oração, jejum e caridade', to: '/home/calendario' },
  triduo: { title: 'Tríduo Pascal', hint: 'As celebrações da Semana Santa', to: '/home/calendario' },
  pascoa: { title: 'Regina Caeli', hint: 'No lugar do Ângelus, até Pentecostes', to: '/home/oracoes?secao=oracoes' },
  pentecostes: { title: 'Oração ao Espírito Santo', hint: 'Vinde, Espírito Santo!', to: '/home/oracoes?secao=oracoes' },
};

export function seasonTodayItem({ theme, feast }) {
  return (feast && TODAY_BY_FEAST[feast]) || TODAY_BY_SEASON[theme] || null;
}
