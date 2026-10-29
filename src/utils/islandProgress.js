import { trails, trailStops } from '../data/trails';
import { LEVELS } from '../data/quizBank';

/**
 * Progresso de uma ilha (etapas de leitura e paradas de quiz juntas), a partir do estado da Jornada.
 * Usado no caminho da ilha, na tela de ilhas, na Jornada e nas recompensas.
 */
export function islandProgress(trail, { trails: plans, quizLevels }) {
  const lessons = plans[trail.id]?.done ?? [];
  const passed = quizLevels?.[trail.id] ?? [];
  const stops = trailStops(trail);
  const isDone = (st) => (st.kind === 'lesson' ? lessons.includes(st.day) : passed.includes(st.level));
  const nextIndex = stops.findIndex((st) => !isDone(st));
  const next = stops[nextIndex];
  return {
    stops,
    isDone,
    nextIndex,
    done: stops.filter(isDone).length,
    total: stops.length,
    started: Boolean(plans[trail.id]),
    complete: nextIndex === -1,
    nextTitle: next ? (next.kind === 'lesson' ? next.step.title : LEVELS.find((l) => l.id === next.level).title) : null,
  };
}

/** Ilhas que a pessoa já concluiu (todas as etapas e todos os quizzes). */
export const completedIslands = (state) => trails.filter((t) => islandProgress(t, state).complete);
