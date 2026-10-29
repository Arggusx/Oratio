import { useSyncExternalStore } from 'react';
import { addDays, fromKey, startOfDay, toKey } from './liturgicalCalendar';
import { community } from './community';

/**
 * Progresso da Jornada, guardado só neste aparelho (localStorage). Nada é enviado a servidor.
 * Quando houver login, este mesmo objeto poderá ser sincronizado.
 */
const STORAGE_KEY = 'oratio:jornada';

const EMPTY = {
  prayedDays: [], // dias em que a pessoa marcou o terço ('AAAA-MM-DD')
  novenas: {}, // { [id]: { start: 'AAAA-MM-DD', done: [1, 2, ...] } }
  saints: [], // slugs dos santos guardados na coleção
  miracles: [], // ids dos milagres visitados
  bouquets: [], // buquês espirituais criados
  trails: {}, // { [id]: { start: 'AAAA-MM-DD', done: [1, 2, ...] } }
  quizzes: {}, // { [tema]: { answered: n, correct: n } }
};

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY; // armazenamento indisponível (modo privado, bloqueio): a Jornada funciona só nesta visita
  }
}

let state = read();
const listeners = new Set();

function write(next) {
  state = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // sem armazenamento: mantém só em memória
  }
  listeners.forEach((l) => l());
}

function subscribe(listener) {
  listeners.add(listener);
  // Outra aba mexeu na Jornada: atualiza esta também.
  const onStorage = (e) => {
    if (e.key === STORAGE_KEY) {
      state = read();
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

export function useJourney() {
  return useSyncExternalStore(subscribe, () => state, () => EMPTY);
}

const toggleIn = (list, value) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

export const todayKey = () => toKey(new Date());

export const journey = {
  togglePrayedToday() {
    const marking = !state.prayedDays.includes(todayKey());
    write({ ...state, prayedDays: toggleIn(state.prayedDays, todayKey()) });
    // Conta, anonimamente, no "hoje, N pessoas rezaram o terço".
    if (marking) community.mark('terco');
  },
  toggleSaint(slug) {
    write({ ...state, saints: toggleIn(state.saints, slug) });
  },
  markMiracle(id, seen = true) {
    const has = state.miracles.includes(id);
    if (has === seen) return;
    write({ ...state, miracles: seen ? [...state.miracles, id] : state.miracles.filter((m) => m !== id) });
  },
  startPlan(kind, id) {
    write({ ...state, [kind]: { ...state[kind], [id]: { start: todayKey(), done: [] } } });
  },
  togglePlanDay(kind, id, day) {
    const plan = state[kind][id];
    if (!plan) return;
    const marking = !plan.done.includes(day);
    write({ ...state, [kind]: { ...state[kind], [id]: { ...plan, done: toggleIn(plan.done, day) } } });
    // Conta, anonimamente, nas "N pessoas estão fazendo esta novena".
    if (marking && kind === 'novenas') community.mark('novena', id);
  },
  stopPlan(kind, id) {
    const rest = { ...state[kind] };
    delete rest[id];
    write({ ...state, [kind]: rest });
  },
  addBouquet(bouquet) {
    write({ ...state, bouquets: [{ ...bouquet, id: `b-${Date.now()}`, created: todayKey() }, ...state.bouquets] });
  },
  removeBouquet(id) {
    write({ ...state, bouquets: state.bouquets.filter((b) => b.id !== id) });
  },
  saveQuiz(topic, answered, correct) {
    write({ ...state, quizzes: { ...state.quizzes, [topic]: { answered, correct } } });
  },
  clearAll() {
    write(EMPTY);
  },
};

/** Dia do plano (1, 2, ...) que corresponde a hoje, contando a partir do início. */
export function planDayToday(plan) {
  if (!plan) return 0;
  return Math.round((startOfDay(new Date()) - fromKey(plan.start)) / 86400000) + 1;
}

/**
 * Semanas do caminho de oração (domingo a sábado), da mais antiga à atual.
 * Em cada semana, um dia sem oração é coberto por uma "graça": faltar um dia não apaga o caminho.
 */
export function prayerWeeks(prayedDays, count = 6) {
  const prayed = new Set(prayedDays);
  const today = startOfDay(new Date());
  const thisSunday = addDays(today, -today.getDay());
  return Array.from({ length: count }, (_, w) => {
    const sunday = addDays(thisSunday, -7 * (count - 1 - w));
    let graceUsed = false;
    const days = Array.from({ length: 7 }, (_, d) => {
      const date = addDays(sunday, d);
      const key = toKey(date);
      const future = date > today;
      let status = prayed.has(key) ? 'prayed' : 'empty';
      // A graça cobre o primeiro dia vazio de uma semana que já terminou ou em que a pessoa rezou depois.
      if (status === 'empty' && !future && !graceUsed && date < today) {
        const prayedLater = [...prayed].some((k) => k > key && k <= toKey(addDays(sunday, 6)));
        if (prayedLater) {
          status = 'grace';
          graceUsed = true;
        }
      }
      return { key, date, status: future ? 'future' : status, isToday: key === toKey(today) };
    });
    return { sunday, days };
  });
}
