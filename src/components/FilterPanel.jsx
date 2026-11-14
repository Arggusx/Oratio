import { useEffect, useRef, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

/**
 * Filtros reunidos atrás do botão "Filtros": em vez de dezenas de botões na página, a pessoa abre um painel,
 * escolhe com calma e confirma em "Aplicar filtros". Os filtros escolhidos aparecem ao lado do botão e
 * podem ser removidos um a um.
 *
 * groups: [{ id, label, options: [{ id, label }] }]; em values, null significa "todos".
 *   Grupo com multiple: true aceita várias opções (o valor é uma lista; [] é "nenhuma");
 *   max limita quantas, e hint é uma linha de ajuda embaixo do título do grupo.
 * countResults(draft), opcional, mostra no botão quantos resultados a escolha vai trazer.
 * label, title e applyLabel trocam os textos do botão, do painel e do "Aplicar" (o padrão é "Filtros").
 */
const isSelected = (group, value, id) => (group.multiple ? (value ?? []).includes(id) : value === id);
const emptyValue = (group) => (group.multiple ? [] : null);

export default function FilterPanel({
  groups,
  values,
  onApply,
  countResults,
  label = 'Filtros',
  title = label,
  applyLabel = 'Aplicar filtros',
}) {
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

  const active = groups.flatMap((g) =>
    g.options.filter((o) => isSelected(g, values[g.id], o.id)).map((option) => ({ group: g, option }))
  );
  const clearedValues = Object.fromEntries(groups.map((g) => [g.id, emptyValue(g)]));

  // Tirar uma opção: no grupo de várias, só ela sai da lista.
  const without = (group, id) =>
    group.multiple ? (values[group.id] ?? []).filter((v) => v !== id) : null;

  // Sempre a partir do rascunho mais recente, para dois toques seguidos não se atropelarem.
  const toggle = (group, id) =>
    setDraft((prev) => {
      const current = prev[group.id];
      if (!group.multiple) return { ...prev, [group.id]: current === id ? null : id };
      const list = current ?? [];
      if (list.includes(id)) return { ...prev, [group.id]: list.filter((v) => v !== id) };
      if (group.max && list.length >= group.max) return prev;
      return { ...prev, [group.id]: [...list, id] };
    });
  const draftCount = countResults?.(draft);

  return (
    <div className="filter-bar">
      <button type="button" className="filter-open" onClick={open} aria-haspopup="dialog">
        <SlidersHorizontal size={16} aria-hidden="true" />
        {label}
        {active.length > 0 && <span className="filter-open-count">{active.length}</span>}
      </button>

      {active.map(({ group, option }) => (
        <button
          key={`${group.id}:${option.id}`}
          type="button"
          className="filter-active-chip"
          onClick={() => onApply({ ...values, [group.id]: without(group, option.id) })}
          aria-label={`Remover ${group.label}: ${option.label}`}
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
          <h2 id="filter-sheet-title">{title}</h2>
          <button type="button" className="filter-sheet-close" onClick={close} aria-label="Fechar sem aplicar">
            <X size={20} />
          </button>
        </header>

        <div className="filter-sheet-body">
          {groups.map((g) => (
            <fieldset key={g.id} className="filter-group">
              <legend>{g.label}</legend>
              {g.hint && <p className="filter-group-hint">{g.hint}</p>}
              <div className="filter-group-options">
                {g.options.map((o) => {
                  const selected = isSelected(g, draft[g.id], o.id);
                  // Quantos resultados esta opção traria junto com o que já está escolhido nos outros grupos.
                  const optionCount = g.multiple ? undefined : countResults?.({ ...draft, [g.id]: o.id });
                  const full = g.multiple && g.max && (draft[g.id] ?? []).length >= g.max;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      className={`intention-chip ${selected ? 'active' : ''}`}
                      aria-pressed={selected}
                      disabled={(optionCount === 0 || full) && !selected}
                      onClick={() => toggle(g, o.id)}
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
            {applyLabel}
            {draftCount !== undefined && ` (${draftCount})`}
          </button>
        </footer>
      </dialog>
    </div>
  );
}
