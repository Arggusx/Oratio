import { useSyncExternalStore } from 'react';
import { journeySync } from './journeyStore';
import { mergeJourney } from './journeyMerge';

/**
 * Conta do Oratio (opcional): "Entrar com Google" guarda a Jornada na conta e a mantém igual em
 * todos os aparelhos. O progresso continua no aparelho; a conta é uma cópia sincronizada.
 * Sem VITE_GOOGLE_CLIENT_ID, nada disso aparece.
 */
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const API_BASE = import.meta.env.VITE_API_ORACAO || 'https://daily-prayer-api.vercel.app';
const ENDPOINT = `${API_BASE}/api/account`;
const SESSION_KEY = 'oratio:conta';
const SAVE_DELAY_MS = 2000;

const EMPTY = { token: null, user: null, status: 'idle', syncedAt: null, error: '' };

function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return EMPTY;
    const { token, user } = JSON.parse(raw);
    return token ? { ...EMPTY, token, user } : EMPTY;
  } catch {
    return EMPTY;
  }
}

let state = readSession();
const listeners = new Set();

function set(patch) {
  state = { ...state, ...patch };
  try {
    if (state.token) localStorage.setItem(SESSION_KEY, JSON.stringify({ token: state.token, user: state.user }));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    // sem armazenamento: a sessão vale só nesta visita
  }
  listeners.forEach((l) => l());
}

export function useAccount() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
    () => EMPTY,
  );
}

async function request(route, { method = 'GET', body, token = state.token } = {}) {
  const res = await fetch(`${ENDPOINT}?r=${route}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && route !== 'login') {
    // Sessão vencida ou conta apagada em outro aparelho: sai sem apagar o progresso do aparelho.
    stopAutoSave();
    set({ ...EMPTY, error: data.error || 'Sua sessão expirou. Entre de novo.' });
  }
  if (!res.ok) throw new Error(data.error || 'Não foi possível falar com a sua conta agora.');
  return data;
}

// A foto do medalhão nunca sai do aparelho (como promete a Política de Privacidade): vai vazia para a conta.
const forAccount = (data) => ({ ...data, profile: { ...data.profile, photo: '' } });

const saveProgress = () => request('progress', { method: 'PUT', body: { data: forAccount(journeySync.get()) } });

// Junta o que está na conta com o que está no aparelho e grava o resultado nos dois lugares.
async function reconcile(remote) {
  const merged = remote?.data ? mergeJourney(journeySync.get(), remote.data) : journeySync.get();
  pausedSave = true;
  journeySync.replace(merged);
  pausedSave = false;
  const { updatedAt } = await saveProgress();
  set({ status: 'synced', syncedAt: updatedAt, error: '' });
}

let saveTimer = null;
let unsubscribe = null;
let pausedSave = false;
let resuming = null;

function scheduleSave() {
  if (pausedSave || !state.token) return;
  clearTimeout(saveTimer);
  set({ status: 'saving' });
  saveTimer = setTimeout(async () => {
    try {
      const { updatedAt } = await saveProgress();
      set({ status: 'synced', syncedAt: updatedAt, error: '' });
    } catch (err) {
      if (state.token) set({ status: 'error', error: err.message });
    }
  }, SAVE_DELAY_MS);
}

function startAutoSave() {
  if (!unsubscribe) unsubscribe = journeySync.subscribe(scheduleSave);
}

function stopAutoSave() {
  clearTimeout(saveTimer);
  unsubscribe?.();
  unsubscribe = null;
}

export const account = {
  /** Recebe o ID token do botão do Google. */
  async login(credential) {
    set({ status: 'saving', error: '' });
    try {
      const { token, user, progress } = await request('login', { method: 'POST', body: { credential }, token: null });
      set({ token, user });
      await reconcile(progress);
      startAutoSave();
    } catch (err) {
      set({ status: 'error', error: err.message });
    }
  },

  /** Ao abrir o site já conectado: traz o que mudou em outros aparelhos (uma vez por visita). */
  resume() {
    if (!state.token || !GOOGLE_CLIENT_ID) return Promise.resolve();
    resuming ??= (async () => {
      try {
        const { user, progress } = await request('me');
        set({ user });
        await reconcile(progress);
        startAutoSave();
      } catch (err) {
        if (state.token) set({ status: 'error', error: err.message });
      }
    })();
    return resuming;
  },

  async setWantsMessages(wantsMessages) {
    const { user } = await request('preferences', { method: 'PATCH', body: { wantsMessages } });
    set({ user });
  },

  /** Sai da conta neste aparelho. O progresso continua aqui e na conta. */
  logout() {
    stopAutoSave();
    window.google?.accounts.id.disableAutoSelect();
    set(EMPTY);
  },

  /** Apaga a conta e o progresso guardado nela. O progresso deste aparelho fica. */
  async deleteAccount() {
    await request('account', { method: 'DELETE' });
    account.logout();
  },
};
