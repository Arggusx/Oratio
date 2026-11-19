/* ============================================================
   Fotos reais de um lugar, pela coordenada.
   Fonte: Wikimedia Commons (fotos livres, sem chave). Cada foto
   vem com autor e licença, que precisam aparecer junto dela.
   E o link do Google Street View, que abre em outra aba (embutir
   a imagem exigiria uma chave paga do Google Cloud).
   ============================================================ */

const COMMONS_API = 'https://commons.wikimedia.org/w/api.php';
const cache = new Map(); // "lat,lng,raio" -> fotos (só nesta visita)

/** Tira as tags HTML que o Commons manda no nome do autor. */
const plainText = (html = '') => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return (div.textContent || '').replace(/\s+/g, ' ').trim();
};

/**
 * Até "limit" fotos tiradas a até "radius" metros do ponto, as mais perto primeiro.
 * Devolve [{ id, thumb, width, height, page, title, author, license }].
 */
export async function photosNear([lat, lng], { radius = 250, limit = 8, signal } = {}) {
  const key = `${lat.toFixed(4)},${lng.toFixed(4)},${radius}`;
  if (cache.has(key)) return cache.get(key);

  const params = new URLSearchParams({
    action: 'query',
    generator: 'geosearch',
    ggscoord: `${lat}|${lng}`,
    ggsradius: String(Math.min(Math.max(radius, 10), 10000)),
    ggslimit: String(limit * 2), // vêm alguns desenhos e PDFs, que saem no filtro
    ggsnamespace: '6', // só arquivos
    prop: 'imageinfo',
    iiprop: 'url|mime|extmetadata',
    iiurlwidth: '480',
    iiextmetadatafilter: 'Artist|LicenseShortName|ObjectName',
    format: 'json',
    origin: '*',
  });
  const res = await fetch(`${COMMONS_API}?${params}`, { signal });
  if (!res.ok) throw new Error(`Commons respondeu ${res.status}`);
  const data = await res.json();

  const photos = Object.values(data.query?.pages ?? {})
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0)) // a geosearch já ordena pela distância
    .map((p) => {
      const info = p.imageinfo?.[0];
      if (!info || !/^image\/(jpeg|png|webp)$/.test(info.mime)) return null;
      const meta = info.extmetadata ?? {};
      return {
        id: p.pageid,
        thumb: info.thumburl,
        width: info.thumbwidth,
        height: info.thumbheight,
        page: info.descriptionurl,
        title: plainText(meta.ObjectName?.value) || p.title.replace(/^File:|\.\w+$/g, ''),
        author: plainText(meta.Artist?.value) || 'autor no Commons',
        license: plainText(meta.LicenseShortName?.value),
      };
    })
    .filter(Boolean)
    .slice(0, limit);

  cache.set(key, photos);
  return photos;
}

/** Abre o Street View do Google no panorama mais perto do ponto (sem chave). */
export const streetViewUrl = ([lat, lng]) =>
  `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
