import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronDown, Plus, ShieldCheck, Trash2, X } from 'lucide-react';
import Candle from '../components/anim/Candle';
import { examination, capitalSins, confessionSteps } from '../data/examination';
import { prayers } from '../data/prayers';

const contrition = prayers.find((p) => p.id === 'ato-de-contricao');

const allItems = examination.flatMap((part) =>
  part.commandments.flatMap((c) => c.items.map((text, i) => ({ key: `${c.id}-${i}`, text, commandment: c })))
);

/**
 * Exame de consciência: a pessoa marca o que se aplica a ela e pode escrever o que não estiver na lista.
 * Nada é salvo nem enviado: a lista existe só enquanto a página está aberta.
 */
export default function Confissao() {
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

  return (
    <main className="page confession-page">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">Sacramento da Reconciliação</span>
          <h1 className="section-title">Exame de consciência</h1>
        </div>
        <Candle />
      </div>
      <p className="lead">
        Um roteiro para se preparar para a confissão: reze, marque o que se aplica a você e leve a lista com você.
      </p>

      <p className="confession-privacy">
        <ShieldCheck size={18} aria-hidden="true" />
        <span>
          <strong>Nada do que você marcar é salvo nem enviado.</strong> A lista fica só nesta tela e some quando você
          fecha ou recarrega a página.
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

        <details className="exam-capital">
          <summary>
            Para ir mais fundo: os sete pecados capitais
            <ChevronDown size={18} className="exam-chevron" aria-hidden="true" />
          </summary>
          <p>São as raízes dos outros pecados. Ver qual deles mais se repete ajuda a saber onde lutar.</p>
          <dl>
            {capitalSins.map(([name, text]) => (
              <div key={name}>
                <dt>{name}</dt>
                <dd>{text}</dd>
              </div>
            ))}
          </dl>
        </details>
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
    </main>
  );
}
