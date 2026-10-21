import { ChevronDown } from 'lucide-react';

/** Botão "Ver mais" usado nas listas longas (ver utils/useLoadMore.js). */
export function LoadMoreButton({ remaining, onClick, label = 'Ver mais' }) {
  if (remaining <= 0) return null;
  return (
    <button type="button" className="load-more" onClick={onClick}>
      {label}
      <span className="load-more-count">+{remaining}</span>
      <ChevronDown size={16} aria-hidden="true" />
    </button>
  );
}
