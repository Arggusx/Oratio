import { Check } from 'lucide-react';

/**
 * Caixinha opcional "Rezei este passo", no terço desenhado e na lista de passos.
 * Serve só para a pessoa não perder o fio: nada depende dela.
 */
export default function RosaryCheck({ checked, onChange, label = 'Rezei este passo' }) {
  return (
    <label className={`rosary-check ${checked ? 'is-checked' : ''}`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="rosary-check-box" aria-hidden="true">
        <Check size={13} strokeWidth={3} />
      </span>
      {label}
    </label>
  );
}
