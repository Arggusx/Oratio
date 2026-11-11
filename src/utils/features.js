/**
 * Partes do site ligadas ou desligadas no build, por variável de ambiente.
 *
 * VITE_JORNADA=true liga a Jornada (/jornada e os atalhos para ela). Sem a variável, ou com
 * outro valor, ela fica escondida: é assim na produção. No hml, a variável vem ligada.
 * O código da Jornada continua no projeto; só não aparece nem é alcançável.
 */
export const JORNADA_ATIVA = import.meta.env.VITE_JORNADA === 'true';
