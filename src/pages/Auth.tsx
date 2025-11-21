import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';
import { ApiError } from '@/lib/apiClient';
import { features, isAnySSOEnabled } from '@/config/features';
import '@/styles/pages/Auth.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register } = useAuth();

  // Handle OAuth callback
  useState(() => {
    const handleOAuthCallback = async () => {
      const accessToken = searchParams.get('accessToken');
      const refreshToken = searchParams.get('refreshToken');
      
      if (accessToken && refreshToken) {
        try {
          // Store tokens from OAuth callback
          authService.storeTokensFromOAuth(accessToken, refreshToken);
          // AuthContext's useEffect will load user data on mount
          navigate('/');
        } catch (error) {
          console.error('OAuth callback error:', error);
          navigate('/auth');
        }
      }
    };
    
    handleOAuthCallback();
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        await login(email, password);
        navigate('/');
      } else {
        // Register
        await register(email, password, name);
        navigate('/');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'github' | 'apple') => {
    // Redirect to backend OAuth endpoint
    window.location.href = `${API_BASE_URL}/api/v1/auth/${provider}`;
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="auth-subtitle">
            {isLogin 
              ? 'Sign in to track your reading progress' 
              : 'Join to save your reading list'}
          </p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          {/* SSO Section - Only show if any SSO provider is enabled */}
          {isAnySSOEnabled() && (
            <>
              <div className="auth-divider">
                <span>or continue with</span>
              </div>

              <div className="social-buttons">
                {features.enableGoogleSSO && (
                  <button 
                    className="social-btn google"
                    onClick={() => handleSocialLogin('google')}
                    type="button"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </button>
                )}

                {features.enableGitHubSSO && (
                  <button 
                    className="social-btn github"
                    onClick={() => handleSocialLogin('github')}
                    type="button"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                    </svg>
                    GitHub
                  </button>
                )}

                {features.enableAppleSSO && (
                  <button 
                    className="social-btn apple"
                    onClick={() => handleSocialLogin('apple')}
                    type="button"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                    Apple
                  </button>
                )}
              </div>
            </>
          )}

          <div className="auth-toggle">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              type="button"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
