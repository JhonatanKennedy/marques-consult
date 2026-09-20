import { useState } from 'react';
import type { ItemDraft, ListItem } from '@/domain/list';
import type { HandleProps } from '@/features/list/components/SortableItem';
import { ItemEditCard } from './ItemEditCard';
import { ItemRow } from './ItemRow';
import { RemoveConfirm } from './RemoveConfirm';

export type ItemCardState =
  | { kind: 'editing' }
  | { kind: 'row'; isPending: boolean; isDragging: boolean };

export interface ItemCardProps {
  item: ListItem;
  position: number;
  state: ItemCardState;
  moveUp: number | null;
  moveDown: number | null;
  handleProps: HandleProps | null;
  onMove: (position: number) => void;
  onStartEdit: () => void;
  onStopEdit: () => void;
  onEdit: (draft: ItemDraft) => Promise<void>;
  onRemove: () => void;
}

export function ItemCard({
  item,
  position,
  state,
  moveUp,
  moveDown,
  handleProps,
  onMove,
  onStartEdit,
  onStopEdit,
  onEdit,
  onRemove,
}: ItemCardProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  if (state.kind === 'editing') {
    return (
      <ItemEditCard
        item={item}
        onSubmit={async (draft) => {
          await onEdit(draft);
          onStopEdit();
        }}
        onCancel={onStopEdit}
      />
    );
  }

  if (isConfirming) {
    return (
      <RemoveConfirm
        name={item.name}
        onConfirm={() => {
          setIsConfirming(false);
          onRemove();
        }}
        onCancel={() => setIsConfirming(false)}
      />
    );
  }

  return (
    <ItemRow
      item={item}
      position={position}
      isPending={state.isPending}
      isDragging={state.isDragging}
      moveUp={moveUp}
      moveDown={moveDown}
      handleProps={handleProps}
      onMove={onMove}
      onStartEdit={onStartEdit}
      onRequestRemove={() => setIsConfirming(true)}
    />
  );
}
