import { Button, Tooltip } from '@jhonatankennedy/ui-react';
import { ArrowDown, ArrowUp, Pencil, Trash2 } from 'lucide-react';

export interface RowActionsProps {
  name: string;
  pending: boolean;
  moveUp: number | null;
  moveDown: number | null;
  onMove: (position: number) => void;
  onStartEdit: () => void;
  onRemove: () => void;
}

export function RowActions({
  name,
  pending,
  moveUp,
  moveDown,
  onMove,
  onStartEdit,
  onRemove,
}: RowActionsProps) {
  return (
    <div className="row-actions flex w-full justify-end gap-1 sm:w-auto sm:shrink-0 sm:items-center">
      <span className="flex">
        {moveUp !== null && (
          <Tooltip tip="Subir">
            <Button
              variant="ghost"
              size="sm"
              disabled={pending}
              onClick={() => onMove(moveUp)}
            >
              <ArrowUp size={16} strokeWidth={2.5} aria-hidden="true" />
              <span className="sr-only">Subir “{name}”</span>
            </Button>
          </Tooltip>
        )}
        {moveDown !== null && (
          <Tooltip tip="Descer">
            <Button
              variant="ghost"
              size="sm"
              disabled={pending}
              onClick={() => onMove(moveDown)}
            >
              <ArrowDown size={16} strokeWidth={2.5} aria-hidden="true" />
              <span className="sr-only">Descer “{name}”</span>
            </Button>
          </Tooltip>
        )}
      </span>

      <Tooltip tip="Editar">
        <Button
          variant="ghost"
          size="sm"
          disabled={pending}
          onClick={onStartEdit}
        >
          <Pencil size={16} strokeWidth={2.5} aria-hidden="true" />
          <span className="sr-only">Editar “{name}”</span>
        </Button>
      </Tooltip>
      <Tooltip tip="Remover">
        <Button variant="ghost" size="sm" disabled={pending} onClick={onRemove}>
          <Trash2 size={16} strokeWidth={2.5} aria-hidden="true" />
          <span className="sr-only">Remover “{name}”</span>
        </Button>
      </Tooltip>
    </div>
  );
}
