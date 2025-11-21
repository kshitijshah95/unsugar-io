import { useState, useEffect, type FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '@styles/components/NavBar.css';
import logo from '@assets/logo.png';

const NavBar: FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`nav-header ${isScrolled ? 'scrolled' : ''}`}>
      <nav className="nav-container">
        <Link to="/" className="nav-brand">
          <img src={logo} alt="Unsugar Logo" className="nav-logo" />
        </Link>
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/blog" 
            className={`nav-link ${location.pathname === '/blog' ? 'active' : ''}`}
          >
            Articles
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;