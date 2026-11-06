import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cloud, CloudOff, LoaderCircle, LogOut, Mail, Trash2 } from 'lucide-react';
import { account, GOOGLE_CLIENT_ID, useAccount } from '../utils/account';
import './AccountPanel.css';

const GSI_URL = 'https://accounts.google.com/gsi/client';
let gsiPromise = null;

function loadGoogle() {
  if (window.google?.accounts?.id) return Promise.resolve(window.google);
  gsiPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = GSI_URL;
    script.async = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => {
      gsiPromise = null;
      reject(new Error('O botão do Google não carregou.'));
    };
    document.head.appendChild(script);
  });
  return gsiPromise;
}

/** Botão oficial "Fazer login com o Google". */
function GoogleButton() {
  const boxRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    loadGoogle()
      .then((google) => {
        if (!alive || !boxRef.current) return;
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: ({ credential }) => account.login(credential),
          ux_mode: 'popup',
          use_fedcm_for_prompt: true,
        });
        google.accounts.id.renderButton(boxRef.current, {
          type: 'standard',
          theme: document.documentElement.dataset.theme === 'dark' ? 'filled_black' : 'outline',
          size: 'large',
          shape: 'pill',
          text: 'signin_with',
          locale: 'pt-BR',
        });
      })
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, []);

  if (failed) return <p className="account-error">O botão do Google não carregou. Verifique a conexão e recarregue a página.</p>;
  return <div ref={boxRef} className="account-google" />;
}

const time = (iso) => (iso ? new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '');

/** Na Jornada: entrar para guardar o progresso, ver se está sincronizado, mensagens e apagar a conta. */
export default function AccountPanel() {
  const { token, user, status, syncedAt, error } = useAccount();
  const [busy, setBusy] = useState(false);
  const [prefError, setPrefError] = useState('');

  if (!GOOGLE_CLIENT_ID) return null;

  if (!token) {
    return (
      <section className="account-panel" aria-labelledby="account-title">
        <h2 id="account-title" className="account-title">
          Guarde o seu progresso
        </h2>
        <p className="account-text">
          Entre com a sua conta Google para não perder a Jornada se trocar de aparelho e continuar de onde parou no
          celular ou no computador. Sem conta, tudo continua salvo só aqui.
        </p>
        <GoogleButton />
        {error && (
          <p className="account-error" role="alert">
            {error}
          </p>
        )}
        <small className="account-note">
          Guardamos só o seu e-mail, o primeiro nome e o progresso. <Link to="/privacidade">Saiba mais</Link>.
        </small>
      </section>
    );
  }

  const toggleMessages = async (e) => {
    setBusy(true);
    setPrefError('');
    try {
      await account.setWantsMessages(e.target.checked);
    } catch (err) {
      setPrefError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm('Apagar a sua conta? O progresso guardado nela será apagado. O deste aparelho continua aqui.')) return;
    setBusy(true);
    try {
      await account.deleteAccount();
    } catch (err) {
      setPrefError(err.message);
      setBusy(false);
    }
  };

  return (
    <section className="account-panel is-signed-in" aria-labelledby="account-title">
      <h2 id="account-title" className="account-title">
        {user?.name ? `Olá, ${user.name}` : 'Sua conta'}
      </h2>
      <p className="account-status" aria-live="polite">
        {status === 'saving' && (
          <>
            <LoaderCircle size={16} className="account-spin" aria-hidden="true" /> Salvando na conta…
          </>
        )}
        {status === 'synced' && (
          <>
            <Cloud size={16} aria-hidden="true" /> Progresso salvo na conta{syncedAt ? ` às ${time(syncedAt)}` : ''}.
          </>
        )}
        {status === 'error' && (
          <>
            <CloudOff size={16} aria-hidden="true" /> {error || 'Não foi possível salvar agora; tentamos de novo na próxima mudança.'}
          </>
        )}
        {status === 'idle' && <>Conectado como {user?.email}.</>}
      </p>

      <label className="account-toggle">
        <input type="checkbox" checked={Boolean(user?.wantsMessages)} onChange={toggleMessages} disabled={busy} />
        <span>
          <Mail size={16} aria-hidden="true" /> Receber a Palavra do dia por e-mail, às 6h
        </span>
      </label>
      {prefError && (
        <p className="account-error" role="alert">
          {prefError}
        </p>
      )}

      <div className="account-actions">
        <button type="button" className="account-link" onClick={account.logout} disabled={busy}>
          <LogOut size={15} aria-hidden="true" /> Sair desta conta
        </button>
        <button type="button" className="account-link is-danger" onClick={remove} disabled={busy}>
          <Trash2 size={15} aria-hidden="true" /> Apagar conta
        </button>
      </div>
    </section>
  );
}
