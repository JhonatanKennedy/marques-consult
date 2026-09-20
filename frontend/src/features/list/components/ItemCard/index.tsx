import { useState } from 'react';
import type { ItemDraft, ListItem } from '@/domain/list';
import type { HandleProps } from '@/features/list/components/SortableItem';
import { ItemEditCard } from './ItemEditCard';
import { ItemRow } from './ItemRow';
import { RemoveConfirm } from './RemoveConfirm';

export interface ItemCardProps {
  item: ListItem;
  position: number;
  editing: boolean;
  pending: boolean;
  moveUp: number | null;
  moveDown: number | null;
  handleProps: HandleProps | null;
  dragging: boolean;
  onMove: (position: number) => void;
  onStartEdit: () => void;
  onStopEdit: () => void;
  onEdit: (draft: ItemDraft) => Promise<void>;
  onRemove: () => void;
}

export function ItemCard({
  item,
  position,
  editing,
  pending,
  moveUp,
  moveDown,
  handleProps,
  dragging,
  onMove,
  onStartEdit,
  onStopEdit,
  onEdit,
  onRemove,
}: ItemCardProps) {
  const [confirming, setConfirming] = useState(false);

  if (editing) {
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

  if (confirming) {
    return (
      <RemoveConfirm
        name={item.name}
        onConfirm={() => {
          setConfirming(false);
          onRemove();
        }}
        onCancel={() => setConfirming(false)}
      />
    );
  }

  return (
    <ItemRow
      item={item}
      position={position}
      pending={pending}
      moveUp={moveUp}
      moveDown={moveDown}
      handleProps={handleProps}
      dragging={dragging}
      onMove={onMove}
      onStartEdit={onStartEdit}
      onRequestRemove={() => setConfirming(true)}
    />
  );
}
