import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@jhonatankennedy/ui-react';
import { CRASH_MESSAGE } from '@/text/errors';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  failed: boolean;
};

const INTACT: ErrorBoundaryState = { failed: false };

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state = INTACT;

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;

    const handleReload = () => window.location.reload();

    return (
      <div className="grid min-h-dvh place-items-center bg-ground px-6 text-ink">
        <div className="measure text-center">
          <h1 className="font-display text-headline">{CRASH_MESSAGE.title}</h1>
          <p className="mt-3 font-body text-body leading-relaxed text-ink-soft">
            {CRASH_MESSAGE.detail}
          </p>
          <div className="mt-5">
            <Button variant="primary" size="md" onClick={handleReload}>
              {CRASH_MESSAGE.action}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
