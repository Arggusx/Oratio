import { useEffect, useState } from 'react';
import { Camera, ExternalLink } from 'lucide-react';
import { photosNear, streetViewUrl } from '../../utils/placePhotos';

/**
 * Fotos reais perto de um ponto (Wikimedia Commons) e o botão do Street View.
 * "title" muda o cabeçalho ("Fotos do lugar", "Neste ponto"...).
 */
export default function PlacePhotos({ coords, radius = 250, title = 'Fotos do lugar' }) {
  const [state, setState] = useState({ status: 'loading', photos: [] });
  const [lat, lng] = coords;

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading', photos: [] });
    photosNear([lat, lng], { radius, signal: controller.signal })
      .then((photos) => setState({ status: 'ready', photos }))
      .catch((err) => {
        if (err.name !== 'AbortError') setState({ status: 'error', photos: [] });
      });
    return () => controller.abort();
  }, [lat, lng, radius]);

  return (
    <section className="place-photos" aria-label={title}>
      <h4 className="place-photos-title">
        <Camera size={14} aria-hidden="true" />
        {title}
      </h4>

      {state.status === 'loading' && <p className="place-photos-note">Procurando fotos…</p>}
      {state.status === 'error' && <p className="place-photos-note">As fotos não carregaram agora.</p>}
      {state.status === 'ready' && state.photos.length === 0 && (
        <p className="place-photos-note">Ninguém publicou fotos livres deste ponto ainda.</p>
      )}

      {state.photos.length > 0 && (
        <ul className="place-photos-strip">
          {state.photos.map((p) => (
            <li key={p.id}>
              <a href={p.page} target="_blank" rel="noopener noreferrer" title={`${p.title} — ${p.author}`}>
                <img src={p.thumb} width={p.width} height={p.height} alt={p.title} loading="lazy" decoding="async" />
                <span className="place-photos-credit">
                  {p.author}
                  {p.license && ` · ${p.license}`}
                </span>
                <span className="sr-only"> (abre no Wikimedia Commons, em nova aba)</span>
              </a>
            </li>
          ))}
        </ul>
      )}

      <a className="place-photos-streetview" href={streetViewUrl(coords)} target="_blank" rel="noopener noreferrer">
        Ver no Street View
        <ExternalLink size={14} aria-hidden="true" />
        <span className="sr-only"> (abre o Google Maps em nova aba)</span>
      </a>
      <p className="place-photos-source">Fotos: Wikimedia Commons</p>
    </section>
  );
}
