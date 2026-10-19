import { Link } from 'react-router-dom';
import { Cross, Github, Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Coluna 1: Marca e Missão */}
          <div className="footer-col brand-col">
            <div className="footer-brand-header">
              <img src="/img2/icon_site.png" alt="Oratio Daily" className="footer-brand-icon" />
              <span className="footer-brand-name">Oratio Daily</span>
            </div>
            <p className="footer-description">
              Um espaço dedicado à contemplação, oração e espiritualidade católica. Que a Palavra e a devoção diária tragam paz e esperança ao seu coração.
            </p>
          </div>

          {/* Coluna 2: Navegação Rápida */}
          <div className="footer-col">
            <h4 className="footer-col-title">Navegação</h4>
            <ul className="footer-nav-list">
              <li><Link to="/">Início</Link></li>
              <li><Link to="/home/misterio">Mistérios do Terço</Link></li>
              <li><Link to="/home/leituras">Liturgia Diária</Link></li>
              <li><Link to="/home/oracoes">Terço e Orações</Link></li>
              <li><Link to="/home/calendario">Calendário Católico</Link></li>
              <li><Link to="/home/curiosidades">Curiosidades</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Fontes e Desenvolvedor / Contato */}
          <div className="footer-col">
            <h4 className="footer-col-title">Informações & Contato</h4>
            <a href="https://www.cancaonova.com/" target="_blank" rel="noopener noreferrer" className="footer-info-text">
              Conteúdo litúrgico fornecido por <strong>Canção Nova</strong>.
            </a>
            <div className="footer-contact">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="github-contact-btn"
              >
                <Github size={16} />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-divider">
            <Cross size={14} />
          </div>
          <p className="footer-copy">
            © {year} <strong>Oratio</strong>. Todos os direitos reservados. Desenvolvido por <strong>Douglas/Arggusx</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}

