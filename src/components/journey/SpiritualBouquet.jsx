import { useState } from 'react';
import { Copy, Minus, Plus, Printer, Share2, Trash2 } from 'lucide-react';
import { journey, useJourney } from '../../utils/journeyStore';

// O que se pode oferecer num buquê espiritual.
const OFFERINGS = [
  { id: 'tercos', one: 'terço', many: 'terços' },
  { id: 'missas', one: 'Missa', many: 'Missas' },
  { id: 'comunhoes', one: 'comunhão', many: 'comunhões' },
  { id: 'misericordia', one: 'Terço da Misericórdia', many: 'Terços da Misericórdia' },
  { id: 'avemarias', one: 'Ave-Maria', many: 'Ave-Marias' },
  { id: 'visitas', one: 'visita ao Santíssimo', many: 'visitas ao Santíssimo' },
  { id: 'sacrificios', one: 'sacrifício', many: 'sacrifícios' },
];

const describe = (items) =>
  OFFERINGS.filter((o) => items[o.id] > 0).map((o) => `${items[o.id]} ${items[o.id] === 1 ? o.one : o.many}`);

function bouquetText(b) {
  const lines = describe(b.items).map((l) => `🌹 ${l}`);
  return [
    `Buquê espiritual para ${b.to}`,
    b.intention && `Intenção: ${b.intention}`,
    '',
    'Ofereço a Deus por você:',
    ...lines,
    '',
    b.message,
    b.from && `Com carinho, ${b.from}`,
  ]
    .filter((l) => l !== undefined && l !== false && l !== null)
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Rosas desenhadas no topo do cartão.
function Flowers() {
  return (
    <svg className="bouquet-flowers" viewBox="0 0 120 60" aria-hidden="true">
      {[30, 60, 90].map((x, i) => (
        <g key={x} transform={`translate(${x} ${i === 1 ? 18 : 26})`}>
          <path className="stem" d={`M0 8 Q${i === 1 ? 0 : (i - 1) * -8} 26 ${(1 - i) * 10} 40`} />
          <circle className="rose" r="9" />
          <path className="petal" d="M-5 -1 Q0 -8 5 -1 Q0 4 -5 -1" />
        </g>
      ))}
    </svg>
  );
}

function BouquetCard({ bouquet, onRemove }) {
  const [status, setStatus] = useState('');
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  const flash = (m) => {
    setStatus(m);
    setTimeout(() => setStatus(''), 2500);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(bouquetText(bouquet));
      flash('Texto copiado');
    } catch {
      flash('Não foi possível copiar');
    }
  };
  const share = async () => {
    try {
      await navigator.share({ title: `Buquê espiritual para ${bouquet.to}`, text: bouquetText(bouquet) });
    } catch {
      // janela de compartilhar fechada
    }
  };
  const print = () => {
    document.body.classList.add('print-bouquet');
    document.querySelector(`[data-bouquet="${bouquet.id}"]`)?.classList.add('is-printing');
    window.addEventListener(
      'afterprint',
      () => {
        document.body.classList.remove('print-bouquet');
        document.querySelector('.is-printing')?.classList.remove('is-printing');
      },
      { once: true }
    );
    window.print();
  };

  return (
    <article className="bouquet-card" data-bouquet={bouquet.id}>
      <Flowers />
      <h3>Buquê espiritual para {bouquet.to}</h3>
      {bouquet.intention && <p className="bouquet-intention">Intenção: {bouquet.intention}</p>}
      <ul>
        {describe(bouquet.items).map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
      {bouquet.message && <p className="bouquet-message">{bouquet.message}</p>}
      {bouquet.from && <p className="bouquet-from">Com carinho, {bouquet.from}</p>}
      <div className="exam-export bouquet-actions">
        {canShare && (
          <button type="button" className="fx-small-btn" onClick={share}>
            <Share2 size={15} aria-hidden="true" /> Compartilhar
          </button>
        )}
        <button type="button" className="fx-small-btn" onClick={copy}>
          <Copy size={15} aria-hidden="true" /> Copiar
        </button>
        <button type="button" className="fx-small-btn" onClick={print}>
          <Printer size={15} aria-hidden="true" /> Imprimir ou PDF
        </button>
        <button type="button" className="filter-clear-link" onClick={onRemove}>
          <Trash2 size={14} aria-hidden="true" /> Apagar
        </button>
        <span className="exam-export-status" role="status">
          {status}
        </span>
      </div>
    </article>
  );
}

const EMPTY_FORM = { to: '', intention: '', message: '', from: '', items: {} };

/**
 * Buquê espiritual: uma tradição antiga. A pessoa oferece orações por alguém (um aniversário, uma doença,
 * um falecimento) e entrega um cartão com o que ofereceu. Fica guardado só neste aparelho.
 */
export default function SpiritualBouquet() {
  const { bouquets } = useJourney();
  const [form, setForm] = useState(EMPTY_FORM);
  const total = Object.values(form.items).reduce((a, b) => a + b, 0);

  const setCount = (id, delta) =>
    setForm({ ...form, items: { ...form.items, [id]: Math.max(0, Math.min(99, (form.items[id] ?? 0) + delta)) } });

  const submit = (e) => {
    e.preventDefault();
    if (!form.to.trim() || total === 0) return;
    journey.addBouquet({ ...form, to: form.to.trim(), from: form.from.trim() });
    setForm(EMPTY_FORM);
  };

  return (
    <section className="journey-card" aria-labelledby="bouquet-title">
      <header className="journey-card-head">
        <h2 id="bouquet-title">Buquê espiritual</h2>
        <p>
          Ofereça orações por alguém, num aniversário, numa doença ou num luto, e mande um cartão contando o que você
          ofereceu. Os nomes ficam só neste aparelho.
        </p>
      </header>

      <form className="bouquet-form" onSubmit={submit}>
        <label>
          Para quem?
          <input
            className="search"
            value={form.to}
            onChange={(e) => setForm({ ...form, to: e.target.value })}
            maxLength={60}
            placeholder="Ex.: Vó Maria"
            required
          />
        </label>
        <label>
          Intenção (opcional)
          <input
            className="search"
            value={form.intention}
            onChange={(e) => setForm({ ...form, intention: e.target.value })}
            maxLength={100}
            placeholder="Ex.: pela sua saúde"
          />
        </label>

        <fieldset className="bouquet-items">
          <legend>O que você oferece?</legend>
          {OFFERINGS.map((o) => {
            const n = form.items[o.id] ?? 0;
            return (
              <div key={o.id} className={`bouquet-item ${n > 0 ? 'is-on' : ''}`}>
                <span>{o.many.charAt(0).toUpperCase() + o.many.slice(1)}</span>
                <span className="bouquet-stepper">
                  <button type="button" onClick={() => setCount(o.id, -1)} aria-label={`Menos ${o.many}`} disabled={n === 0}>
                    <Minus size={14} />
                  </button>
                  <output aria-live="polite">{n}</output>
                  <button type="button" onClick={() => setCount(o.id, 1)} aria-label={`Mais ${o.many}`}>
                    <Plus size={14} />
                  </button>
                </span>
              </div>
            );
          })}
        </fieldset>

        <label>
          Mensagem (opcional)
          <textarea
            className="search"
            rows={3}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            maxLength={300}
            placeholder="Ex.: Estou rezando por você. Conte comigo!"
          />
        </label>
        <label>
          Seu nome (opcional)
          <input
            className="search"
            value={form.from}
            onChange={(e) => setForm({ ...form, from: e.target.value })}
            maxLength={60}
          />
        </label>

        <button type="submit" className="btn" disabled={!form.to.trim() || total === 0}>
          Montar o buquê
        </button>
      </form>

      {bouquets.length > 0 && (
        <div className="bouquet-list">
          {bouquets.map((b) => (
            <BouquetCard key={b.id} bouquet={b} onRemove={() => journey.removeBouquet(b.id)} />
          ))}
        </div>
      )}
    </section>
  );
}
