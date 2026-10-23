import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

const links = [
  ['Início', '/'],
  ['Leituras', '/home/leituras'],
  ['Terço e Orações', '/home/oracoes'],
  ['Calendário', '/home/calendario'],
  ['Escola da Fé', '/home/escola-da-fe'],
];

export default function Header() {
  const [open, setOpen] = useState(false);

  // Trava a rolagem com o menu aberto e permite fechá-lo com Esc.
  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const navLinks = links.map(([label, to]) => (
    <NavLink
      key={to}
      to={to}
      end={to === '/'}
      onClick={() => setOpen(false)}
      className={({ isActive }) => (isActive ? 'active' : '')}
    >
      {label}
    </NavLink>
  ));

  return (
    <header className="site-header">
      <nav className="nav">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">
            <img src="/img2/icon_site.webp" alt="" width="64" height="64" />
          </span>
          Oratio
        </NavLink>

        <div className="desktop-nav">
          {navLinks}
        </div>

        <div className="nav-actions">
          <ThemeToggle />
          <button
            className="menu-toggle"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile backdrop */}
      <div
        className={`mobile-backdrop ${open ? 'open' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile slide-in menu */}
      {/* Fechado, o menu fica fora da tela: inert impede que o Tab chegue nos links. */}
      <nav id="mobile-menu" className={`mobile-menu ${open ? 'open' : ''}`} aria-label="Menu principal" inert={!open}>
        {navLinks}
      </nav>
    </header>
  );
}
