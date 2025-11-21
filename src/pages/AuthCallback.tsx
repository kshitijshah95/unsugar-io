import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';

/**
 * OAuth Callback Handler
 * Receives POST data from backend OAuth flow
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handlePostMessage = async () => {
      try {
        // Check if this is a POST request with form data
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('accessToken');
        const refreshToken = urlParams.get('refreshToken');

        if (accessToken && refreshToken) {
          // Store tokens from OAuth callback
          authService.storeTokensFromOAuth(accessToken, refreshToken);
          
          // Redirect to home - AuthContext will load user
          navigate('/', { replace: true });
        } else {
          // No tokens found, redirect to auth page
          setError('Authentication failed. Please try again.');
          setTimeout(() => navigate('/auth', { replace: true }), 2000);
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        setError('Authentication failed. Please try again.');
        setTimeout(() => navigate('/auth', { replace: true }), 2000);
      }
    };

    handlePostMessage();
  }, [navigate]);

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ fontSize: '3rem' }}>❌</div>
        <h2>{error}</h2>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div className="spinner" style={{ 
        width: '50px', 
        height: '50px', 
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <h2>Completing authentication...</h2>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
