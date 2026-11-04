import { createContext, useContext, useEffect, useState } from 'react';
import { getSeasonTheme, SEASON_THEMES } from './liturgicalCalendar';

const PREVIEW_KEY = 'oratio:tempo-teste';

/**
 * Tema do tempo litúrgico de hoje, aplicado em <html data-season="...">: o CSS troca cores, fundo e enfeites.
 * Para pré-visualizar outro tempo: ?tempo=natal (vale até fechar a aba); ?tempo=auto volta ao calendário.
 */
function readPreview() {
  try {
    const param = new URLSearchParams(window.location.search).get('tempo');
    if (param === 'auto') sessionStorage.removeItem(PREVIEW_KEY);
    else if (SEASON_THEMES.includes(param)) sessionStorage.setItem(PREVIEW_KEY, param);
    return sessionStorage.getItem(PREVIEW_KEY);
  } catch {
    return null; // armazenamento indisponível: segue o calendário
  }
}

export function useSeasonTheme() {
  const [season] = useState(() => {
    const today = getSeasonTheme();
    const preview = readPreview();
    // Na pré-visualização do Advento, mostra a coroa com duas velas acesas.
    return preview ? { theme: preview, adventWeek: preview === 'advento' ? 2 : 0, preview: true } : today;
  });

  useEffect(() => {
    document.documentElement.dataset.season = season.theme;
  }, [season.theme]);

  return season;
}

export const SeasonContext = createContext({ theme: 'comum', adventWeek: 0 });

export const useSeason = () => useContext(SeasonContext);
