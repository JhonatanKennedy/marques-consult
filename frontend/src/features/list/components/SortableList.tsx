import { DndContext, DragOverlay } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { ItemDraft, ListItem } from '@/domain/list';
import { steppedPosition } from '@/domain/reorderTarget';
import { DragPreview } from '@/features/list/components/DragPreview';
import { type ItemCardState } from '@/features/list/components/ItemCard/ItemCard';
import { SortableItem } from '@/features/list/components/SortableItem';
import { useDragReorder } from '@/features/list/hooks/useDragReorder';

function cardStateOf(editing: boolean, isPending: boolean): ItemCardState {
  if (editing) return { kind: 'editing' };
  return { kind: 'row', isPending, isDragging: false };
}

type SortableListProps = {
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
};

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
}: SortableListProps) {
  const { sensors, activeId, startDrag, stopDrag, handleDragEnd } =
    useDragReorder(items, onMove);

  const cardFor = (item: ListItem, index: number) => ({
    item,
    position: index + 1,
    state: cardStateOf(
      editingId === item.id,
      isRemoving(item.id) || isMoving(item.id),
    ),
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
      onDragStart={({ active }) => startDrag(String(active.id))}
      onDragCancel={stopDrag}
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
        <DragPreview
          card={
            activeIndex === -1 ? null : cardFor(items[activeIndex], activeIndex)
          }
        />
      </DragOverlay>
    </DndContext>
  );
}
