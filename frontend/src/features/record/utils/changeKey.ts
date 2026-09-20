import type { Change } from '@/domain/list';

export function changeKey(change: Change): string {
  if (change.kind === 'created') return 'created';
  if (change.kind === 'edited') return `edited:${change.after.id}`;
  return `${change.kind}:${change.item.id}`;
}
