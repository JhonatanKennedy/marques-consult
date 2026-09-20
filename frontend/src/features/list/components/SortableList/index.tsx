import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { ItemDraft, ListItem } from '@/domain/list';
import { droppedPosition, steppedPosition } from '@/domain/reorder-target';
import { ItemCard } from '@/features/list/components/ItemCard';
import { SortableItem } from '@/features/list/components/SortableItem';

interface Props {
  items: ListItem[];

  editingId: string | null;

  isBusy: boolean;
  isRemoving: (itemId: string) => boolean;
  isMoving: (itemId: string) => boolean;
  dimmed: string;
  onMove: (id: string, position: number) => void;
  onStartEdit: (id: string) => void;
  onStopEdit: () => void;
  onEdit: (id: string, draft: ItemDraft) => Promise<void>;
  onRemove: (id: string) => void;
}

export function SortableList({
  items,
  editingId,
  isBusy,
  isRemoving,
  isMoving,
  dimmed,
  onMove,
  onStartEdit,
  onStopEdit,
  onEdit,
  onRemove,
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),

    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (!over) return;
    const from = items.findIndex((item) => item.id === active.id);
    const to = items.findIndex((item) => item.id === over.id);
    if (from === -1 || to === -1) return;
    const position = droppedPosition(from, to);
    if (position !== null) onMove(String(active.id), position);
  };

  const cardFor = (item: ListItem, index: number) => ({
    item,
    position: index + 1,
    editing: editingId === item.id,
    pending: isRemoving(item.id) || isMoving(item.id),
    moveUp: steppedPosition(items, item.id, -1),
    moveDown: steppedPosition(items, item.id, 1),
    onMove: (position: number) => onMove(item.id, position),
    onStartEdit: () => onStartEdit(item.id),
    onStopEdit,
    onEdit: (draft: ItemDraft) => onEdit(item.id, draft),
    onRemove: () => onRemove(item.id),
  });

  const activeIndex = items.findIndex((item) => item.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => setActiveId(String(active.id))}
      onDragCancel={() => setActiveId(null)}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className={`grid gap-3 ${dimmed}`}>
          {items.map((item, index) => (
            <SortableItem
              key={item.id}
              disabled={isBusy}
              {...cardFor(item, index)}
            />
          ))}
        </ul>
      </SortableContext>

      <DragOverlay>
        {activeIndex === -1 ? null : (
          <ItemCard
            {...cardFor(items[activeIndex], activeIndex)}
            handleProps={null}
            dragging={false}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
