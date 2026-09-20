import { useState } from 'react';
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import type { ListItem } from '@/domain/list';
import { droppedPosition } from '@/domain/reorderTarget';

export function useDragReorder(
  items: ListItem[],
  onReorder: (itemId: string, position: number) => void,
) {
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
    if (position !== null) onReorder(String(active.id), position);
  };

  return {
    sensors,
    activeId,
    startDrag: (itemId: string) => setActiveId(itemId),
    stopDrag: () => setActiveId(null),
    handleDragEnd,
  };
}
