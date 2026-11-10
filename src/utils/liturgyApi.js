/* ============================================================
   API "Liturgia Diária" (liturgia.up.railway.app), já liberada na CSP.
   Devolve, para um dia: nome da celebração (com o grau no fim, como
   ", Solenidade" ou ", Memória"), cor, orações, antífonas e leituras.
   ============================================================ */

export const LITURGY_API_URL = 'https://liturgia.up.railway.app/v2/';

/** Busca a liturgia de uma data (ou de hoje, sem data). Lança erro se a API falhar ou demorar. */
export async function fetchLiturgy(date, { timeoutMs = 10000 } = {}) {
  const url = new URL(LITURGY_API_URL);
  if (date) {
    url.searchParams.set('dia', String(date.getDate()).padStart(2, '0'));
    url.searchParams.set('mes', String(date.getMonth() + 1).padStart(2, '0'));
    url.searchParams.set('ano', String(date.getFullYear()));
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error('Falha na API da Liturgia');
    const data = await response.json();
    if (!data?.liturgia) throw new Error('Resposta sem liturgia');
    return data;
  } finally {
    clearTimeout(timer);
  }
}

// Tons escurecidos o suficiente para serem legíveis como texto (contraste ≥ 4,5:1).
export const LITURGICAL_COLORS = {
  Verde: '#517255',
  Vermelho: '#AE463D',
  Roxo: '#73537B',
  Branco: '#6A6A6A',
  Rosa: '#A15268',
};
