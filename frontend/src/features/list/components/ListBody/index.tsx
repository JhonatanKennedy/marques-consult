import { Button } from '@jhonatankennedy/ui-react';
import type { Status } from '@/infrastructure/list-query';
import type { ItemDraft, ListItem } from '@/domain/list';
import { EmptyList } from '@/features/list/components/EmptyList';
import { ListSkeleton } from '@/features/list/components/ListSkeleton';
import { SortableList } from '@/features/list/components/SortableList';

type Phase = 'loading' | 'failed' | 'empty' | 'cards' | 'idle';

function phaseOf(status: Status, itemCount: number, adding: boolean): Phase {
  if (status === 'loading') return 'loading';
  if (itemCount > 0) return 'cards';
  if (status === 'error') return 'failed';
  return adding ? 'idle' : 'empty';
}

interface Props {
  status: Status;
  items: ListItem[];

  adding: boolean;
  editingId: string | null;
  isBusy: boolean;
  isRemoving: (itemId: string) => boolean;
  isMoving: (itemId: string) => boolean;
  dimmed: string;
  onRetry: () => void;
  onAdd: () => void;
  onMove: (id: string, position: number) => void;
  onStartEdit: (id: string) => void;
  onStopEdit: () => void;
  onEdit: (id: string, draft: ItemDraft) => Promise<void>;
  onRemove: (id: string) => void;
}

export function ListBody({
  status,
  items,
  adding,
  editingId,
  isBusy,
  isRemoving,
  isMoving,
  dimmed,
  onRetry,
  onAdd,
  onMove,
  onStartEdit,
  onStopEdit,
  onEdit,
  onRemove,
}: Props) {
  switch (phaseOf(status, items.length, adding)) {
    case 'loading':
      return <ListSkeleton />;

    case 'failed':
      return (
        <div className="rule border-line bg-sheet px-6 py-8">
          <h2 className="font-display text-headline leading-none">
            A lista não carregou
          </h2>
          <p className="mt-3 max-w-reading font-body text-body leading-relaxed">
            Nada foi perdido: a lista continua como estava no servidor. Quando a
            conexão voltar, é só tentar de novo.
          </p>
          <div className="mt-4">
            <Button variant="primary" size="md" onClick={onRetry}>
              Tentar de novo
            </Button>
          </div>
        </div>
      );

    case 'empty':
      return <EmptyList onAdd={onAdd} />;

    case 'idle':
      return null;

    case 'cards':
      return (
        <SortableList
          items={items}
          editingId={editingId}
          isBusy={isBusy}
          isRemoving={isRemoving}
          isMoving={isMoving}
          dimmed={dimmed}
          onMove={onMove}
          onStartEdit={onStartEdit}
          onStopEdit={onStopEdit}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      );
  }
}
