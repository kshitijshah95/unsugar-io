import type { FC } from 'react';
import '@/styles/components/ErrorFallback.css';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  title?: string;
  message?: string;
}

/**
 * Generic Error Fallback Component
 * Can be used as a fallback UI for error boundaries
 */
export const ErrorFallback: FC<ErrorFallbackProps> = ({
  error,
  resetError,
  title = 'Something went wrong',
  message = "We're sorry for the inconvenience. Please try again.",
}) => {
  return (
    <div className="error-fallback">
      <div className="error-fallback-content">
        <div className="error-icon">⚠️</div>
        <h2 className="error-title">{title}</h2>
        <p className="error-message">{message}</p>
        
        {import.meta.env.DEV && error && (
          <details className="error-details">
            <summary>Error Details (Development Only)</summary>
            <pre className="error-stack">{error.stack || error.message}</pre>
          </details>
        )}

        <div className="error-actions">
          {resetError && (
            <button onClick={resetError} className="btn-primary">
              Try Again
            </button>
          )}
          <button onClick={() => window.location.href = '/'} className="btn-secondary">
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Page Not Found Error Component
 */
export const NotFoundError: FC = () => {
  return (
    <div className="error-fallback">
      <div className="error-fallback-content">
        <div className="error-icon">🔍</div>
        <h2 className="error-title">404 - Page Not Found</h2>
        <p className="error-message">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="error-actions">
          <button onClick={() => window.location.href = '/'} className="btn-primary">
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Network Error Component
 */
export const NetworkError: FC<{ retry?: () => void }> = ({ retry }) => {
  return (
    <div className="error-fallback">
      <div className="error-fallback-content">
        <div className="error-icon">📡</div>
        <h2 className="error-title">Network Error</h2>
        <p className="error-message">
          Unable to connect to the server. Please check your internet connection.
        </p>
        <div className="error-actions">
          {retry && (
            <button onClick={retry} className="btn-primary">
              Retry
            </button>
          )}
          <button onClick={() => window.location.reload()} className="btn-secondary">
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Authentication Error Component
 */
export const AuthError: FC = () => {
  return (
    <div className="error-fallback">
      <div className="error-fallback-content">
        <div className="error-icon">🔒</div>
        <h2 className="error-title">Authentication Required</h2>
        <p className="error-message">
          You need to be logged in to access this page.
        </p>
        <div className="error-actions">
          <button onClick={() => window.location.href = '/auth'} className="btn-primary">
            Login
          </button>
          <button onClick={() => window.location.href = '/'} className="btn-secondary">
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
