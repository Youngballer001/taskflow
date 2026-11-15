import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Keep the failure visible in development tools without exposing details in the UI.
    console.error('TaskFlow failed to render.', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-boundary" role="alert">
          <div className="error-boundary-card">
            <span className="brand-mark" aria-hidden="true">T</span>
            <h1>TaskFlow couldn’t load this page</h1>
            <p>Something went wrong while displaying the application. Try reloading the page.</p>
            <button className="primary-button" type="button" onClick={() => window.location.reload()}>
              Reload TaskFlow
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
