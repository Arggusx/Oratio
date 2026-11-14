import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import './JornadaEmBreve.css';

/**
 * /jornada com a Jornada desligada (VITE_JORNADA diferente de 'true'): um aviso de "em breve" no lugar
 * dos jogos. É leve de propósito: o código da Jornada não entra no pacote.
 */
export default function JornadaEmBreve() {
  return (
    <main className="page jornada-em-breve">
      <section className="jornada-em-breve-card" aria-labelledby="jornada-em-breve-title">
        <span className="jornada-em-breve-icon" aria-hidden="true">
          <Compass size={28} />
        </span>
        <span className="eyebrow">Em breve</span>
        <h1 id="jornada-em-breve-title" className="section-title">
          Jornada
        </h1>
        <p className="lead">Em breve: um caminho de oração para acompanhar os seus dias.</p>
        <p className="jornada-em-breve-note">Enquanto isso, o que você marca no site já fica guardado neste aparelho.</p>
        <div className="jornada-em-breve-links">
          <Link to="/home/oracoes" className="btn">
            Rezar o terço
          </Link>
          <Link to="/home/novenas" className="fx-small-btn">
            Novenas
          </Link>
          <Link to="/home/escola-da-fe" className="fx-small-btn">
            Escola da Fé
          </Link>
        </div>
      </section>
    </main>
  );
}
