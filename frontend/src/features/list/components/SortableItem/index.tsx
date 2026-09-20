import { useSortable } from '@dnd-kit/sortable';
import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from '@dnd-kit/core';
import {
  ItemCard,
  type ItemCardProps,
} from '@/features/list/components/ItemCard';

export interface HandleProps {
  nodeRef: (node: HTMLElement | null) => void;
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
}

interface Props extends Omit<ItemCardProps, 'handleProps' | 'dragging'> {
  disabled: boolean;
}

export function SortableItem({ item, editing, disabled, ...card }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled: disabled || editing });

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
        editing={editing}
        dragging={isDragging}
        handleProps={{ nodeRef: setActivatorNodeRef, attributes, listeners }}
        {...card}
      />
    </li>
  );
}
