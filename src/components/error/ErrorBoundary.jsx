import React from 'react';
import { RefreshCw, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { getLogBuffer } from '../../utils/logger';

/**
 * ErrorBoundary — Catches uncaught React render errors and displays a
 * recovery UI instead of a blank white screen.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <App />
 *   </ErrorBoundary>
 *
 * Features:
 *   - Shows rider-friendly error screen
 *   - "Try Again" resets the boundary so the user can retry
 *   - "Reload App" does a hard refresh
 *   - In dev: shows the error stack inline
 *   - Attaches the last 20 log entries for debugging
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });

    // Log with buffer context for debugging
    const recentLogs = getLogBuffer().slice(-20);
    console.error('[ErrorBoundary] Caught render error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      recentLogs,
    });
  }

  handleRetry = () => {
    this.setState(prev => ({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      retryCount: prev.retryCount + 1,
    }));
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const { error, errorInfo, showDetails } = this.state;
    const isDev = import.meta.env.DEV;

    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-0)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        fontFamily: 'var(--font-body)',
      }}>

        {/* Icon */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'var(--red-dim)',
          border: '2px solid rgba(255,77,109,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24,
        }}>
          <AlertTriangle size={32} style={{ color: 'var(--red)' }} />
        </div>

        {/* Title */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22, fontWeight: 800,
          color: 'var(--text-0)',
          textAlign: 'center', marginBottom: 8,
          letterSpacing: '-0.02em',
        }}>
          Something went wrong
        </div>

        <div style={{
          fontSize: 14, color: 'var(--text-2)',
          textAlign: 'center', lineHeight: 1.6,
          marginBottom: 32, maxWidth: 300,
        }}>
          The app ran into an unexpected error. Your data is safe — try refreshing or reloading.
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 300 }}>
          <button
            onClick={this.handleRetry}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <RefreshCw size={15} /> Try Again
          </button>

          <button
            onClick={() => window.location.reload()}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Reload App
          </button>
        </div>

        {/* Dev-only error details */}
        {isDev && error && (
          <div style={{ width: '100%', maxWidth: 480, marginTop: 24 }}>
            <button
              onClick={() => this.setState(s => ({ showDetails: !s.showDetails }))}
              style={{
                background: 'none', border: '1px solid var(--border)',
                borderRadius: 8, padding: '8px 14px',
                color: 'var(--text-2)', cursor: 'pointer',
                fontSize: 12, fontFamily: 'var(--font-mono)',
                display: 'flex', alignItems: 'center', gap: 6,
                width: '100%', justifyContent: 'center',
              }}
            >
              {showDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {showDetails ? 'Hide' : 'Show'} error details (dev)
            </button>

            {showDetails && (
              <div style={{
                marginTop: 12, padding: 14,
                background: 'var(--bg-2)', border: '1px solid var(--border)',
                borderRadius: 10, overflow: 'auto',
              }}>
                <div style={{
                  fontSize: 11, fontFamily: 'var(--font-mono)',
                  color: 'var(--red)', marginBottom: 10,
                  wordBreak: 'break-word',
                }}>
                  {error.toString()}
                </div>
                {errorInfo?.componentStack && (
                  <pre style={{
                    fontSize: 10, color: 'var(--text-2)',
                    fontFamily: 'var(--font-mono)',
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    margin: 0,
                  }}>
                    {errorInfo.componentStack.trim()}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
