import { useEffect, useRef, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

/**
 * Filtros reunidos atrás do botão "Filtros": em vez de dezenas de botões na página, a pessoa abre um painel,
 * escolhe com calma e confirma em "Aplicar filtros". Os filtros escolhidos aparecem ao lado do botão e
 * podem ser removidos um a um.
 *
 * groups: [{ id, label, options: [{ id, label }] }]; em values, null significa "todos".
 * countResults(draft), opcional, mostra no botão quantos resultados a escolha vai trazer.
 */
export default function FilterPanel({ groups, values, onApply, countResults }) {
  const dialogRef = useRef(null);
  const [draft, setDraft] = useState(values);

  const open = () => {
    setDraft(values);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

  // Clique no fundo escurecido (fora do painel) fecha sem aplicar.
  useEffect(() => {
    const dialog = dialogRef.current;
    const onClick = (e) => e.target === dialog && dialog.close();
    dialog?.addEventListener('click', onClick);
    return () => dialog?.removeEventListener('click', onClick);
  }, []);

  const apply = () => {
    onApply(draft);
    close();
  };

  const active = groups.flatMap((g) => {
    const option = g.options.find((o) => o.id === values[g.id]);
    return option ? [{ group: g, option }] : [];
  });
  const clearedValues = Object.fromEntries(groups.map((g) => [g.id, null]));
  const draftCount = countResults?.(draft);

  return (
    <div className="filter-bar">
      <button type="button" className="filter-open" onClick={open} aria-haspopup="dialog">
        <SlidersHorizontal size={16} aria-hidden="true" />
        Filtros
        {active.length > 0 && <span className="filter-open-count">{active.length}</span>}
      </button>

      {active.map(({ group, option }) => (
        <button
          key={group.id}
          type="button"
          className="filter-active-chip"
          onClick={() => onApply({ ...values, [group.id]: null })}
          aria-label={`Remover filtro ${group.label}: ${option.label}`}
        >
          {option.label}
          <X size={14} aria-hidden="true" />
        </button>
      ))}
      {active.length > 1 && (
        <button type="button" className="filter-clear-link" onClick={() => onApply(clearedValues)}>
          Limpar tudo
        </button>
      )}

      <dialog ref={dialogRef} className="filter-sheet" aria-labelledby="filter-sheet-title">
        <header className="filter-sheet-head">
          <h2 id="filter-sheet-title">Filtros</h2>
          <button type="button" className="filter-sheet-close" onClick={close} aria-label="Fechar sem aplicar">
            <X size={20} />
          </button>
        </header>

        <div className="filter-sheet-body">
          {groups.map((g) => (
            <fieldset key={g.id} className="filter-group">
              <legend>{g.label}</legend>
              <div className="filter-group-options">
                {g.options.map((o) => {
                  const selected = draft[g.id] === o.id;
                  // Quantos resultados esta opção traria junto com o que já está escolhido nos outros grupos.
                  const optionCount = countResults?.({ ...draft, [g.id]: o.id });
                  return (
                    <button
                      key={o.id}
                      type="button"
                      className={`intention-chip ${selected ? 'active' : ''}`}
                      aria-pressed={selected}
                      disabled={optionCount === 0 && !selected}
                      onClick={() => setDraft({ ...draft, [g.id]: selected ? null : o.id })}
                    >
                      {o.label}
                      {optionCount !== undefined && <span className="filter-option-count"> ({optionCount})</span>}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>

        <footer className="filter-sheet-foot">
          <button type="button" className="filter-sheet-clear" onClick={() => setDraft(clearedValues)}>
            Limpar
          </button>
          <button type="button" className="btn filter-sheet-apply" onClick={apply}>
            Aplicar filtros
            {draftCount !== undefined && ` (${draftCount})`}
          </button>
        </footer>
      </dialog>
    </div>
  );
}
