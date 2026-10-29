import { ChevronDown } from 'lucide-react';

/**
 * Botão "Ver mais" usado nas listas longas (ver utils/useLoadMore.js).
 * remaining = null: lista que vem do servidor aos poucos, sem total conhecido (sem o "+N").
 */
export function LoadMoreButton({ remaining, onClick, label = 'Ver mais' }) {
  if (remaining !== null && remaining <= 0) return null;
  return (
    <button type="button" className="load-more" onClick={onClick}>
      {label}
      {remaining !== null && <span className="load-more-count">+{remaining}</span>}
      <ChevronDown size={16} aria-hidden="true" />
    </button>
  );
}
