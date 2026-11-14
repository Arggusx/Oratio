/**
 * Partes do site ligadas ou desligadas no build, por variável de ambiente.
 *
 * VITE_JORNADA=true liga a Jornada (/jornada e os atalhos para ela) e as Trilhas da fé, com
 * as ilhas e os quizzes, que ainda estão em teste. Sem a variável, ou com outro valor, tudo
 * isso fica escondido: é assim na produção. No hml, a variável vem ligada.
 * O código continua no projeto; só não aparece nem é alcançável.
 */
export const JORNADA_ATIVA = import.meta.env.VITE_JORNADA === 'true';

/** Trilhas da fé, ilhas e quizzes: em teste, junto com a Jornada. */
export const TRILHAS_ATIVAS = JORNADA_ATIVA;
