/* O projeto não usa PropTypes (os componentes aqui são internos à página). */
/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BookOpen, CalendarDays, Check, CloudOff, Info, Minus, X } from 'lucide-react';
import Bell from '../components/anim/Bell';
import RosaryLoader from '../components/anim/RosaryLoader';
import ShareButton from '../components/ShareButton';
import { ACCLAMATION, MASS_ORDER, WHO_LABEL } from '../data/massOrder';
import { prayers } from '../data/prayers';
import { fetchLiturgy } from '../utils/liturgyApi';
import { fromKey, toKey } from '../utils/liturgicalCalendar';
import { getMassRules } from '../utils/massRules';
import { useSeason } from '../utils/useSeasonTheme';

const PATH = '/home/ordinario-da-missa';
const DATE_PARAM = /^\d{4}-\d{2}-\d{2}$/;

const prayerText = (id) => prayers.find((p) => p.id === id)?.text ?? '';

const READING_LABEL = {
  primeiraLeitura: '1ª leitura',
  salmo: 'Salmo',
  segundaLeitura: '2ª leitura',
  evangelho: 'Evangelho',
};

const PROPER_LABEL = {
  entrada: 'Antífona de entrada',
  coleta: 'Oração do dia',
  oferendas: 'Oração sobre as oferendas',
  comunhao: 'Antífona da comunhão',
  posComunhao: 'Oração depois da comunhão',
};

function properText(api, key) {
  if (!api) return null;
  switch (key) {
    case 'entrada':
      return api.antifonas?.entrada;
    case 'comunhao':
      return api.antifonas?.comunhao;
    case 'coleta':
      return api.oracoes?.coleta;
    case 'oferendas':
      return api.oracoes?.oferendas;
    case 'posComunhao':
      return api.oracoes?.comunhao;
    default:
      return null;
  }
}

const formatDay = (date) =>
  date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

/** Uma fala do diálogo. O que o povo diz fica em destaque. */
function Line({ who, text }) {
  const isPeople = who === 'povo' || who === 'todos';
  return (
    <p className={`missa-line ${isPeople ? 'is-people' : ''}`}>
      <span className="missa-who">{WHO_LABEL[who]}</span>
      <span className="missa-text">{text}</span>
    </p>
  );
}

function RuleBadge({ say, children }) {
  return (
    <li className={`missa-rule ${say ? 'is-yes' : 'is-no'}`}>
      <span className="missa-rule-icon" aria-hidden="true">
        {say ? <Check size={15} /> : <Minus size={15} />}
      </span>
      <span>{children}</span>
    </li>
  );
}

/** Leituras do dia: só as referências e o refrão do salmo, com o caminho para a página de Leituras. */
function ReadingsSummary({ keys, api, isToday }) {
  const items = keys
    .map((key) => ({ key, reading: api?.leituras?.[key]?.[0] }))
    .filter(({ reading }) => reading);
  if (!api) {
    return (
      <p className="missa-proper-missing">
        Os textos do dia estão na página de <Link to="/home/leituras">Leituras</Link>.
      </p>
    );
  }
  if (!items.length) return null;
  return (
    <div className="missa-proper">
      {items.map(({ key, reading }) => (
        <p key={key}>
          <span className="missa-proper-label">{READING_LABEL[key]}</span>
          {key === 'salmo' && reading.refrao ? (
            <>
              {reading.referencia} · <strong>R. {reading.refrao}</strong>
            </>
          ) : (
            reading.referencia
          )}
        </p>
      ))}
      {isToday && (
        <Link className="missa-readings-link" to="/home/leituras">
          <BookOpen size={15} aria-hidden="true" />
          Ler os textos de hoje
        </Link>
      )}
    </div>
  );
}

function Step({ step, rules, api, isToday }) {
  const { gloria, credo, acclamation } = rules;

  // Partes que hoje não entram: ficam como uma linha discreta, com o motivo.
  const skipped =
    (step.rule === 'gloria' && !gloria.say && gloria.reason) ||
    (step.rule === 'credo' && !credo.say && credo.reason) ||
    (step.rule === 'penitential' && rules.penitential) ||
    ((step.rule === 'blessing' || step.rule === 'dismissal') && rules.blessing);
  if (skipped) {
    if (step.rule === 'dismissal') return null; // a bênção já explica
    return (
      <li className="missa-step is-skipped" id={step.id}>
        <h3 className="missa-step-title">{step.title}</h3>
        <p className="missa-skip-reason">{skipped}</p>
      </li>
    );
  }

  if (step.onlyWithReading && api && !(api.leituras?.[step.onlyWithReading]?.length > 0)) return null;

  const proper = step.proper ? properText(api, step.proper) : null;
  const sequence = step.rule === 'acclamation' ? api?.leituras?.extras?.find((e) => /sequ[eê]ncia/i.test(e.titulo)) : null;

  let lines = step.lines ?? [];
  let after = step.after ?? [];
  if (step.rule === 'acclamation') {
    const text = acclamation.lent ? ACCLAMATION.lent : ACCLAMATION.alleluia;
    lines = [{ who: 'todos', text }];
  }
  if (step.rule === 'dismissal' && rules.doubleAlleluia) {
    lines = [
      { who: 'diacono', text: 'Ide em paz, e o Senhor vos acompanhe. Aleluia, aleluia.' },
      { who: 'povo', text: 'Graças a Deus. Aleluia, aleluia.' },
    ];
  }

  return (
    <li className="missa-step" id={step.id}>
      <h3 className="missa-step-title">{step.title}</h3>
      {step.note && <p className="missa-step-note">{step.note}</p>}
      {step.rule === 'gloria' && <p className="missa-why">{gloria.reason}</p>}
      {step.rule === 'credo' && <p className="missa-why">{credo.reason}</p>}
      {step.rule === 'acclamation' && acclamation.reason && <p className="missa-why">{acclamation.reason}</p>}
      {sequence && (
        <p className="missa-why">Hoje, antes da aclamação, canta-se a {sequence.titulo.toLowerCase()}.</p>
      )}

      {lines.length > 0 && (
        <div className="missa-dialogue">
          {lines.map((line, i) => (
            <Line key={i} {...line} />
          ))}
          {step.rule === 'acclamation' && acclamation.lent && (
            <p className="missa-step-note">Ou outra aclamação do Lecionário, seguida do versículo do dia.</p>
          )}
        </div>
      )}

      {step.prayer && (
        <div className="missa-dialogue">
          <Line who="todos" text={prayerText(step.prayer)} />
        </div>
      )}

      {step.readings && <ReadingsSummary keys={step.readings} api={api} isToday={isToday} />}

      {step.proper && proper && (
        <div className="missa-proper">
          <span className="missa-proper-label">{PROPER_LABEL[step.proper]} · próprio do dia</span>
          <p>{proper}</p>
        </div>
      )}

      {after.length > 0 && (
        <div className="missa-dialogue">
          {after.map((line, i) => (
            <Line key={i} {...line} />
          ))}
        </div>
      )}

      {step.altPrayer && (
        <details className="missa-alt">
          <summary>Símbolo dos Apóstolos</summary>
          <p>{prayerText(step.altPrayer)}</p>
        </details>
      )}
    </li>
  );
}


/**
 * Dia da Missa atrás de um botão (como os filtros do site): o botão mostra o dia escolhido
 * e abre um painel com o calendário e o atalho "Hoje".
 */
function DayPicker({ dateKey, todayKey, onChange }) {
  const dialogRef = useRef(null);
  const [draft, setDraft] = useState(dateKey);
  const isToday = dateKey === todayKey;
  const label = isToday ? 'Hoje' : dateKey.split('-').reverse().join('/');

  const open = () => {
    setDraft(dateKey);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();
  const apply = (key) => {
    if (key) onChange(key);
    close();
  };

  return (
    <div className="filter-bar missa-day-picker">
      <button type="button" className="filter-open" onClick={open} aria-haspopup="dialog">
        <CalendarDays size={16} aria-hidden="true" />
        Dia: {label}
      </button>
      {!isToday && (
        <button type="button" className="filter-clear-link" onClick={() => onChange(todayKey)}>
          Voltar para hoje
        </button>
      )}

      <dialog
        ref={dialogRef}
        className="filter-sheet"
        aria-labelledby="missa-day-title-sheet"
        onClick={(e) => e.target === dialogRef.current && close()}
      >
        <header className="filter-sheet-head">
          <h2 id="missa-day-title-sheet">Dia da Missa</h2>
          <button type="button" className="filter-sheet-close" onClick={close} aria-label="Fechar sem mudar">
            <X size={20} />
          </button>
        </header>
        <div className="filter-sheet-body">
          <label className="missa-date-field">
            Escolha o dia
            <input type="date" value={draft} onChange={(e) => setDraft(e.target.value)} />
          </label>
        </div>
        <footer className="filter-sheet-foot">
          <button type="button" className="filter-sheet-clear" onClick={() => apply(todayKey)}>
            Hoje
          </button>
          <button type="button" className="btn filter-sheet-apply" onClick={() => apply(draft)}>
            Ver este dia
          </button>
        </footer>
      </dialog>
    </div>
  );
}

export default function OrdinarioMissa() {
  const [params, setParams] = useSearchParams();
  const season = useSeason();
  const todayKey = toKey(new Date());
  const rawDate = params.get('data');
  const dateKey = rawDate && DATE_PARAM.test(rawDate) && !Number.isNaN(fromKey(rawDate).getTime()) ? rawDate : todayKey;
  const isToday = dateKey === todayKey;

  // { key, data } da última busca: enquanto a chave não bate com a data escolhida, está carregando.
  const [result, setResult] = useState(null);

  useEffect(() => {
    let alive = true;
    fetchLiturgy(fromKey(dateKey))
      .then((data) => alive && setResult({ key: dateKey, data }))
      .catch(() => alive && setResult({ key: dateKey, data: null }));
    return () => {
      alive = false;
    };
  }, [dateKey]);

  const loading = result?.key !== dateKey;
  const api = loading ? null : result.data;
  const rules = useMemo(
    () => getMassRules(fromKey(dateKey), api, season.preview ? season.theme : null, isToday),
    [dateKey, api, season.preview, season.theme, isToday],
  );

  const changeDate = (value) => {
    const next = new URLSearchParams(params);
    if (!value || value === todayKey) next.delete('data');
    else next.set('data', value);
    setParams(next, { replace: true });
  };

  return (
    <main className="page missa-page">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">Santa Missa</span>
          <h1 className="section-title">Ordinário da Missa</h1>
        </div>
        <Bell />
      </div>
      <p className="lead">
        As partes fixas da Missa, na ordem da celebração, com o que o povo responde em destaque. O Glória, o Credo e
        a aclamação ao Evangelho seguem o tempo litúrgico e a celebração do dia.
      </p>
      <div className="page-share">
        <ShareButton
          path={PATH}
          title="Ordinário da Missa"
          text="As partes da Missa de hoje, com as respostas do povo:"
          label="Compartilhar o Ordinário da Missa"
        />
      </div>

      <DayPicker dateKey={dateKey} todayKey={todayKey} onChange={changeDate} />

      {loading ? (
        <div className="missa-loading" aria-busy="true">
          <RosaryLoader label="Buscando a liturgia do dia…" />
        </div>
      ) : (
        <>
          <section className={`missa-day color-${rules.colorName.toLowerCase()}`} aria-labelledby="missa-day-title">
            <p className="eyebrow">{formatDay(rules.date)}</p>
            <h2 id="missa-day-title" className="missa-day-title">
              {rules.celebration ?? `${rules.isSunday ? 'Domingo' : 'Dia de semana'} · ${rules.seasonLabel}`}
            </h2>
            <div className="missa-chips">
              <span className="missa-chip">
                <span className="missa-color-dot" aria-hidden="true" />
                Cor litúrgica: {rules.colorName.toLowerCase()}
              </span>
              <span className="missa-chip">{rules.gradeLabel}</span>
              <span className="missa-chip">{rules.seasonLabel}</span>
            </div>

            {rules.noMass && (
              <p className="missa-alert">
                <Info size={16} aria-hidden="true" />
                <span>{rules.noMass}</span>
              </p>
            )}

            <ul className="missa-rules">
              <RuleBadge say={rules.gloria.say}>{rules.gloria.reason}</RuleBadge>
              <RuleBadge say={rules.credo.say}>{rules.credo.reason}</RuleBadge>
              <RuleBadge say={!rules.acclamation.lent}>
                {rules.acclamation.lent
                  ? rules.acclamation.reason
                  : 'Antes do Evangelho canta-se o Aleluia.'}
              </RuleBadge>
              {rules.notes.map((note) => (
                <li key={note} className="missa-rule is-note">
                  <span className="missa-rule-icon" aria-hidden="true">
                    <Info size={15} />
                  </span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>

            {rules.preview && (
              <p className="missa-notice">
                Pré-visualização do tempo “{rules.seasonLabel}”: as regras acima são as de um{' '}
                {rules.isSunday ? 'domingo' : 'dia de semana'} desse tempo, sem a celebração do dia.
              </p>
            )}
            {!api && !rules.preview && (
              <p className="missa-notice">
                <CloudOff size={14} aria-hidden="true" />
                Não foi possível buscar a liturgia deste dia. Mostramos o Ordinário pelo calendário, sem as festas e
                as partes próprias do dia.
              </p>
            )}
          </section>

          <nav className="missa-nav" aria-label="Partes da Missa">
            {MASS_ORDER.map((part) => (
              <a key={part.id} href={`#${part.id}`} className="missa-nav-link">
                {part.title}
              </a>
            ))}
          </nav>

          {MASS_ORDER.map((part, index) => (
            <section key={part.id} id={part.id} className="missa-part" aria-labelledby={`${part.id}-titulo`}>
              <span className="eyebrow">Parte {index + 1}</span>
              <h2 id={`${part.id}-titulo`} className="missa-part-title">
                {part.title}
              </h2>
              <p className="missa-part-intro">{part.intro}</p>
              <ol className="missa-steps">
                {part.steps.map((step) => (
                  <Step key={step.id} step={step} rules={rules} api={rules.preview ? null : api} isToday={isToday} />
                ))}
              </ol>
            </section>
          ))}

          <p className="missa-more">
            Quer entender os gestos? Veja{' '}
            <Link to="/home/escola-da-fe?secao=missa">o que fazer na Missa, na Escola da Fé</Link>.
          </p>
        </>
      )}

      <p className="liturgy-source">
        Regras: Instrução Geral do Missal Romano (nn. 53, 64, 68 e 346). Respostas do povo: Missal Romano, tradução
        da CNBB. Próprio do dia: API Liturgia Diária.
      </p>
    </main>
  );
}
