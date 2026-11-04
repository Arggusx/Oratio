import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flag, HandHeart, Send, Users } from 'lucide-react';
import { community, plural, useCommunityStats } from '../utils/community';
import { novenas } from '../data/novenas';
import { LoadMoreButton } from '../components/LoadMore';

const timeAgo = (iso) => {
  const minutes = Math.round((Date.now() - new Date(iso)) / 60000);
  if (minutes < 60) return minutes <= 1 ? 'agora' : `há ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `há ${hours} h`;
  const days = Math.round(hours / 24);
  return days === 1 ? 'ontem' : `há ${days} dias`;
};

/** Números da comunidade: terços de hoje, metas e novenas em grupo. Sem nomes, só contagens. */
function CommunityNumbers() {
  const stats = useCommunityStats();
  if (!stats) return null;

  const groupNovenas = novenas.filter((n) => stats.novenas[n.id] > 0);

  return (
    <section className="community-numbers" aria-label="A comunidade hoje">
      <div className="community-counter">
        <Users size={22} aria-hidden="true" />
        <p>
          Hoje, <strong>{plural(stats.tercoToday, 'pessoa rezou', 'pessoas rezaram')}</strong> o terço no Oratio.
        </p>
      </div>

      {stats.goals.map((g) => {
        const pct = Math.min(100, (g.progress / g.target) * 100);
        return (
          <div key={g.id} className="community-goal">
            <div className="community-goal-head">
              <strong>{g.title}</strong>
              <span>
                {g.progress.toLocaleString('pt-BR')} de {g.target.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="year-bar" role="progressbar" aria-valuemin={0} aria-valuemax={g.target} aria-valuenow={g.progress}>
              <span style={{ width: `${pct}%`, background: 'var(--color-gold)' }} />
            </div>
            <small>
              De {new Date(`${g.startsOn}T12:00`).toLocaleDateString('pt-BR')} a{' '}
              {new Date(`${g.endsOn}T12:00`).toLocaleDateString('pt-BR')}. Cada terço marcado no fim da oração conta.
            </small>
          </div>
        );
      })}

      {groupNovenas.length > 0 && (
        <ul className="community-novenas">
          {groupNovenas.map((n) => (
            <li key={n.id}>
              <Link to={`/home/novenas/${n.id}`}>{n.title}</Link>:{' '}
              {plural(stats.novenas[n.id], 'pessoa está fazendo', 'pessoas estão fazendo')}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function IntentionForm({ onCreated }) {
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState({ sending: false, error: '' });

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ sending: true, error: '' });
    try {
      const created = await community.addIntention(text, name);
      onCreated(created);
      setText('');
      setStatus({ sending: false, error: '' });
    } catch (err) {
      setStatus({ sending: false, error: err.message });
    }
  };

  return (
    <form className="intention-form" onSubmit={submit}>
      <label htmlFor="intention-text">Deixe o seu pedido de oração</label>
      <textarea
        id="intention-text"
        className="search"
        rows={3}
        maxLength={280}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ex.: Pela saúde do meu pai, que vai fazer uma cirurgia."
        required
      />
      <div className="intention-form-row">
        <input
          className="search"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={30}
          placeholder="Primeiro nome (opcional)"
          aria-label="Primeiro nome (opcional)"
          autoComplete="off"
        />
        <button type="submit" className="btn" disabled={status.sending || text.trim().length < 5}>
          <Send size={15} aria-hidden="true" />
          {status.sending ? 'Enviando…' : 'Publicar pedido'}
        </button>
      </div>
      <small className="intention-form-note">
        O pedido fica visível para todos por 30 dias. Não escreva sobrenome, endereço, telefone ou detalhes que
        identifiquem alguém: links e contatos são removidos automaticamente.
      </small>
      {status.error && (
        <p className="intention-form-error" role="alert">
          {status.error}
        </p>
      )}
    </form>
  );
}

/** Mural de intenções: pedidos anônimos e o botão "Rezei por você". */
function IntentionWall() {
  const [items, setItems] = useState([]);
  const [state, setState] = useState('loading'); // loading | ok | error
  const [hasMore, setHasMore] = useState(false);
  const [reported, setReported] = useState([]);

  useEffect(() => {
    community
      .intentions()
      .then((data) => {
        setItems(data.intentions);
        setHasMore(data.intentions.length === 20);
        setState('ok');
      })
      .catch(() => setState('error'));
  }, []);

  const loadMore = async () => {
    const data = await community.intentions(items[items.length - 1]?.id).catch(() => null);
    if (!data) return;
    setItems([...items, ...data.intentions]);
    setHasMore(data.intentions.length === 20);
  };

  const pray = async (id) => {
    setItems((list) => list.map((i) => (i.id === id ? { ...i, prayedByMe: true, prayers: i.prayers + 1 } : i)));
    const result = await community.pray(id).catch(() => null);
    if (result) setItems((list) => list.map((i) => (i.id === id ? { ...i, prayers: result.prayers } : i)));
  };

  const report = async (id) => {
    if (!window.confirm('Denunciar este pedido como impróprio? Com três denúncias ele sai do mural.')) return;
    setReported([...reported, id]);
    await community.report(id).catch(() => null);
  };

  if (state === 'error') {
    return <p className="calendar-empty">O mural não está disponível agora. Tente de novo mais tarde.</p>;
  }

  return (
    <section aria-labelledby="wall-title">
      <h2 id="wall-title" className="saint-section-title">
        Mural de intenções
      </h2>
      <p className="confession-hint">
        Reze pelo pedido de alguém e toque em <strong>Rezei por você</strong>: a pessoa verá que não está sozinha.
      </p>

      <IntentionForm onCreated={(created) => setItems([created, ...items])} />

      {state === 'loading' ? (
        <p className="calendar-empty">Carregando pedidos…</p>
      ) : items.length === 0 ? (
        <p className="calendar-empty">Ainda não há pedidos. Seja o primeiro a deixar o seu.</p>
      ) : (
        <ul className="intention-wall">
          {items
            .filter((i) => !reported.includes(i.id))
            .map((i) => (
              <li key={i.id} className="intention-note">
                <p>{i.text}</p>
                <div className="intention-note-foot">
                  <small>
                    {i.firstName ? `${i.firstName} · ` : ''}
                    {timeAgo(i.createdAt)}
                  </small>
                  <button
                    type="button"
                    className={`journey-mark ${i.prayedByMe ? 'is-done' : ''}`}
                    onClick={() => pray(i.id)}
                    disabled={i.prayedByMe}
                  >
                    <HandHeart size={15} aria-hidden="true" />
                    {i.prayedByMe ? 'Você rezou' : 'Rezei por você'}
                    {i.prayers > 0 && <span className="intention-count">{i.prayers}</span>}
                  </button>
                  <button type="button" className="intention-report" onClick={() => report(i.id)} aria-label="Denunciar pedido">
                    <Flag size={13} aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
        </ul>
      )}
      {hasMore && <LoadMoreButton remaining={null} onClick={loadMore} label="Ver mais pedidos" />}
    </section>
  );
}

export default function Comunidade() {
  return (
    <main className="page">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">Ninguém reza sozinho</span>
          <h1 className="section-title">Comunidade</h1>
        </div>
      </div>
      <p className="lead">
        Veja quantas pessoas estão rezando com você e reze pelos pedidos uns dos outros. Ninguém é identificado: só
        aparecem números e os pedidos que as pessoas escolhem publicar.
      </p>
      <CommunityNumbers />
      <IntentionWall />
    </main>
  );
}
