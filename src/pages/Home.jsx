import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import DailyReading3Blocks from '../components/DailyReading3Blocks';
import Dove from '../components/anim/Dove';
import TwinkleCrosses from '../components/anim/TwinkleCrosses';
import LogoDraw from '../components/anim/LogoDraw';
import HandwritingText from '../components/anim/HandwritingText';
import PrayerNow from '../components/anim/PrayerNow';
import SeasonOrnament from '../components/anim/SeasonOrnament';
import SeasonPhotoOrnament from '../components/anim/SeasonPhotoOrnament';
import HomeToday from '../components/HomeToday';
import { MYSTERY_TITLES } from '../data/mysteryTitles';
import { getTodayMysteryKey } from '../utils/liturgicalCalendar';

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
        <motion.div className="hero-copy" variants={fadeUp}>
          <div className="hero-mark">
            <LogoDraw size={64} showName={false} />
            <span className="eyebrow">Um instante para o sagrado</span>
          </div>
          {/* O título é escrito “à mão”; o texto real fica para leitores de tela e buscadores. */}
          <SeasonOrnament />
          <h1 className="display hero-title-hand">
            <span className="sr-only">Reze com calma. Viva com fé.</span>
            <HandwritingText />
          </h1>
          <p className="lead">
            Um refúgio diário para o silêncio, a contemplação dos mistérios
            e a Palavra que sustenta o caminho.
          </p>
        </motion.div>

        {/* Cartão do terço de hoje: a foto com o mistério do dia e o botão por cima. */}
        <motion.div className="hero-image" variants={fadeUp}>
          <img
            src="/img2/img-terco.webp"
            width="612"
            height="408"
            alt="Mãos segurando um terço em oração"
          />
          <SeasonPhotoOrnament />
          <div className="hero-image-caption">
            <span className="hero-image-kicker">Terço de hoje · ~20 min</span>
            <strong>{MYSTERY_TITLES[getTodayMysteryKey()]}</strong>
            <Link className="btn btn-on-photo" to="/home/oracoes">
              Começar a rezar
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      </motion.section>

      <HomeToday />

      {/* ── Oração do momento do dia, escrita com uma pena ── */}
      <PrayerNow />

      {/* ── Leitura Diária em 3 Blocos (5 a 10 min, sem Evangelho) ── */}
      <DailyReading3Blocks />
    </main>
  );
}


