import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronDown, Copy, Download, Plus, Printer, Share2, ShieldCheck, Trash2, X } from 'lucide-react';
import { examination, confessionSteps } from '../data/examination';
import { prayers } from '../data/prayers';

const contrition = prayers.find((p) => p.id === 'ato-de-contricao');

const allItems = examination.flatMap((part) =>
  part.commandments.flatMap((c) => c.items.map((text, i) => ({ key: `${c.id}-${i}`, text, commandment: c })))
);

const today = () => new Date().toLocaleDateString('pt-BR');

/** A lista marcada em texto simples, agrupada por mandamento, para copiar, baixar ou compartilhar. */
function listAsText(selected, custom) {
  const groups = new Map();
  for (const item of selected) {
    const title = `${item.commandment.title} (${item.commandment.subtitle})`;
    groups.set(title, [...(groups.get(title) ?? []), item.text]);
  }
  if (custom.length > 0) groups.set('Outros', custom.map((c) => c.text));
  const body = [...groups].map(([title, items]) => [title, ...items.map((t) => `- ${t}`)].join('\n')).join('\n\n');
  return `Exame de consciência - ${today()}\n\n${body}\n`;
}

/**
 * Exame de consciência: a pessoa marca o que se aplica a ela e pode escrever o que não estiver na lista.
 * Nada é salvo nem enviado: a lista existe só enquanto a página está aberta. Exportar (copiar, baixar,
 * imprimir ou compartilhar) acontece no próprio aparelho, por escolha da pessoa.
 * Usado na página /home/confissao e na aba Confissão de Terço e Orações.
 */
export default function ConfessionGuide() {
  const [exported, setExported] = useState('');
  const [checked, setChecked] = useState(() => new Set());
  const [custom, setCustom] = useState([]);
  const [draft, setDraft] = useState('');

  const toggle = (key) => {
    const next = new Set(checked);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setChecked(next);
  };

  const addCustom = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setCustom([...custom, { key: `custom-${Date.now()}`, text }]);
    setDraft('');
  };

  const clearAll = () => {
    setChecked(new Set());
    setCustom([]);
    setDraft('');
  };

  const selected = allItems.filter((item) => checked.has(item.key));
  const total = selected.length + custom.length;

  const flash = (message) => {
    setExported(message);
    setTimeout(() => setExported(''), 2500);
  };

  const copyList = async () => {
    try {
      await navigator.clipboard.writeText(listAsText(selected, custom));
      flash('Lista copiada');
    } catch {
      flash('Não foi possível copiar');
    }
  };

  const downloadList = () => {
    const blob = new Blob([listAsText(selected, custom)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exame-de-consciencia-${today().replaceAll('/', '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    flash('Arquivo baixado');
  };

  // Imprime só a lista (ou salva em PDF pela janela de impressão do navegador).
  const printList = () => {
    document.body.classList.add('print-exam');
    window.addEventListener('afterprint', () => document.body.classList.remove('print-exam'), { once: true });
    window.print();
  };

  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  const shareList = async () => {
    try {
      await navigator.share({ title: 'Exame de consciência', text: listAsText(selected, custom) });
    } catch {
      // A pessoa fechou a janela de compartilhar: nada a fazer.
    }
  };

  return (
    <div className="confession-guide">
      <p className="confession-privacy">
        <ShieldCheck size={18} aria-hidden="true" />
        <span>
          <strong>Nada do que você marcar é salvo nem enviado.</strong> A lista fica só nesta tela e some quando você
          fecha ou recarrega a página. Se quiser levá-la com você, use os botões de exportar no fim: o arquivo fica
          no seu aparelho.
        </span>
      </p>

      <section className="confession-steps" aria-labelledby="confession-steps-title">
        <h2 id="confession-steps-title" className="saint-section-title">Como se confessar</h2>
        <ol>
          {confessionSteps.map(([title, text]) => (
            <li key={title}>
              <strong>{title}</strong>
              <span>{text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="exam-title">
        <h2 id="exam-title" className="saint-section-title">Examine-se</h2>
        <p className="confession-hint">
          Toque num mandamento para abrir as perguntas. Lembre-se de que só há pecado quando há conhecimento e
          liberdade: o que foi feito sem querer ou sem saber não pesa da mesma forma.
        </p>

        {examination.map((part) => (
          <div key={part.id} className="exam-part">
            <h3 className="exam-part-title">{part.title}</h3>
            {part.note && <p className="exam-part-note">{part.note}</p>}
            {part.commandments.map((c) => {
              const count = c.items.filter((_, i) => checked.has(`${c.id}-${i}`)).length;
              return (
                <details key={c.id} className="exam-group">
                  <summary>
                    <span>
                      <strong>{c.title}</strong>
                      <small>{c.subtitle}</small>
                    </span>
                    {count > 0 && <span className="exam-count">{count}</span>}
                    <ChevronDown size={18} className="exam-chevron" aria-hidden="true" />
                  </summary>
                  <ul>
                    {c.items.map((text, i) => {
                      const key = `${c.id}-${i}`;
                      return (
                        <li key={key}>
                          <label className={`exam-item ${checked.has(key) ? 'is-checked' : ''}`}>
                            <input type="checkbox" checked={checked.has(key)} onChange={() => toggle(key)} />
                            <span className="exam-box" aria-hidden="true">
                              <Check size={14} />
                            </span>
                            {text}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </details>
              );
            })}
          </div>
        ))}

        <form className="exam-custom" onSubmit={addCustom}>
          <label htmlFor="exam-custom-input">Não encontrou na lista? Escreva com as suas palavras:</label>
          <div className="exam-custom-row">
            <input
              id="exam-custom-input"
              className="search"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ex.: Fui impaciente com meu irmão"
              maxLength={200}
              autoComplete="off"
            />
            <button type="submit" className="btn" disabled={!draft.trim()}>
              <Plus size={16} aria-hidden="true" />
              Adicionar
            </button>
          </div>
        </form>


      </section>

      <section className="exam-summary" aria-labelledby="exam-summary-title" aria-live="polite">
        <div className="exam-summary-head">
          <h2 id="exam-summary-title" className="saint-section-title">Minha lista para a confissão</h2>
          {total > 0 && (
            <button type="button" className="filter-clear-link" onClick={clearAll}>
              <Trash2 size={14} aria-hidden="true" /> Limpar tudo
            </button>
          )}
        </div>
        {total === 0 ? (
          <p className="calendar-empty">Os itens que você marcar ou escrever aparecem aqui, em ordem.</p>
        ) : (
          <ol className="exam-summary-list">
            {selected.map((item) => (
              <li key={item.key}>
                {item.text}
                <small>{item.commandment.title}</small>
              </li>
            ))}
            {custom.map((item) => (
              <li key={item.key}>
                {item.text}
                <button
                  type="button"
                  className="exam-remove"
                  onClick={() => setCustom(custom.filter((c) => c.key !== item.key))}
                  aria-label={`Remover: ${item.text}`}
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ol>
        )}
        {total > 0 && (
          <div className="exam-export">
            <button type="button" className="fx-small-btn" onClick={copyList}>
              <Copy size={15} aria-hidden="true" /> Copiar
            </button>
            <button type="button" className="fx-small-btn" onClick={downloadList}>
              <Download size={15} aria-hidden="true" /> Baixar (.txt)
            </button>
            <button type="button" className="fx-small-btn" onClick={printList}>
              <Printer size={15} aria-hidden="true" /> Imprimir ou PDF
            </button>
            {canShare && (
              <button type="button" className="fx-small-btn" onClick={shareList}>
                <Share2 size={15} aria-hidden="true" /> Compartilhar
              </button>
            )}
            <span className="exam-export-status" role="status">
              {exported}
            </span>
          </div>
        )}
      </section>

      {contrition && (
        <section className="exam-contrition" aria-labelledby="contrition-title">
          <h2 id="contrition-title" className="saint-section-title">{contrition.title}</h2>
          <p className="prayer-full-text">{contrition.text}</p>
        </section>
      )}

      <p className="confession-footer">
        Depois da confissão, a lista não importa mais: os pecados perdoados são esquecidos por Deus (Is 43,25). Veja
        também <Link to="/home/oracoes?secao=oracoes">as orações</Link> e as dúvidas sobre os sacramentos na{' '}
        <Link to="/home/escola-da-fe">Escola da Fé</Link>.
      </p>
    </div>
  );
}
