import type { FC } from 'react';
import BlogList from '@pages/BlogList';
import './Home.css';

const Home: FC = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Demystifying JavaScript's
            <span className="hero-highlight"> Syntactic Sugar</span>
          </h1>
          <p className="hero-description">
            Unsugar.io breaks down JavaScript's convenient syntax shortcuts into their
            underlying core concepts. We transform complex syntactic sugar into clear,
            fundamental code patterns — helping you truly understand what your JavaScript
            is doing behind the scenes.
          </p>
          <div className="hero-features">
            <div className="feature">
              <div className="feature-icon">⚡</div>
              <div className="feature-text">
                <h3>Core Concepts</h3>
                <p>Deep dive into JavaScript fundamentals</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">🔍</div>
              <div className="feature-text">
                <h3>Desugar Code</h3>
                <p>See the real mechanics behind the syntax</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">📚</div>
              <div className="feature-text">
                <h3>Learn Better</h3>
                <p>Build stronger mental models</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <BlogList />
    </div>
  );
};

export default Home;