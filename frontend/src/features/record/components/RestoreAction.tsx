import { useState } from 'react';
import { Button } from '@jhonatankennedy/ui-react';
import { Undo2 } from 'lucide-react';

type RestoreActionProps = {
  versionNumber: number;
  isRestoring: boolean;
  onRestore: () => void;
};

export function RestoreAction({
  versionNumber,
  isRestoring,
  onRestore,
}: RestoreActionProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <div className="mt-1 grid gap-2 border-t border-hairline pt-3">
      {isConfirming ? (
        <>
          <p className="font-body text-mono leading-snug text-record-ink">
            A lista volta ao que era na versão {versionNumber}.{' '}
            <strong>
              As versões seguintes serão apagadas, e isso não pode ser desfeito.
            </strong>
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="primary"
              size="sm"
              className="on-fill"
              disabled={isRestoring}
              onClick={onRestore}
            >
              {isRestoring
                ? 'Restaurando…'
                : `Restaurar a versão ${versionNumber}`}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={isRestoring}
              onClick={() => setIsConfirming(false)}
            >
              Cancelar
            </Button>
          </div>
        </>
      ) : (
        <div>
          <Button
            variant="ghost"
            size="sm"
            disabled={isRestoring}
            onClick={() => setIsConfirming(true)}
          >
            <Undo2 size={15} strokeWidth={2.5} aria-hidden="true" />
            Restaurar esta versão
          </Button>
        </div>
      )}
    </div>
  );
}
