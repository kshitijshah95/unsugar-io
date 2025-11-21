import type { FC } from 'react';
import { Link } from 'react-router-dom';
import '@styles/components/Footer.css';

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-brand">
              <span className="brand-text">Unsugar</span>
              <span className="brand-domain">.io</span>
            </div>
            <p className="footer-tagline">
              Demystifying JavaScript's syntactic sugar, one concept at a time.
            </p>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Navigation</h3>
            <nav className="footer-links">
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/blog" className="footer-link">Articles</Link>
            </nav>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Learn</h3>
            <div className="footer-links">
              <span className="footer-text">ES6+ Features</span>
              <span className="footer-text">Async Patterns</span>
              <span className="footer-text">Core Concepts</span>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Connect</h3>
            <div className="footer-links">
              <a 
                href="https://github.com" 
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a 
                href="https://twitter.com" 
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} Unsugar.io. Built with purpose to educate.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
