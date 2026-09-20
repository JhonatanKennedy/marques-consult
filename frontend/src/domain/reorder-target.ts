import { byOrder, type ListItem } from './list';

export function reorderItems(
  items: ListItem[],
  id: string,
  position: number,
): ListItem[] {
  const ordered = byOrder(items);
  const index = ordered.findIndex((item) => item.id === id);
  if (index === -1) return items;

  const [moved] = ordered.splice(index, 1);
  ordered.splice(position, 0, moved);

  return ordered.map((item, order) => ({ ...item, order }));
}

export function steppedPosition(
  items: ListItem[],
  id: string,
  direction: -1 | 1,
): number | null {
  const ordered = byOrder(items);
  const index = ordered.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const target = index + direction;
  return target < 0 || target >= ordered.length ? null : target;
}

export function droppedPosition(from: number, to: number): number | null {
  return from === to ? null : to;
}
