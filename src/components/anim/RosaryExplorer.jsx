import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import RosaryCheck from '../RosaryCheck';
import { rosaryLoop, rosaryPendant } from '../../utils/rosaryShape';
import { FATIMA_PRAYER, GLORY_BE, ORDINAL_WORDS, OUR_FATHER } from '../../data/rosaryData';

/**
 * Terço interativo do passo a passo: o terço se monta ao aparecer; tocar numa parte mostra,
 * ao lado, o que rezar nela, já com o texto da oração (sem precisar rolar até a lista).
 * Cada passo tem uma caixinha opcional "Rezei este passo" para não perder o fio. "Anterior" e "Próximo" percorrem o terço na ordem da oração.
 *
 * No passo das dezenas, o próprio desenho vira o contador: a pessoa reza dezena por dezena,
 * com o mistério e a Ave-Maria (com a cláusula) ao lado, e as contas acendem uma a uma.
 *
 * Passos do terço tradicional → partes:
 *   0–2 cruz (Sinal da Cruz, oferecimento, Creio) · 3 conta grande (Pai-Nosso)
 *   4 três contas pequenas · 5 conta grande (Glória) · 6 as dezenas · 7 a medalha (Salve-Rainha)
 */
const CX = 120;
const PART_OF_STEP = ['cruz', 'cruz', 'cruz', 'pai', 'aves', 'gloria', 'dezenas', 'medalha'];
const DECADES_STEP = PART_OF_STEP.indexOf('dezenas');
const AVES = 10;

const MYSTERY_ADJECTIVE = { gozosos: 'gozoso', luminosos: 'luminoso', dolorosos: 'doloroso', gloriosos: 'glorioso' };
/** "1º Mistério: A Anunciação" → "A Anunciação". */
const shortName = (name) => name.split(': ').slice(1).join(': ') || name;
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

export default function RosaryExplorer({ steps, activeIndex, onOpenStep, mysteryKey, mystery, done, onSetDone }) {
  const [picked, setPicked] = useState(null);
  const [assembled, setAssembled] = useState(false);
  const [decade, setDecade] = useState(0); // 0 a 4
  const [aves, setAves] = useState(0); // Ave-Marias rezadas na dezena atual

  useEffect(() => {
    const t = setTimeout(() => setAssembled(true), 400);
    return () => clearTimeout(t);
  }, []);

  // Trocou o grupo de mistérios: recomeça as dezenas.
  useEffect(() => {
    setDecade(0);
    setAves(0);
  }, [mysteryKey]);

  const { loop, pendant } = useMemo(() => {
    const shape = rosaryLoop({ cx: CX, top: 14, bottom: 206, width: 176, gap: 15 });
    // Posição de cada conta pequena dentro da sua dezena (0 a 9), para acender na ordem.
    const seen = {};
    const beads = shape.beads.map((b) => {
      if (b.large) return b;
      seen[b.decade] = (seen[b.decade] ?? 0) + 1;
      return { ...b, ave: seen[b.decade] - 1 };
    });
    return { loop: { ...shape, beads }, pendant: rosaryPendant({ cx: CX, top: 214, step: 16 }) };
  }, []);

  // Sem escolha no terço, acompanha o passo aberto na lista (ou começa pela cruz).
  const current = picked ?? Math.max(activeIndex, 0);
  const step = steps[current];
  const currentPart = PART_OF_STEP[current];
  const praying = current === DECADES_STEP && Boolean(mystery);
  const partDone = (part) => PART_OF_STEP.slice(0, current + 1).includes(part);
  // Rezando as dezenas, cada conta do laço mostra o próprio estado; o grupo não fica todo aceso.
  const cls = (part) =>
    praying && part === 'dezenas'
      ? 'rosary-x-part is-praying'
      : `rosary-x-part ${partDone(part) ? 'is-done' : ''} ${currentPart === part ? 'is-current' : ''}`;
  const pick = (part) => setPicked(PART_OF_STEP.indexOf(part));

  const beadCls = (b) => {
    if (!praying) return 'rosary-x-bead';
    const lit = b.decade < decade || (b.decade === decade && (b.large ? true : b.ave < aves));
    return `rosary-x-bead ${lit ? 'is-lit' : ''} ${b.decade === decade ? 'is-this-decade' : ''}`;
  };

  const p = Object.fromEntries(pendant.beads.map((b) => [b.id, b]));

  // Avança uma Ave-Maria; completa a dezena e passa para a próxima; depois da quinta, vai ao encerramento.
  const nextAve = () => {
    if (aves < AVES) setAves(aves + 1);
    else if (decade < 4) {
      setDecade(decade + 1);
      setAves(0);
    } else {
      // Terminou as cinco dezenas: o passo das dezenas fica marcado sozinho.
      onSetDone?.(steps[DECADES_STEP].id, true);
      setPicked(DECADES_STEP + 1);
    }
  };

  const prevAve = () => {
    if (aves > 0) setAves(aves - 1);
    else if (decade > 0) {
      setDecade(decade - 1);
      setAves(AVES);
    } else setPicked(DECADES_STEP - 1);
  };

  const m = praying ? mystery.mysteries[decade] : null;
  const nextLabel = aves < AVES ? 'Rezei a Ave-Maria' : decade < 4 ? 'Próxima dezena' : 'Ir para o encerramento';

  return (
    <section className="rosary-x" aria-label="Terço interativo" style={mystery ? { '--accent': mystery.color } : undefined}>
      <div className={`rosary-x-figure fx-assembly ${assembled ? '' : 'is-exploded'}`}>
        <svg viewBox="0 0 240 320" role="group" aria-label="Toque numa parte do terço">
          <path className="rosary-x-string" d={`M${CX} ${loop.medal.y + 10}V${pendant.cross.y}`} />

          {/* dezenas: a área de toque é uma faixa larga e invisível ao longo do laço */}
          <g className={`${cls('dezenas')} fx-part`} style={{ '--dx': '0px', '--dy': '-36px', '--i': 5 }} onClick={() => pick('dezenas')}>
            <path className="rosary-x-hit-stroke" d={loop.d} />
            <path className="rosary-x-string" d={loop.d} />
            {loop.beads.map((b) => (
              <circle key={b.order} className={beadCls(b)} cx={b.x} cy={b.y} r={b.large ? 6.2 : 4} />
            ))}
          </g>

          <g className={`${cls('medalha')} fx-part`} style={{ '--dx': '0px', '--dy': '26px', '--i': 4 }} onClick={() => pick('medalha')}>
            <circle className="rosary-x-hit" cx={CX} cy={loop.medal.y + 2} r="15" />
            <circle className="rosary-x-medal" cx={CX} cy={loop.medal.y + 2} r="9.5" />
            <path className="rosary-x-mark" d={`M${CX} ${loop.medal.y - 3}v10M${CX - 4} ${loop.medal.y + 1}h8`} />
          </g>

          <g className={`${cls('gloria')} fx-part`} style={{ '--dx': '-60px', '--dy': '-6px', '--i': 3 }} onClick={() => pick('gloria')}>
            <circle className="rosary-x-hit" cx={CX} cy={p.gloria.y} r="11" />
            <circle className="rosary-x-bead" cx={CX} cy={p.gloria.y} r="6.2" />
          </g>

          <g className={`${cls('aves')} fx-part`} style={{ '--dx': '60px', '--dy': '14px', '--i': 2 }} onClick={() => pick('aves')}>
            <rect className="rosary-x-hit" x={CX - 12} y={p['ave-1'].y - 8} width="24" height={p['ave-3'].y - p['ave-1'].y + 16} rx="10" />
            {['ave-1', 'ave-2', 'ave-3'].map((id) => (
              <circle key={id} className="rosary-x-bead" cx={CX} cy={p[id].y} r="4" />
            ))}
          </g>

          <g className={`${cls('pai')} fx-part`} style={{ '--dx': '-60px', '--dy': '16px', '--i': 1 }} onClick={() => pick('pai')}>
            <circle className="rosary-x-hit" cx={CX} cy={p.pai.y} r="11" />
            <circle className="rosary-x-bead" cx={CX} cy={p.pai.y} r="6.2" />
          </g>

          <g className={`${cls('cruz')} fx-part`} style={{ '--dx': '0px', '--dy': '40px', '--i': 0 }} onClick={() => pick('cruz')}>
            <rect className="rosary-x-hit" x={CX - 18} y={pendant.cross.y - 6} width="36" height="48" rx="6" />
            <path className="rosary-x-cross" d={`M${CX} ${pendant.cross.y}v36M${CX - 12} ${pendant.cross.y + 11}h24`} />
          </g>
        </svg>
      </div>

      <div className="rosary-x-info" aria-live="polite">
        <span className="rosary-x-count">
          Passo {current + 1} de {steps.length}
          {praying && ` · ${decade + 1}ª dezena de 5`}
        </span>

        {praying ? (
          <div className="rosary-x-decade">
            <div className="rosary-x-decades" aria-hidden="true">
              {mystery.mysteries.map((item, i) => (
                <span key={item.id} className={i < decade ? 'done' : i === decade ? 'current' : ''} />
              ))}
            </div>
            <span className="rosary-x-kicker">
              {capitalize(ORDINAL_WORDS[decade])} mistério {MYSTERY_ADJECTIVE[mysteryKey]}
            </span>
            <h4>{shortName(m.name)}</h4>
            <p className="rosary-x-meditation">{m.text}</p>

            <p className="rosary-x-prayer">
              {aves === 0 ? (
                <>
                  <span className="rosary-x-instruction">
                    Anuncie o mistério, faça o seu pedido para esta dezena e reze o Pai-Nosso na conta grande:
                  </span>
                  {OUR_FATHER}
                </>
              ) : aves < AVES ? (
                <>
                  Ave Maria, cheia de graça, o Senhor é convosco, bendita sois vós entre as mulheres e bendito é o fruto do
                  vosso ventre, Jesus,
                  <span className="rosary-x-clause">{m.clause}</span>
                  Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.
                </>
              ) : (
                <>
                  <span className="rosary-x-instruction">Dezena completa. Reze o Glória ao Pai e a Jaculatória de Fátima:</span>
                  {GLORY_BE}
                  <br />
                  <br />
                  {FATIMA_PRAYER}
                </>
              )}
            </p>

            <div className="rosary-x-counter">
              <strong>{aves}</strong>
              <span>de 10 Ave-Marias</span>
            </div>

            <div className="rosary-x-actions">
              <button type="button" className="fx-small-btn" onClick={prevAve}>
                <ChevronLeft size={16} aria-hidden="true" />
                Voltar
              </button>
              <button type="button" className="rosary-x-open rosary-x-next" onClick={nextAve}>
                {nextLabel}
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>
            {onSetDone && <RosaryCheck checked={done?.has(step.id) ?? false} onChange={(v) => onSetDone(step.id, v)} />}
            <button type="button" className="rosary-x-link" onClick={() => onOpenStep(step.id)}>
              <BookOpen size={15} aria-hidden="true" />
              Ver o roteiro completo das dezenas
            </button>
          </div>
        ) : (
          <>
            <span className="rosary-x-tags">
              <span className="bead-tag">{step.bead}</span>
              {step.beadBadge && <span className="action-tag">{step.beadBadge}</span>}
            </span>
            <h4>{step.action}</h4>
            <p>{step.summary}</p>
            {step.prayerText && <p className="rosary-x-prayer rosary-x-prayer-text">{step.prayerText}</p>}
            {onSetDone && <RosaryCheck checked={done?.has(step.id) ?? false} onChange={(v) => onSetDone(step.id, v)} />}

            <div className="rosary-x-actions">
              <button type="button" className="fx-small-btn" onClick={() => setPicked(Math.max(current - 1, 0))} disabled={current === 0}>
                <ChevronLeft size={16} aria-hidden="true" />
                Anterior
              </button>
              <button
                type="button"
                className="fx-small-btn"
                onClick={() => setPicked(Math.min(current + 1, steps.length - 1))}
                disabled={current === steps.length - 1}
              >
                Próximo
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>
            <p className="rosary-x-hint">
              {current === DECADES_STEP - 1
                ? 'No próximo passo você reza as dezenas aqui mesmo, conta por conta.'
                : 'Toque numa parte do terço para ver o que rezar nela.'}
            </p>
          </>
        )}
      </div>
    </section>
  );
}
