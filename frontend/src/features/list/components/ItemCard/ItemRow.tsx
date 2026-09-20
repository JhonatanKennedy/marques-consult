import { Card } from '@jhonatankennedy/ui-react';
import type { ListItem } from '@/domain/list';
import { DragHandle } from '@/features/list/components/DragHandle';
import type { HandleProps } from '@/features/list/components/SortableItem';
import { RowActions } from './RowActions';

export interface ItemRowProps {
  item: ListItem;
  position: number;
  pending: boolean;
  moveUp: number | null;
  moveDown: number | null;
  handleProps: HandleProps | null;
  dragging: boolean;
  onMove: (position: number) => void;
  onStartEdit: () => void;
  onRequestRemove: () => void;
}

export function ItemRow({
  item,
  position,
  pending,
  moveUp,
  moveDown,
  handleProps,
  dragging,
  onMove,
  onStartEdit,
  onRequestRemove,
}: ItemRowProps) {
  return (
    <Card className={`row ${dragging ? 'opacity-0' : ''}`}>
      <div
        className={`flex flex-wrap items-start gap-x-3 gap-y-2 transition-opacity ${pending ? 'opacity-50' : ''}`}
      >
        {handleProps && (
          <DragHandle
            label={`Mover “${item.name}”`}
            nodeRef={handleProps.nodeRef}
            {...handleProps.attributes}
            {...handleProps.listeners}
          />
        )}

        <span
          aria-hidden="true"
          className="pt-1 font-mono text-mono font-bold tabular-nums text-ink-soft"
        >
          {String(position).padStart(2, '0')}
        </span>

        <div className="min-w-0 flex-1 grid gap-1">
          <p className="font-body text-item-name font-bold leading-snug break-words">
            {item.name}
          </p>
          {item.description && (
            <p className="font-body text-body leading-snug text-ink-soft break-words">
              {item.description}
            </p>
          )}
        </div>

        {handleProps && (
          <RowActions
            name={item.name}
            pending={pending}
            moveUp={moveUp}
            moveDown={moveDown}
            onMove={onMove}
            onStartEdit={onStartEdit}
            onRemove={onRequestRemove}
          />
        )}
      </div>
    </Card>
  );
}
