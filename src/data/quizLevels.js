// Os quizzes do caminho de cada ilha, do mais fácil ao mais difícil. Fica separado do banco de perguntas
// (data/quizBank.js) para as trilhas usarem sem carregar todas as perguntas no pacote principal do site.
// "levels" diz de quais dificuldades vêm as perguntas; "size" é quantas o quiz sorteia do banco da ilha;
// "pass" é quantas precisa acertar para seguir. Cada parada sobe um degrau de dificuldade, e o desafio final
// mistura as duas mais difíceis.
export const LEVELS = [
  { id: 1, title: 'Quiz 1 · fácil', icon: 'pergunta', levels: [1], size: 5, pass: 4 },
  { id: 2, title: 'Quiz 2 · médio', icon: 'pergunta', levels: [2], size: 5, pass: 4 },
  { id: 3, title: 'Quiz 3 · difícil', icon: 'pergunta', levels: [3], size: 6, pass: 4 },
  { id: 4, title: 'Quiz 4 · muito difícil', icon: 'pergunta', levels: [4], size: 5, pass: 3 },
  { id: 5, title: 'Desafio final', icon: 'coroa', levels: [3, 4], size: 8, pass: 6 },
];

export const DIFFICULTY_LABEL = { 1: 'fácil', 2: 'médio', 3: 'difícil', 4: 'muito difícil' };
