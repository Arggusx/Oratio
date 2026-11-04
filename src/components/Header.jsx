import { NavLink } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const links = [
  ['Início', '/'],
  ['Leituras', '/home/leituras'],
  ['Terço e Orações', '/home/oracoes'],
  ['Calendário', '/home/calendario'],
  ['Escola da Fé', '/home/escola-da-fe'],
  ['Jornada', '/jornada'],
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
          {/* No celular a Escola da Fé não cabe na barra inferior: fica aqui, ao lado do tema. */}
          <NavLink
            to="/home/escola-da-fe"
            className={({ isActive }) => `header-icon-link ${isActive ? 'active' : ''}`}
            aria-label="Escola da Fé"
            title="Escola da Fé"
          >
            <GraduationCap size={20} aria-hidden="true" />
          </NavLink>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
