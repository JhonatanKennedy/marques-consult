import { Button, Tooltip } from '@jhonatankennedy/ui-react';
import { Plus } from 'lucide-react';

interface Props {
  dimmed: string;
  disabled: boolean;
  onAdd: () => void;
}

export function AddButton({ dimmed, disabled, onAdd }: Props) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 pb-6 ${dimmed}`}
    >
      <div className="measure flex justify-end px-6">
        <span className="pointer-events-auto">
          <Tooltip tip="Adicionar um item">
            <Button
              variant="primary"
              size="lg"
              disabled={disabled}
              onClick={onAdd}
            >
              <span className="inline-flex items-center gap-2">
                <Plus size={20} strokeWidth={3} aria-hidden="true" />
                Adicionar
              </span>
            </Button>
          </Tooltip>
        </span>
      </div>
    </div>
  );
}
