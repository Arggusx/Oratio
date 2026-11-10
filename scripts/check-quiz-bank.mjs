// Verifica o banco de perguntas das ilhas (src/data/quizBank.js). Roda no "npm run lint" e também sozinho:
//   node scripts/check-quiz-bank.mjs
// Falha (código 1) quando:
// - uma pergunta não tem cinco alternativas diferentes, ou a resposta certa está entre as erradas;
// - falta texto na pergunta, na resposta ou na explicação, ou o assunto/dificuldade não existe;
// - a mesma pergunta (ou uma muito parecida) aparece em mais de uma ilha, ou se repete dentro da mesma ilha;
// - uma ilha não tem perguntas suficientes para sortear cada quiz do caminho sem repetir sempre as mesmas.
import { DIFFICULTY_LABEL, LEVELS, QUIZ_TOPICS, quizBank } from '../src/data/quizBank.js';
import { trails } from '../src/data/trails.js';

const errors = [];
const warnings = [];

// Texto comparável: minúsculas, sem acentos e sem pontuação.
const norm = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const STOP = new Set(
  'a o as os um uma uns umas de da do das dos e em na no nas nos que qual quais quem como para por pela pelo com se ao aos foi era sao e esta este essa esse isso seu sua seus suas mais menos nao ha'.split(
    ' '
  )
);
const words = (s) => new Set(norm(s).split(' ').filter((w) => w.length > 2 && !STOP.has(w)));
const jaccard = (a, b) => {
  let common = 0;
  for (const w of a) if (b.has(w)) common++;
  return common / (a.size + b.size - common || 1);
};

const topicIds = new Set(QUIZ_TOPICS.map((t) => t.id));
const levelIds = new Set(Object.keys(DIFFICULTY_LABEL).map(Number));
const label = (q) => `[${q.topic} · nível ${q.level}] "${q.q}"`;

// 1. Formato de cada pergunta.
for (const q of quizBank) {
  if (!topicIds.has(q.topic)) errors.push(`${label(q)}: assunto desconhecido.`);
  if (!levelIds.has(q.level)) errors.push(`${label(q)}: dificuldade desconhecida.`);
  for (const field of ['q', 'a', 'why']) {
    if (typeof q[field] !== 'string' || !q[field].trim()) errors.push(`${label(q)}: falta o campo "${field}".`);
  }
  if (!Array.isArray(q.w) || q.w.length !== 4) {
    errors.push(`${label(q)}: precisa de quatro alternativas erradas (cinco no total).`);
    continue;
  }
  const options = [q.a, ...q.w].map(norm);
  if (new Set(options).size !== 5) errors.push(`${label(q)}: alternativas repetidas.`);
  if (q.w.map(norm).includes(norm(q.a))) errors.push(`${label(q)}: a resposta certa está entre as erradas.`);
  if (q.w.some((w) => typeof w !== 'string' || !w.trim())) errors.push(`${label(q)}: alternativa vazia.`);
}

// 2. Repetição: igual em qualquer lugar; parecida entre ilhas diferentes.
let crossSimilar = 0;
for (let i = 0; i < quizBank.length; i++) {
  for (let j = i + 1; j < quizBank.length; j++) {
    const a = quizBank[i];
    const b = quizBank[j];
    const cross = a.topic !== b.topic;
    if (norm(a.q) === norm(b.q)) {
      errors.push(`Pergunta repetida ${cross ? 'entre ilhas' : 'na mesma ilha'}: ${label(a)} e ${label(b)}.`);
      continue;
    }
    if (!cross) continue;
    const textScore = jaccard(words(a.q), words(b.q));
    const sameAnswer = norm(a.a) === norm(b.a) && norm(a.a).length > 12;
    if (textScore >= 0.6 || (sameAnswer && textScore >= 0.3)) {
      crossSimilar++;
      errors.push(`Pergunta parecida em duas ilhas (${textScore.toFixed(2)}): ${label(a)} e ${label(b)}.`);
    } else if (textScore >= 0.45) {
      warnings.push(`Parecidas, mas aceitas (${textScore.toFixed(2)}): ${label(a)} e ${label(b)}.`);
    }
  }
}

// 3. Cada ilha usa um assunto só seu, e cada quiz do caminho tem de onde sortear.
const used = new Map();
for (const trail of trails) {
  if (!topicIds.has(trail.quizTopic)) errors.push(`Ilha "${trail.id}": assunto "${trail.quizTopic}" não existe.`);
  if (used.has(trail.quizTopic)) errors.push(`Ilhas "${used.get(trail.quizTopic)}" e "${trail.id}" usam o mesmo assunto.`);
  used.set(trail.quizTopic, trail.id);
  for (const level of LEVELS) {
    const pool = quizBank.filter((q) => q.topic === trail.quizTopic && level.levels.includes(q.level)).length;
    // Pelo menos o dobro do tamanho do quiz: refazer o nível traz um sorteio diferente.
    if (pool < level.size * 2) {
      errors.push(`Ilha "${trail.id}", ${level.title}: só ${pool} perguntas para sortear ${level.size} (mínimo ${level.size * 2}).`);
    }
    if (level.pass > level.size) errors.push(`${level.title}: "pass" maior que "size".`);
  }
}

// Resumo: perguntas por ilha e dificuldade.
const rows = QUIZ_TOPICS.map((t) => {
  const row = { assunto: t.label };
  for (const l of levelIds) row[DIFFICULTY_LABEL[l]] = quizBank.filter((q) => q.topic === t.id && q.level === l).length;
  row.total = quizBank.filter((q) => q.topic === t.id).length;
  return row;
});
console.log(`Banco de perguntas: ${quizBank.length} perguntas, ${crossSimilar} repetidas entre ilhas.`);
console.table(rows);
for (const w of warnings) console.warn(`aviso: ${w}`);

if (errors.length) {
  for (const e of errors) console.error(`erro: ${e}`);
  console.error(`\n${errors.length} problema(s) no banco de perguntas.`);
  process.exit(1);
}
console.log('Banco de perguntas OK.');
