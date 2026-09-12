'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to database via API
    fetch('/api/shared/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        level: 'error',
        message: 'React Error Boundary caught an error',
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        metadata: {
          componentStack: errorInfo.componentStack,
          source: 'client',
          errorId: this.state.errorId,
        },
      }),
      // biome-ignore lint/suspicious/noConsole: ignore console error
    }).catch(console.error);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReportError = () => {
    const subject = `Error Report - ${this.state.errorId}`;
    const body = `Error ID: ${this.state.errorId}\nError: ${this.state.error?.message}\nURL: ${window.location.href}\n\nPlease describe what you were doing when this error occurred:`;
    window.location.href = `mailto:support@yourcompany.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col justify-center bg-accent py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-background px-4 py-8 shadow-lg sm:rounded-lg sm:px-10">
              {/* Error Icon */}
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              {/* Title */}
              <h1 className="mb-2 text-center font-bold text-2xl text-foreground">
                Oops! Something went wrong
              </h1>
              {/* Message */}
              <p className="mb-6 text-center text-muted-foreground">
                We're sorry, but an unexpected error occurred. Our team has been
                notified and is working on a fix.
              </p>
              {/* Error ID */}
              <div className="mb-6 rounded-lg bg-accent p-4">
                <div className="text-center">
                  <p className="mb-1 font-medium text-foreground text-sm">
                    Error ID
                  </p>
                  <p className="break-all font-mono text-muted-foreground text-xs">
                    {this.state.errorId}
                  </p>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 font-medium text-sm text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={this.handleReload}
                  type="button"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                  Reload Page
                </button>
                <button
                  className="flex w-full justify-center rounded-md border border-border bg-background px-4 py-2 font-medium text-muted-foreground text-sm shadow-sm transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={this.handleGoHome}
                  type="button"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                  Go to Home
                </button>
                <button
                  className="flex w-full justify-center rounded-md border border-border bg-background px-4 py-2 font-medium text-muted-foreground text-sm shadow-sm transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={this.handleReportError}
                  type="button"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                  Report Error
                </button>
              </div>
              {/* Additional Help */}
              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-xs">
                  If the problem persists, please contact our support team with
                  the error ID above.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
