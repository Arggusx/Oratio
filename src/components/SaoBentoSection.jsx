import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Shield } from 'lucide-react';

// Versos da oração gravada na Medalha de São Bento (Vade retro Satana).
const prayerLines = [
  { abbr: 'C.S.S.M.L.', latin: 'Crux sacra sit mihi lux,', pt: 'A Cruz Sagrada seja a minha luz,' },
  { abbr: 'N.D.S.M.D.', latin: 'Non draco sit mihi dux.', pt: 'não seja o dragão o meu guia.' },
  { abbr: 'V.R.S.', latin: 'Vade retro, Satana!', pt: 'Retira-te, Satanás!' },
  { abbr: 'N.S.M.V.', latin: 'Numquam suade mihi vana!', pt: 'Nunca me aconselhes coisas vãs!' },
  { abbr: 'S.M.Q.L.', latin: 'Sunt mala quae libas,', pt: 'É mau o que tu me ofereces;' },
  { abbr: 'I.V.B.', latin: 'Ipse venena bibas.', pt: 'bebe tu mesmo os teus venenos.' },
];

const medalInscriptions = [
  { abbr: 'C.S.P.B.', latin: 'Crux Sancti Patris Benedicti', pt: 'Cruz do Santo Pai Bento (nos quatro ângulos da cruz)' },
  { abbr: 'PAX', latin: 'Pax', pt: 'Paz — lema da Ordem Beneditina, no alto da medalha' },
  {
    abbr: '—',
    latin: 'Eius in obitu nostro praesentia muniamur',
    pt: 'Sejamos protegidos por sua presença na hora da nossa morte (no verso, ao redor da imagem do santo)',
  },
];

const VIEWS = [
  ['pt', 'Português'],
  ['la', 'Latim'],
  ['both', 'Lado a lado'],
];

export default function SaoBentoSection() {
  const [view, setView] = useState('pt');
  const [showDetails, setShowDetails] = useState(false);

  return (
    <section className="sao-bento-card" aria-labelledby="sao-bento-title">
      <div className="sao-bento-header">
        <span className="sao-bento-icon" aria-hidden="true">
          <Shield size={22} />
        </span>
        <div>
          <span className="eyebrow">Sacramental · Proteção espiritual</span>
          <h2 id="sao-bento-title" className="sao-bento-title">Oração de São Bento</h2>
        </div>
      </div>

      <p className="sao-bento-intro">
        São Bento de Núrsia (c. 480–547) é o pai do monaquismo no Ocidente e autor da Regra resumida no lema
        <em> “Ora et labora”</em> (reza e trabalha). A oração abaixo está gravada, em forma de siglas, na
        <strong> Medalha de São Bento</strong>, um dos sacramentais mais antigos da Igreja. É uma oração de exorcismo
        simples, que qualquer fiel pode rezar para rejeitar as tentações e se colocar sob a proteção da Cruz de Cristo.
      </p>

      <div className="sao-bento-toggle" role="tablist" aria-label="Idioma da oração">
        {VIEWS.map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={view === key}
            className={view === key ? 'active' : ''}
            onClick={() => setView(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={`sao-bento-prayer view-${view}`}>
        {prayerLines.map((line) => (
          <div key={line.abbr} className="sao-bento-line">
            <span className="sao-bento-abbr">{line.abbr}</span>
            {view !== 'pt' && <span className="sao-bento-latin" lang="la">{line.latin}</span>}
            {view !== 'la' && <span className="sao-bento-pt">{line.pt}</span>}
          </div>
        ))}
      </div>

      <button
        type="button"
        className="step-expand-btn sao-bento-more"
        onClick={() => setShowDetails((v) => !v)}
        aria-expanded={showDetails}
      >
        <span>{showDetails ? 'Ocultar explicação' : 'Entenda a medalha e como rezar'}</span>
        <ChevronDown size={18} className={`arrow-icon ${showDetails ? 'rotated' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="sao-bento-details">
              <h3>Origem</h3>
              <p>
                A fórmula <em>“Vade retro, Satana”</em> foi encontrada em um manuscrito de 1415 da abadia beneditina
                de Metten, na Baviera, que explicava as siglas que já apareciam em cruzes de São Bento. O Papa
                Bento XIV aprovou a medalha em 1742. O modelo mais conhecido hoje, chamado “do Jubileu”, foi cunhado
                em 1880 na Abadia de Montecassino, pelos 1400 anos do nascimento do santo.
              </p>

              <h3>O que está escrito na medalha</h3>
              <ul className="sao-bento-inscriptions">
                {medalInscriptions.map((item) => (
                  <li key={item.latin}>
                    <span className="sao-bento-abbr">{item.abbr}</span>
                    <span>
                      <em lang="la">{item.latin}</em> — {item.pt}
                    </span>
                  </li>
                ))}
              </ul>
              <p>
                Na frente aparece São Bento segurando a cruz e o livro da Regra. Ao seu lado, o cálice do qual sai
                uma serpente e o corvo com um pão lembram as duas vezes em que, segundo São Gregório Magno, o santo
                escapou de ser envenenado.
              </p>

              <h3>Como usar</h3>
              <p>
                Reze a oração em momentos de tentação, aflição ou perigo, de preferência fazendo o Sinal da Cruz.
                A medalha deve ser abençoada por um sacerdote e pode ser usada ao pescoço, guardada em casa ou no
                carro. Ela não é um amuleto: como todo sacramental, não age por si mesma, mas dispõe o coração para
                receber a graça de Deus, e seu fruto depende da fé e de uma vida cristã coerente.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
