import { NavLink } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import SeasonChip from './SeasonChip';
import { JORNADA_ATIVA } from '../utils/features';

const links = [
  ['Início', '/'],
  ['Leituras', '/home/leituras'],
  ['Terço e Orações', '/home/oracoes'],
  ['Calendário', '/home/calendario'],
  ['Escola da Fé', '/home/escola-da-fe'],
  ...(JORNADA_ATIVA ? [['Jornada', '/jornada']] : []),
];

// No celular, os links ficam na barra inferior (BottomNav); aqui sobram a marca e o tema.
export default function Header() {
  return (
    <header className="site-header">
      <nav className="nav" aria-label="Menu do topo">
        <NavLink to="/" className="brand">
          <span className="brand-mark">
            <img src="/img2/icon_site.webp" alt="" width="64" height="64" />
          </span>
          Oratio
        </NavLink>

        <div className="desktop-nav">
          {links.map(([label, to]) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
              {label}
            </NavLink>
          ))}
        </div>

        <div className="nav-actions">
          <SeasonChip />
          {/* Com a Jornada na barra inferior, a Escola da Fé não cabe lá no celular: fica aqui, ao lado do tema.
              Sem a Jornada, a Escola da Fé já está na barra inferior. */}
          {JORNADA_ATIVA && (
            <NavLink
              to="/home/escola-da-fe"
              className={({ isActive }) => `header-icon-link ${isActive ? 'active' : ''}`}
              aria-label="Escola da Fé"
              title="Escola da Fé"
            >
              <GraduationCap size={20} aria-hidden="true" />
            </NavLink>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
