import { useState } from 'react';
import { Copy, Minus, Plus, Printer, Share2, Trash2 } from 'lucide-react';
import { journey, useJourney } from '../../utils/journeyStore';
import GameIntro from '../GameIntro';

// O que se pode oferecer num buquê espiritual.
// Cada oferta vira uma flor de uma cor no vaso.
const OFFERINGS = [
  { id: 'tercos', one: 'terço', many: 'terços', color: '#C2486A' },
  { id: 'missas', one: 'Missa', many: 'Missas', color: '#F2C14E' },
  { id: 'comunhoes', one: 'comunhão', many: 'comunhões', color: '#FFFDF9' },
  { id: 'misericordia', one: 'Terço da Misericórdia', many: 'Terços da Misericórdia', color: '#E8643C' },
  { id: 'avemarias', one: 'Ave-Maria', many: 'Ave-Marias', color: '#6E8FD6' },
  { id: 'visitas', one: 'visita ao Santíssimo', many: 'visitas ao Santíssimo', color: '#E9C46A' },
  { id: 'sacrificios', one: 'sacrifício', many: 'sacrifícios', color: '#9B7BC4' },
];

const MAX_FLOWERS = 15;

/** O vaso que vai ganhando uma flor para cada oferta, enquanto a pessoa monta o buquê. */
export function BouquetVase({ items, caption = true }) {
  const flowers = OFFERINGS.flatMap((o) => Array.from({ length: items[o.id] ?? 0 }, () => o.color)).slice(
    0,
    MAX_FLOWERS,
  );
  const total = Object.values(items).reduce((a, b) => a + b, 0);
  return (
    <figure className="bouquet-vase" aria-label={`Buquê com ${total} ${total === 1 ? 'oferta' : 'ofertas'}`}>
      <svg viewBox="0 0 160 170" aria-hidden="true" focusable="false">
        {flowers.map((color, i) => {
          // As flores se abrem em leque, as primeiras no centro.
          const side = i % 2 === 0 ? 1 : -1;
          const spread = Math.ceil(i / 2) * 9 * side;
          const height = 82 - Math.abs(spread) * 0.5 - (i % 3) * 9;
          const x = 80 + spread * 1.6;
          const y = 92 - height;
          return (
            <g key={i} className="bouquet-flower" style={{ '--i': i }}>
              <path className="bouquet-stem" d={`M80 120 Q${80 + spread * 0.6} ${100 - height / 2} ${x} ${y}`} />
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse key={a} cx={x} cy={y - 8} rx="5.5" ry="9" fill={color} transform={`rotate(${a} ${x} ${y})`} />
              ))}
              <circle cx={x} cy={y} r="4.2" className="bouquet-flower-center" />
            </g>
          );
        })}
        <path className="bouquet-vase-body" d="M54 118h52l-8 44H62z" />
        <path className="bouquet-vase-rim" d="M50 112h60v8H50z" />
      </svg>
      {caption && (
        <figcaption>
          {total === 0 ? 'Escolha as ofertas para encher o vaso' : `${total} ${total === 1 ? 'oferta' : 'ofertas'}`}
        </figcaption>
      )}
    </figure>
  );
}

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
      { once: true },
    );
    window.print();
  };

  return (
    <article className="bouquet-card" data-bouquet={bouquet.id}>
      {/* O mesmo vaso que a pessoa montou, com uma flor para cada oferta */}
      <span className="bouquet-card-corner is-tl" aria-hidden="true" />
      <span className="bouquet-card-corner is-br" aria-hidden="true" />
      <span className="bouquet-card-kicker">Buquê espiritual</span>
      <h3>para {bouquet.to}</h3>
      {bouquet.intention && <p className="bouquet-intention">{bouquet.intention}</p>}
      <BouquetVase items={bouquet.items} caption={false} />
      <p className="bouquet-card-offer">Ofereço a Deus por você</p>
      <ul className="bouquet-ribbons">
        {OFFERINGS.filter((o) => bouquet.items[o.id] > 0).map((o) => (
          <li key={o.id} style={{ '--flower': o.color }}>
            <span className="bouquet-ribbon-dot" aria-hidden="true" />
            {bouquet.items[o.id]} {bouquet.items[o.id] === 1 ? o.one : o.many}
          </li>
        ))}
      </ul>
      {bouquet.message && <blockquote className="bouquet-message">{bouquet.message}</blockquote>}
      {bouquet.from && <p className="bouquet-from">Com carinho, {bouquet.from}</p>}
      <p className="bouquet-date">
        {new Date(`${bouquet.created}T12:00`).toLocaleDateString('pt-BR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </p>
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

      <GameIntro
        id="buque"
        steps={[
          'Escolha para quem é o buquê e, se quiser, a intenção.',
          'Use o + e o − para dizer o que você vai oferecer: terços, Missas, comunhões, sacrifícios... Cada oferta vira uma flor no vaso.',
          'Toque em "Montar o buquê": aparece um cartão para compartilhar, copiar ou imprimir. Depois, é só rezar o que prometeu.',
        ]}
      />

      <div className="bouquet-layout">
        <BouquetVase items={form.items} />
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
                    <button
                      type="button"
                      onClick={() => setCount(o.id, -1)}
                      aria-label={`Menos ${o.many}`}
                      disabled={n === 0}
                    >
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
      </div>

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
