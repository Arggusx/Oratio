import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import DailyReading3Blocks from '../components/DailyReading3Blocks';
import Dove from '../components/anim/Dove';
import TwinkleCrosses from '../components/anim/TwinkleCrosses';
import LogoDraw from '../components/anim/LogoDraw';
import HandwritingText from '../components/anim/HandwritingText';
import PrayerNow from '../components/anim/PrayerNow';

const stagger = {
  animate: {
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] } },
};

export default function Home() {
  return (
    <main className="page">
      {/* ── Hero Section ── */}
      <motion.section
        className="home-hero"
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        <TwinkleCrosses />
        <Dove />
        <Dove second />
        <motion.div className="hero-copy" variants={fadeUp}>
          <div className="hero-mark">
            <LogoDraw size={64} showName={false} />
            <span className="eyebrow">Um instante para o sagrado</span>
          </div>
          {/* O título é escrito “à mão”; o texto real fica para leitores de tela e buscadores. */}
          <h1 className="display hero-title-hand">
            <span className="sr-only">Reze com calma. Viva com fé.</span>
            <HandwritingText />
          </h1>
          <p className="lead">
            Um refúgio diário para o silêncio, a contemplação dos mistérios
            e a Palavra que sustenta o caminho.
          </p>
          <Link className="btn" to="/home/oracoes">
            Começar a rezar o terço
            <ArrowRight size={17} />
          </Link>
        </motion.div>

        <motion.div className="hero-image" variants={fadeUp}>
          <img
            src="/img2/img-terco.webp"
            width="612"
            height="408"
            alt="Mãos segurando um terço em oração"
          />
        </motion.div>
      </motion.section>

      {/* ── Oração do momento do dia, escrita com uma pena ── */}
      <PrayerNow />

      {/* ── Leitura Diária em 3 Blocos (5 a 10 min, sem Evangelho) ── */}
      <DailyReading3Blocks />
    </main>
  );
}


