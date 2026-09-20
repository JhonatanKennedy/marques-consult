import { Button } from '@jhonatankennedy/ui-react';

type ItemFormActionsProps = {
  submitLabel: string;
  isSaving: boolean;
  onSubmit: () => void;
  onCancel?: () => void;
};

export function ItemFormActions({
  submitLabel,
  isSaving,
  onSubmit,
  onCancel,
}: ItemFormActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="primary"
        size="md"
        disabled={isSaving}
        onClick={onSubmit}
      >
        {isSaving ? 'Gravando…' : submitLabel}
      </Button>
      {onCancel && (
        <Button
          variant="ghost"
          size="md"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancelar
        </Button>
      )}
      <span className="ml-auto font-mono text-label text-ink-soft">
        Toda mudança vira uma versão
      </span>
    </div>
  );
}
