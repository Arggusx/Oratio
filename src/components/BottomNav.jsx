import { NavLink } from 'react-router-dom';
import { BookOpen, CalendarDays, Compass, GraduationCap, Home } from 'lucide-react';
import { JORNADA_ATIVA } from '../utils/features';

// Contas e cruz: ícone de "Terço e Orações" (o lucide não tem um terço).
function RosaryIcon({ size = 22 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="3.5" r="1.4" />
      <circle cx="17" cy="5.5" r="1.4" />
      <circle cx="19" cy="10.5" r="1.4" />
      <circle cx="7" cy="5.5" r="1.4" />
      <circle cx="5" cy="10.5" r="1.4" />
      <path d="M6.5 13.5 12 15.5l5.5-2" />
      <path d="M12 15.5v7M9.5 18.5h5" />
    </svg>
  );
}

// Cinco itens com o Terço no meio, em destaque. Com a Jornada ligada, ela é o quinto item e a Escola da Fé
// fica no topo (Header) no celular; sem a Jornada, a Escola da Fé ocupa o lugar dela.
const items = [
  { label: 'Início', to: '/', Icon: Home },
  { label: 'Leituras', to: '/home/leituras', Icon: BookOpen },
  { label: 'Terço', to: '/home/oracoes', Icon: RosaryIcon, main: true },
  { label: 'Calendário', to: '/home/calendario', Icon: CalendarDays },
  JORNADA_ATIVA
    ? { label: 'Jornada', to: '/jornada', Icon: Compass }
    : { label: 'Escola', to: '/home/escola-da-fe', Icon: GraduationCap },
];

/** Navegação principal no celular: fica fixa no rodapé da tela, ao alcance do polegar. */
export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Menu principal">
      {items.map(({ label, to, Icon, main }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => [main ? 'bottom-nav-main' : '', isActive ? 'active' : ''].join(' ').trim()}
        >
          {main ? (
            <span className="bottom-nav-main-circle">
              <Icon size={24} aria-hidden="true" />
            </span>
          ) : (
            <Icon size={22} aria-hidden="true" />
          )}
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
