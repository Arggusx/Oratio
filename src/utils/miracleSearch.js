/* ============================================================
   Busca do globo dos milagres.
   - Milagres: procura na lista local (nome, cidade, país, ano, onde ver).
     Instantâneo e sem internet.
   - Lugares: Photon (photon.komoot.io), geocodificador aberto do
     OpenStreetMap que aceita sugestões enquanto se digita.
     Usado só para "voar até um lugar" e listar os milagres mais perto.
   ============================================================ */

/** Tira acentos e caixa: "Itália" e "italia" casam. */
export const normalize = (text) =>
  String(text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

/**
 * Milagres que batem com o texto, os melhores primeiro.
 * Peso: começo do nome ou da cidade > país > qualquer parte > resumo.
 */
export function searchMiracles(miracles, query, limit = 6) {
  const q = normalize(query);
  if (!q) return [];
  const words = q.split(/\s+/).filter(Boolean);

  return miracles
    .map((m) => {
      const fields = {
        name: normalize(m.name),
        place: normalize(m.place),
        country: normalize(m.country),
        year: normalize(`${m.year} ${m.yearLabel}`),
        where: normalize(m.whereToSee),
        summary: normalize(m.summary),
      };
      let score = 0;
      for (const w of words) {
        let best = 0;
        if (fields.place.startsWith(w) || fields.name.startsWith(w)) best = 10;
        else if (fields.country.startsWith(w)) best = 8;
        else if (fields.place.includes(w) || fields.name.includes(w) || fields.country.includes(w)) best = 6;
        else if (fields.year.includes(w)) best = 5;
        else if (fields.where.includes(w)) best = 3;
        else if (w.length >= 4 && fields.summary.includes(w)) best = 1;
        if (!best) return null; // toda palavra precisa aparecer em algum lugar
        score += best;
      }
      return { miracle: m, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.miracle.year - b.miracle.year)
    .slice(0, limit)
    .map((r) => r.miracle);
}

/** Distância em km entre dois pontos [lat, lng] (fórmula de haversine). */
export function distanceKm([lat1, lng1], [lat2, lng2]) {
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLng = (lng2 - lng1) * rad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

/** Os milagres mais perto de um ponto, com a distância. */
export function nearestMiracles(miracles, coords, limit = 5) {
  return miracles
    .map((m) => ({ miracle: m, km: distanceKm(coords, m.coords) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, limit);
}

export const formatKm = (km) =>
  km < 1 ? 'aqui' : `${Math.round(km).toLocaleString('pt-BR')} km`;

/* ---------- Lugares (Photon) ---------- */

const PHOTON_URL = 'https://photon.komoot.io/api/';
const placeCache = new Map(); // texto normalizado -> resultados (só nesta visita)

/** Um rótulo curto: "Lanciano, Abruzzo, Itália" sem repetir partes iguais. */
function placeLabel(p) {
  const parts = [p.name, p.city, p.state, p.country].filter(Boolean);
  return [...new Set(parts)].join(', ');
}

/**
 * Procura lugares no mundo. Devolve [{ id, label, coords: [lat, lng] }].
 * "signal" cancela a consulta quando o usuário continua digitando.
 */
export async function searchPlaces(query, signal) {
  const q = normalize(query);
  if (q.length < 3) return [];
  if (placeCache.has(q)) return placeCache.get(q);

  const url = `${PHOTON_URL}?q=${encodeURIComponent(query.trim())}&limit=5`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Photon respondeu ${res.status}`);
  const data = await res.json();

  const seen = new Set();
  const places = (data.features ?? [])
    .map((f) => {
      const [lng, lat] = f.geometry?.coordinates ?? [];
      const label = placeLabel(f.properties ?? {});
      return { id: `${f.properties?.osm_type}${f.properties?.osm_id}`, label, coords: [lat, lng] };
    })
    .filter((p) => Number.isFinite(p.coords[0]) && Number.isFinite(p.coords[1]) && p.label)
    .filter((p) => (seen.has(p.label) ? false : seen.add(p.label)));

  placeCache.set(q, places);
  return places;
}
