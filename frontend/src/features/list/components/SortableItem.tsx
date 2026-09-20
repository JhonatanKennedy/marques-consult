import { useSortable } from '@dnd-kit/sortable';
import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from '@dnd-kit/core';
import {
  ItemCard,
  type ItemCardProps,
  type ItemCardState,
} from '@/features/list/components/ItemCard/ItemCard';

export interface HandleProps {
  nodeRef: (node: HTMLElement | null) => void;
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
}

interface SortableItemProps extends Omit<ItemCardProps, 'handleProps'> {
  disabled: boolean;
}

export function SortableItem({
  item,
  state,
  disabled,
  ...card
}: SortableItemProps) {
  const isEditing = state.kind === 'editing';

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled: disabled || isEditing });

  const cardState: ItemCardState = isEditing
    ? state
    : { kind: 'row', isPending: state.isPending, isDragging };

  return (
    <li
      ref={setNodeRef}
      className={isDragging ? 'opacity-0' : ''}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        transition,
      }}
    >
      <ItemCard
        item={item}
        state={cardState}
        handleProps={{ nodeRef: setActivatorNodeRef, attributes, listeners }}
        {...card}
      />
    </li>
  );
}
