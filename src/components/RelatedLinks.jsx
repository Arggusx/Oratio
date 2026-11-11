import { Link, useLocation } from 'react-router-dom';
import { BookOpen, CalendarDays, Church, Compass, Flame, HandHeart, Heart, Music, Sparkles, Users } from 'lucide-react';
import './RelatedLinks.css';

/**
 * "Continue no Oratio": três páginas relacionadas no fim de cada página de conteúdo.
 * Ajuda quem está rezando a encontrar o próximo passo e os buscadores a descobrirem as páginas.
 */
const LINKS = {
  leituras: { to: '/home/leituras', title: 'Liturgia diária', text: 'Leituras, salmo e Evangelho do dia.', Icon: BookOpen },
  missa: { to: '/home/ordinario-da-missa', title: 'Ordinário da Missa', text: 'As partes da Missa e as respostas.', Icon: Church },
  canticos: { to: '/home/canticos', title: 'Cânticos da Missa', text: 'Hinos para cada momento da Missa.', Icon: Music },
  oracoes: { to: '/home/oracoes', title: 'Como rezar o terço', text: 'O passo a passo, conta por conta.', Icon: Heart },
  misterio: { to: '/home/misterio', title: 'Mistérios do terço', text: 'Qual mistério rezar em cada dia.', Icon: Sparkles },
  calendario: { to: '/home/calendario', title: 'Calendário católico', text: 'Dias santos, festas e feriados.', Icon: CalendarDays },
  santos: { to: '/home/santos', title: 'Santos e orações', text: 'História e oração de cada santo.', Icon: Church },
  novenas: { to: '/home/novenas', title: 'Novenas', text: 'Nove dias de oração, um tema por dia.', Icon: Flame },
  escola: { to: '/home/escola-da-fe', title: 'Escola da Fé', text: 'Dúvidas, Missa, símbolos e milagres.', Icon: Compass },
  confissao: { to: '/home/confissao', title: 'Exame de consciência', text: 'Prepare-se para a confissão.', Icon: HandHeart },
  trilhas: { to: '/home/trilhas', title: 'Trilhas e quiz', text: 'Aprenda a fé, uma etapa por dia.', Icon: Compass },
  comunidade: { to: '/comunidade', title: 'Mural de intenções', text: 'Reze pelos pedidos de outras pessoas.', Icon: Users },
};

// Para cada página (ou começo de endereço), as três sugestões, da mais próxima à mais distante.
const RELATED = [
  ['/home/leituras', ['oracoes', 'misterio', 'calendario']],
  ['/home/ordinario-da-missa', ['canticos', 'leituras', 'escola']],
  ['/home/oracoes', ['misterio', 'novenas', 'santos']],
  ['/home/misterio', ['oracoes', 'leituras', 'novenas']],
  ['/home/calendario', ['leituras', 'santos', 'novenas']],
  ['/home/santos', ['novenas', 'calendario', 'oracoes']],
  ['/home/escola-da-fe', ['trilhas', 'canticos', 'confissao']],
  ['/home/confissao', ['oracoes', 'escola', 'leituras']],
  ['/home/novenas', ['santos', 'oracoes', 'comunidade']],
  ['/home/trilhas', ['escola', 'santos', 'misterio']],
  ['/home/quiz', ['escola', 'trilhas', 'santos']],
  ['/comunidade', ['oracoes', 'novenas', 'leituras']],
  ['/home/canticos', ['missa', 'leituras', 'escola']],
];

export default function RelatedLinks() {
  const { pathname } = useLocation();
  const entry = RELATED.find(([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (!entry) return null;

  return (
    <nav className="related-links" aria-labelledby="related-links-title">
      <span className="eyebrow">Continue no Oratio</span>
      <h2 id="related-links-title" className="related-links-title">
        Para o próximo passo
      </h2>
      <ul className="related-links-list">
        {entry[1].map((key) => {
          const { to, title, text, Icon } = LINKS[key];
          return (
            <li key={key}>
              <Link to={to} className="related-link">
                <span className="related-link-icon" aria-hidden="true">
                  <Icon size={20} />
                </span>
                <span>
                  <strong>{title}</strong>
                  <small>{text}</small>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
