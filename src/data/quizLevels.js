// Os quizzes do caminho de cada ilha, do mais fácil ao mais difícil. Fica separado do banco de perguntas
// (data/quizBank.js) para as trilhas usarem sem carregar todas as perguntas no pacote principal do site.
// "levels" diz de quais dificuldades vêm as perguntas; "pass" é quantas precisa acertar para seguir.
export const LEVELS = [
  { id: 1, title: 'Quiz 1 · fácil', icon: 'pergunta', levels: [1], size: 4, pass: 3 },
  { id: 2, title: 'Quiz 2 · fácil e médio', icon: 'pergunta', levels: [1, 2], size: 5, pass: 4 },
  { id: 3, title: 'Quiz 3 · médio', icon: 'pergunta', levels: [2], size: 5, pass: 4 },
  { id: 4, title: 'Quiz 4 · difícil', icon: 'pergunta', levels: [3], size: 5, pass: 4 },
  { id: 5, title: 'Desafio final', icon: 'coroa', levels: [2, 3], size: 8, pass: 7 },
];

export const DIFFICULTY_LABEL = { 1: 'fácil', 2: 'médio', 3: 'difícil' };
