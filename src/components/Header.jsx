import { NavLink } from 'react-router-dom';
import { Menu, X, Cross } from 'lucide-react';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

const links = [
  ['Início', '/'],
  ['Mistérios', '/home/misterio'],
  ['Leituras', '/home/leituras'],
  ['Terço e Orações', '/home/oracoes'],
  ['Calendário', '/home/calendario'],
  ['Escola da Fé', '/home/escola-da-fe'],
];

export default function Header() {
  const [open, setOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
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
            <img src="/img2/icon_site.png" alt="Oratio Daily" />
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
      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        {navLinks}
      </div>
    </header>
  );
}
