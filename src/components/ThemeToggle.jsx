import { useEffect, useId, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const STORAGE_KEY = 'oratio:tema';
const THEME_COLORS = { light: '#FDFBF7', dark: '#17120F' };

function getInitialTheme() {
  // O script em index.html já aplicou o tema antes do React carregar.
  const applied = document.documentElement.dataset.theme;
  if (applied === 'dark' || applied === 'light') return applied;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Raios do ostensório: 12 linhas em volta da Hóstia, alternando comprimento.
const RAYS = Array.from({ length: 12 }, (_, i) => {
  const angle = (i * Math.PI) / 6;
  const inner = 7.4;
  const outer = i % 2 === 0 ? 10.6 : 9.4;
  return {
    x1: 12 + inner * Math.cos(angle),
    y1: 12 + inner * Math.sin(angle),
    x2: 12 + outer * Math.cos(angle),
    y2: 12 + outer * Math.sin(angle),
  };
});

// Estrelas em forma de pequenas cruzes de braços iguais.
const STARS = [
  { x: 4.6, y: 4.4, size: 1.5, delay: 0.32 },
  { x: 20.2, y: 15.6, size: 1.2, delay: 0.42 },
  { x: 13.4, y: 3.2, size: 0.9, delay: 0.5 },
];

/**
 * Modo claro: a Hóstia irradiando luz, como num ostensório.
 * Modo escuro: uma máscara cobre parte do círculo e ele vira uma lua crescente,
 * enquanto uma cruz é desenhada ao lado e pequenas estrelas aparecem.
 */
function ThemeIcon({ isDark }) {
  const reduceMotion = useReducedMotion();
  // useId pode conter caracteres que não funcionam em url(#...).
  const maskId = `theme-mask-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const t = (duration, delay = 0) =>
    reduceMotion ? { duration: 0 } : { duration, delay, ease: [0.4, 0, 0.2, 1] };

  return (
    <svg className="theme-icon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      <mask id={maskId}>
        <rect x="0" y="0" width="24" height="24" fill="#fff" />
        <motion.circle
          initial={false}
          animate={isDark ? { cx: 14.2, cy: 9.6, r: 5.4 } : { cx: 27, cy: -3, r: 5.4 }}
          transition={t(0.5)}
          fill="#000"
        />
      </mask>

      {/* Raios de luz */}
      <motion.g
        className="theme-icon-rays"
        initial={false}
        animate={isDark ? { opacity: 0, scale: 0.4, rotate: -45 } : { opacity: 1, scale: 1, rotate: 0 }}
        transition={t(0.4)}
        style={{ originX: '12px', originY: '12px' }}
      >
        {RAYS.map((ray, i) => (
          <line key={i} {...ray} />
        ))}
      </motion.g>

      {/* Hóstia → lua */}
      <motion.circle
        className="theme-icon-body"
        initial={false}
        animate={isDark ? { cx: 10, cy: 13, r: 6.4 } : { cx: 12, cy: 12, r: 5.4 }}
        transition={t(0.5)}
        mask={`url(#${maskId})`}
      />

      {/* Cruz gravada na Hóstia */}
      <motion.path
        className="theme-icon-host-cross"
        d="M12 9.4v5.2M9.4 12h5.2"
        initial={false}
        animate={{ opacity: isDark ? 0 : 1 }}
        transition={t(0.2)}
      />

      {/* Cruz da noite, desenhada ao lado da lua */}
      <motion.path
        className="theme-icon-cross"
        d="M19 2.8v8.4M16.6 5.4h4.8"
        initial={false}
        animate={isDark ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={t(0.45, isDark ? 0.2 : 0)}
      />

      {/* Estrelas */}
      {STARS.map((star) => (
        <motion.path
          key={`${star.x}-${star.y}`}
          className="theme-icon-star"
          d={`M${star.x} ${star.y - star.size}v${star.size * 2}M${star.x - star.size} ${star.y}h${star.size * 2}`}
          initial={false}
          animate={isDark ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={t(0.3, isDark ? star.delay : 0)}
          style={{ originX: `${star.x}px`, originY: `${star.y}px` }}
        />
      ))}
    </svg>
  );
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);
  }, [theme]);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // sem persistência: o tema vale apenas para esta visita
    }
  };

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      title={isDark ? 'Modo claro' : 'Modo escuro'}
    >
      <ThemeIcon isDark={isDark} />
    </button>
  );
}
