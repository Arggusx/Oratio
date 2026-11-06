/**
 * Junta duas Jornadas (a do aparelho e a da conta) sem perder nada:
 * listas viram a união, contadores ficam com o maior valor e novenas/trilhas com o plano mais recente.
 * Usada no login e quando a página abre com a conta conectada.
 */

const union = (a = [], b = []) => [...new Set([...a, ...b])];

const unionById = (a = [], b = []) => {
  const seen = new Map();
  [...a, ...b].forEach((item) => {
    const key = item && typeof item === 'object' ? item.id ?? JSON.stringify(item) : item;
    if (!seen.has(key)) seen.set(key, item);
  });
  return [...seen.values()];
};

// Novenas e trilhas: { [id]: { start, done: [] } }. Mesmo começo: junta os dias feitos; começos diferentes: o plano mais novo.
function mergePlans(a = {}, b = {}) {
  const out = { ...b, ...a };
  Object.keys(out).forEach((id) => {
    const x = a[id];
    const y = b[id];
    if (!x || !y) return;
    if (x.start === y.start) out[id] = { ...y, ...x, done: union(x.done, y.done).sort((m, n) => m - n) };
    else out[id] = String(x.start) > String(y.start) ? x : y;
  });
  return out;
}

function mergeCounters(a = {}, b = {}) {
  const out = { ...b, ...a };
  Object.keys(out).forEach((k) => {
    if (!a[k] || !b[k]) return;
    out[k] = { answered: Math.max(a[k].answered || 0, b[k].answered || 0), correct: Math.max(a[k].correct || 0, b[k].correct || 0) };
  });
  return out;
}

function mergeLevels(a = {}, b = {}) {
  const out = { ...b, ...a };
  Object.keys(out).forEach((k) => {
    out[k] = union(a[k], b[k]).sort((m, n) => m - n);
  });
  return out;
}

// Perfil: o que estiver preenchido no aparelho vale; o resto vem da conta.
function mergeProfile(local = {}, remote = {}) {
  const out = { ...remote };
  Object.entries(local).forEach(([k, v]) => {
    if (v !== '' && v != null) out[k] = v;
  });
  return out;
}

export function mergeJourney(local = {}, remote = {}) {
  return {
    ...remote,
    ...local,
    prayedDays: union(local.prayedDays, remote.prayedDays).sort(),
    saints: union(local.saints, remote.saints),
    miracles: union(local.miracles, remote.miracles),
    seenIntros: union(local.seenIntros, remote.seenIntros),
    rewardsSeen: union(local.rewardsSeen, remote.rewardsSeen),
    bouquets: unionById(local.bouquets, remote.bouquets),
    novenas: mergePlans(local.novenas, remote.novenas),
    trails: mergePlans(local.trails, remote.trails),
    quizzes: mergeCounters(local.quizzes, remote.quizzes),
    quizLevels: mergeLevels(local.quizLevels, remote.quizLevels),
    profile: mergeProfile(local.profile, remote.profile),
  };
}
