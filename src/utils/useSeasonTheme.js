import { createContext, useContext, useEffect, useState } from 'react';
import { FEAST_THEMES, getSeasonTheme, SEASON_THEMES } from './liturgicalCalendar';

const PREVIEW_KEY = 'oratio:tempo-teste';

/**
 * Tema do tempo litúrgico de hoje, aplicado em <html data-season="...">, e o dia especial,
 * em <html data-feast="...">: o CSS troca cores, fundo e enfeites.
 * Para pré-visualizar: ?tempo=natal ou ?tempo=corpus-christi (vale até fechar a aba); ?tempo=auto volta ao calendário.
 */
function readPreview() {
  try {
    const param = new URLSearchParams(window.location.search).get('tempo');
    if (param === 'auto') sessionStorage.removeItem(PREVIEW_KEY);
    else if (SEASON_THEMES.includes(param) || FEAST_THEMES[param]) sessionStorage.setItem(PREVIEW_KEY, param);
    return sessionStorage.getItem(PREVIEW_KEY);
  } catch {
    return null; // armazenamento indisponível: segue o calendário
  }
}

function previewTheme(preview) {
  if (FEAST_THEMES[preview]) return { theme: FEAST_THEMES[preview], adventWeek: 0, feast: preview, preview: true };
  // Na pré-visualização do Advento, mostra a coroa com duas velas acesas.
  return { theme: preview, adventWeek: preview === 'advento' ? 2 : 0, feast: null, preview: true };
}

export function useSeasonTheme() {
  const [season] = useState(() => {
    const preview = readPreview();
    return preview ? previewTheme(preview) : getSeasonTheme();
  });

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.season = season.theme;
    if (season.feast) root.dataset.feast = season.feast;
    else delete root.dataset.feast;
  }, [season.theme, season.feast]);

  return season;
}

export const SeasonContext = createContext({ theme: 'comum', adventWeek: 0, feast: null });

export const useSeason = () => useContext(SeasonContext);
