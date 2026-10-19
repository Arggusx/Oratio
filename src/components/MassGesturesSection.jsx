import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import {
  IhsIcon,
  MaryIcon,
  SaintIcon,
  TrinityIcon,
  OpenBookIcon,
  AltarIcon,
  ScrollIcon,
  SacredHeartIcon,
  GospelBookIcon,
  MonstranceIcon,
  RadiantCrossIcon,
} from './MassIcons';

// Conteúdo baseado na Instrução Geral do Missal Romano (IGMR, nn. 137, 274 e 275).
// "**texto**" é destacado em dourado.
const gestures = [
  {
    id: 'cabeca',
    title: 'Inclinação de cabeça',
    description: 'Um gesto simples de reverência: abaixa-se levemente a cabeça.',
    items: [
      { Icon: IhsIcon, text: 'Ao nome de **Jesus**' },
      { Icon: MaryIcon, text: 'Ao nome da Virgem Mãe de Deus, **Maria Santíssima**' },
      { Icon: SaintIcon, text: 'Ao nome do **Santo** em cuja honra é celebrada a Missa' },
      { Icon: TrinityIcon, text: 'Quando são nomeadas juntas as três pessoas da **Santíssima Trindade** (Pai, Filho e Espírito Santo), como no Glória ao Pai' },
      { Icon: OpenBookIcon, text: '**Exemplo:** no Glória, ao dizer “Senhor **Jesus Cristo**”', isExample: true },
    ],
  },
  {
    id: 'profunda',
    title: 'Inclinação profunda',
    description: 'Inclina-se o corpo a partir da cintura, em sinal de adoração e humildade.',
    items: [
      { Icon: AltarIcon, text: '**Diante do altar:** na procissão de entrada ou ao passar diante dele' },
      { Icon: ScrollIcon, text: '**No Credo**, nas palavras “E se encarnou pelo Espírito Santo, no seio da Virgem Maria, e se fez homem”' },
      { Icon: SacredHeartIcon, text: '**Nas orações** “Ó Deus todo-poderoso, purificai-me…” e “De coração contrito e humilde…”', who: 'Sacerdote' },
      { Icon: GospelBookIcon, text: '**Diácono:** ao pedir a bênção antes de proclamar o Evangelho', who: 'Diácono' },
    ],
    note: 'No Natal e na Anunciação do Senhor, em vez da inclinação, todos se ajoelham nas palavras “E se encarnou…” do Credo.',
  },
  {
    id: 'genuflexao',
    title: 'Genuflexão',
    description: 'Dobra-se o joelho direito até o chão: é o gesto de adoração a Deus.',
    items: [
      { Icon: MonstranceIcon, text: 'Diante do **Santíssimo Sacramento**, no sacrário ou exposto, ao entrar e sair da igreja ou ao passar diante dele' },
      { Icon: RadiantCrossIcon, text: 'Diante da **Santa Cruz**, desde a adoração na liturgia da Sexta-feira Santa até o início da Vigília Pascal' },
    ],
    note: 'Quem não puder se ajoelhar por idade ou saúde pode substituir a genuflexão por uma inclinação profunda.',
  },
];

function Highlighted({ text }) {
  return text.split('**').map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
  );
}

export default function MassGesturesSection() {
  return (
    <section className="mass-section">
      <header className="mass-intro">
        <h2 className="mass-intro-title">O que fazer na Missa</h2>
        <p>
          Na liturgia, o corpo também reza. Os gestos expressam por fora a fé que trazemos por dentro e unem toda
          a assembleia na mesma atitude diante de Deus. Veja quando fazer cada um.
        </p>
      </header>

      <div className="mass-gestures-grid">
        {gestures.map((g, index) => (
          <motion.article
            key={g.id}
            className="mass-gesture-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="mass-gesture-body">
              <h3>{g.title}</h3>
              <p className="mass-gesture-description">{g.description}</p>
              <p className="mass-gesture-when">Quando fazer?</p>

              <ul className="mass-gesture-list">
                {g.items.map(({ Icon, text, who, isExample }) => (
                  <li key={text} className={isExample ? 'is-example' : ''}>
                    <span className="mass-icon-badge">
                      <Icon />
                    </span>
                    <span className="mass-gesture-text">
                      <Highlighted text={text} />
                      {who && <span className="mass-who-tag">{who}</span>}
                    </span>
                  </li>
                ))}
              </ul>

              {g.note && (
                <p className="mass-gesture-note">
                  <Info size={15} />
                  <span>{g.note}</span>
                </p>
              )}
            </div>
          </motion.article>
        ))}
      </div>

      <p className="mass-source">Fonte: Instrução Geral do Missal Romano, nn. 137, 274 e 275.</p>
    </section>
  );
}
