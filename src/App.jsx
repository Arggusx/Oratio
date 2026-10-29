import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import Feedback from './components/Feedback';
import Home from './pages/Home';
import usePageMeta from './utils/usePageMeta';
import { SeasonContext, useSeasonTheme } from './utils/useSeasonTheme';
import Angel from './components/anim/Angel';
import SiteBackground from './components/anim/SiteBackground';
import RosaryLoader from './components/anim/RosaryLoader';

// A página inicial vem no pacote principal; as demais são baixadas só quando abertas.
const Misterios = lazy(() => import('./pages/Misterios'));
const Leituras = lazy(() => import('./pages/Leituras'));
const Oracoes = lazy(() => import('./pages/Oracoes'));
const EscolaDaFe = lazy(() => import('./pages/EscolaDaFe'));
const FocusMystery = lazy(() => import('./pages/FocusMystery'));
const Calendario = lazy(() => import('./pages/Calendario'));
const Santos = lazy(() => import('./pages/Santos'));
const Santo = lazy(() => import('./pages/Santo'));
const Privacidade = lazy(() => import('./pages/Privacidade'));
const Creditos = lazy(() => import('./pages/Creditos'));
const Confissao = lazy(() => import('./pages/Confissao'));
const Jornada = lazy(() => import('./pages/Jornada'));
const Novenas = lazy(() => import('./pages/Novenas'));
const Trilhas = lazy(() => import('./pages/Trilhas'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Comunidade = lazy(() => import('./pages/Comunidade'));

function NotFound() {
  return (
    <main className="page">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">Página não encontrada</span>
          <h1 className="section-title">Este caminho não existe</h1>
        </div>
        <Angel />
      </div>
      <p className="lead">O endereço pode ter mudado ou sido digitado errado.</p>
      <Link className="btn" to="/" style={{ marginTop: '1.5rem' }}>
        Voltar para o início
      </Link>
    </main>
  );
}

function PageFallback() {
  return (
    <main className="page page-loading" aria-busy="true">
      <RosaryLoader />
    </main>
  );
}
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const pageTransition = {
  duration: 0.4,
  ease: [0.33, 1, 0.68, 1],
};

function AnimatedRoutes() {
  const location = useLocation();

  // Ao abrir outra página (ex.: a página de um santo), começa do topo.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Título, descrição e endereço canônico de cada página (SEO).
  usePageMeta(location.pathname);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
      >
        <Suspense fallback={<PageFallback />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/home/misterio" element={<Misterios />} />
            <Route path="/home/leituras" element={<Leituras />} />
            <Route path="/home/oracoes" element={<Oracoes />} />
            <Route path="/home/escola-da-fe" element={<EscolaDaFe />} />
            {/* Endereço antigo da página */}
            <Route path="/home/curiosidades" element={<Navigate to="/home/escola-da-fe" replace />} />
            <Route path="/home/calendario" element={<Calendario />} />
            <Route path="/home/santos" element={<Santos />} />
            <Route path="/home/santos/:slug" element={<Santo />} />
            <Route path="/privacidade" element={<Privacidade />} />
            <Route path="/creditos" element={<Creditos />} />
            <Route path="/home/confissao" element={<Confissao />} />
            <Route path="/jornada" element={<Jornada />} />
            <Route path="/comunidade" element={<Comunidade />} />
            <Route path="/home/novenas" element={<Novenas />} />
            <Route path="/home/novenas/:id" element={<Novenas />} />
            <Route path="/home/trilhas" element={<Trilhas />} />
            <Route path="/home/trilhas/:id" element={<Trilhas />} />
            <Route path="/home/trilhas/:id/quiz/:level" element={<Quiz />} />
            <Route path="/home/quiz/aleatorio" element={<Quiz />} />
            <Route path="/home/misterio/foco/:tipo/:id" element={<FocusMystery />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  // Tema do tempo litúrgico (Advento, Natal, Quaresma, Páscoa...): troca cores e enfeites sozinho.
  const season = useSeasonTheme();

  return (
    <SeasonContext.Provider value={season}>
      <BrowserRouter>
        {/* reducedMotion="user": as animações do Framer Motion seguem a preferência do sistema. */}
        <MotionConfig reducedMotion="user">
          <div className="app-shell">
            <SiteBackground />
            <a href="#conteudo" className="skip-link">
              Pular para o conteúdo
            </a>
            <Header />
            <div id="conteudo" tabIndex={-1} className="content-anchor">
              <AnimatedRoutes />
            </div>
            <Feedback />
            <Footer />
            <BottomNav />
          </div>
        </MotionConfig>
      </BrowserRouter>
    </SeasonContext.Provider>
  );
}
