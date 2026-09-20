import { useState } from 'react';
import type { Status } from '@/infrastructure/listQuery';
import type { ItemDraft, ListItem } from '@/domain/list';
import { AddButton } from '@/features/list/components/AddButton';
import { AddPanel } from '@/features/list/components/AddPanel';
import { ListBody } from '@/features/list/components/ListBody';

type ListColumnProps = {
  status: Status;
  items: ListItem[];
  isBusy: boolean;
  isRemoving: (itemId: string) => boolean;
  isMoving: (itemId: string) => boolean;
  dimmed: string;
  onAdd: (draft: ItemDraft) => Promise<void>;
  onEdit: (id: string, draft: ItemDraft) => Promise<void>;
  onRemove: (id: string) => void;
  onMove: (id: string, position: number) => void;
  onRetry: () => void;
};

export function ListColumn({
  status,
  items,
  isBusy,
  isRemoving,
  isMoving,
  dimmed,
  onAdd,
  onEdit,
  onRemove,
  onMove,
  onRetry,
}: ListColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const startAdding = () => {
    setIsAdding(true);
    setEditingId(null);
  };

  const canAdd = !isAdding && status === 'ready';

  return (
    <div className="relative flex-none lg:min-h-0 lg:flex-1">
      <div className="lg:h-full lg:overflow-y-auto">
        <div className="measure px-6 pt-8 pb-32">
          {isAdding && (
            <AddPanel
              dimmed={dimmed}
              onSubmit={async (draft) => {
                await onAdd(draft);
                setIsAdding(false);
              }}
              onCancel={() => setIsAdding(false)}
            />
          )}

          <ListBody
            status={status}
            items={items}
            isAdding={isAdding}
            editingId={editingId}
            isBusy={isBusy}
            isRemoving={isRemoving}
            isMoving={isMoving}
            dimmed={dimmed}
            onRetry={onRetry}
            onAdd={startAdding}
            onMove={onMove}
            onStartEdit={setEditingId}
            onStopEdit={() => setEditingId(null)}
            onEdit={onEdit}
            onRemove={onRemove}
          />
        </div>
      </div>

      {canAdd && (
        <AddButton dimmed={dimmed} disabled={isBusy} onAdd={startAdding} />
      )}
    </div>
  );
}
