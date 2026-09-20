import type { ListAction } from '@/domain/list-action';

export function inFlight(
  isPending: boolean,
  variables: ListAction | undefined,
): ListAction | null {
  return isPending ? (variables ?? null) : null;
}

export function isRemoving(action: ListAction | null, itemId: string): boolean {
  return action?.kind === 'remove' && action.id === itemId;
}

export function isRestoring(
  action: ListAction | null,
  versionNumber: number,
): boolean {
  return action?.kind === 'restore' && action.number === versionNumber;
}

export function isMoving(action: ListAction | null, itemId: string): boolean {
  return action?.kind === 'move' && action.id === itemId;
}

export function dimsSurface(action: ListAction | null): boolean {
  return action !== null && action.kind !== 'move';
}
