import { Button, Card } from '@jhonatankennedy/ui-react';

export interface RemoveConfirmProps {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function RemoveConfirm({
  name,
  onConfirm,
  onCancel,
}: RemoveConfirmProps) {
  return (
    <Card accent="var(--ds-destructive)" className="danger-scope">
      <div className="grid gap-3">
        <p className="font-body text-body leading-snug">
          Remover <strong>“{name}”</strong> da lista?
        </p>

        <p className="font-mono text-label leading-relaxed text-ink-soft">
          A remoção vira uma versão nova no registro, como tudo o mais.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="danger" size="md" onClick={onConfirm}>
            Remover
          </Button>
          <Button variant="ghost" size="md" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </div>
    </Card>
  );
}
