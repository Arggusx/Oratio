import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import Feedback from './components/Feedback';
import Home from './pages/Home';
import Misterios from './pages/Misterios';
import Leituras from './pages/Leituras';
import Oracoes from './pages/Oracoes';
import EscolaDaFe from './pages/EscolaDaFe';
import FocusMystery from './pages/FocusMystery';
import Calendario from './pages/Calendario';
import Santos from './pages/Santos';
import Santo from './pages/Santo';
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -10 },
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
          <Route path="/home/misterio/foco/:tipo/:id" element={<FocusMystery />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header />
        <AnimatedRoutes />
        <Feedback />
        <Footer />
      </div>
    </BrowserRouter>
  );
}
