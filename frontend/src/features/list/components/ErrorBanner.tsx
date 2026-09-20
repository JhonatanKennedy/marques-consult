import { Alert, Button } from '@jhonatankennedy/ui-react';
import { describeError } from '@/text/errors';

type ErrorBannerProps = {
  error: unknown;
  onDismiss: () => void;
  onRetry: () => void;
};

export function ErrorBanner({ error, onDismiss, onRetry }: ErrorBannerProps) {
  const { title, detail } = describeError(error);

  return (
    <div className="shrink-0 px-6 pt-4">
      <div className="measure">
        <div className="alert-danger">
          <Alert
            variant="danger"
            title={title}
            open
            dismissible
            onDismiss={onDismiss}
          >
            <p className="font-body text-body leading-relaxed">{detail}</p>
          </Alert>
        </div>
        <div className="mt-3">
          <Button variant="primary" size="md" onClick={onRetry}>
            Tentar de novo
          </Button>
        </div>
      </div>
    </div>
  );
}
