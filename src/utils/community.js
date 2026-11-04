import { useEffect, useState } from 'react';

/**
 * Comunidade: fala com /api/community da daily-prayer-api. Nada aqui identifica a pessoa: o aparelho manda
 * só um código aleatório (anonId), que a API guarda embaralhado. Se a API falhar, a parte da comunidade
 * simplesmente não aparece; o resto do site segue normal.
 */
const API_BASE = import.meta.env.VITE_API_ORACAO || 'https://daily-prayer-api.vercel.app';
const ENDPOINT = `${API_BASE}/api/community`;
const ANON_KEY = 'oratio:anon';

export function anonId() {
  try {
    let id = localStorage.getItem(ANON_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(ANON_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID(); // sem armazenamento: um código só para esta visita
  }
}

async function request(route, { method = 'GET', body, params = '' } = {}) {
  const res = await fetch(`${ENDPOINT}?r=${route}${params}`, {
    method,
    headers: method === 'GET' ? { 'X-Anon-Id': anonId() } : { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify({ ...body, anonId: anonId() }) : undefined,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Não foi possível falar com a comunidade agora.');
  return data;
}

export const community = {
  stats: () => request('stats'),
  intentions: (before) => request('intentions', { params: before ? `&before=${before}` : '' }),
  addIntention: (text, firstName) => request('intentions', { method: 'POST', body: { text, firstName } }),
  pray: (id) => request('pray', { method: 'POST', body: { id } }),
  report: (id) => request('report', { method: 'POST', body: { id } }),
  // Marcações não podem atrapalhar a oração: se falharem, ficam só no aparelho.
  mark: (kind, ref) => request('event', { method: 'POST', body: { kind, ref } }).catch(() => null),
};

// Os números mudam pouco: uma busca por visita basta.
let statsPromise = null;
export function useCommunityStats() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    statsPromise ??= community.stats().catch(() => null);
    let alive = true;
    statsPromise.then((s) => alive && setStats(s));
    return () => {
      alive = false;
    };
  }, []);
  return stats;
}

export const plural = (n, one, many) => `${n.toLocaleString('pt-BR')} ${n === 1 ? one : many}`;
