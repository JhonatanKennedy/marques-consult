import {
  byOrder,
  type Change,
  type ChangedField,
  type ListVersion,
} from './list';

function indicesKeepingTheirOrder(sequence: number[]): Set<number> {
  const tails: number[] = [];
  const predecessorIndex = new Array<number>(sequence.length).fill(-1);

  for (let i = 0; i < sequence.length; i += 1) {
    let low = 0;
    let high = tails.length;
    while (low < high) {
      const mid = (low + high) >> 1;
      if (sequence[tails[mid]] < sequence[i]) low = mid + 1;
      else high = mid;
    }
    if (low > 0) predecessorIndex[i] = tails[low - 1];
    tails[low] = i;
  }

  const kept = new Set<number>();
  let cursor = tails.length ? tails[tails.length - 1] : -1;
  while (cursor >= 0) {
    kept.add(cursor);
    cursor = predecessorIndex[cursor];
  }
  return kept;
}

function rowNumber(order: number): number {
  return order + 1;
}

export function deriveChanges(
  previous: ListVersion | null,
  current: ListVersion,
): Change[] {
  const changes: Change[] = [];

  if (!previous) {
    if (current.number === 1) changes.push({ kind: 'created' });
    return changes;
  }

  const previousItems = byOrder(previous.items);
  const currentItems = byOrder(current.items);
  const previousById = new Map(previousItems.map((item) => [item.id, item]));
  const currentById = new Map(currentItems.map((item) => [item.id, item]));

  for (const item of currentItems) {
    if (!previousById.has(item.id)) changes.push({ kind: 'added', item });
  }
  for (const item of previousItems) {
    if (!currentById.has(item.id)) changes.push({ kind: 'removed', item });
  }

  const positionInPrevious = new Map<string, number>();
  for (const item of previousItems) {
    if (currentById.has(item.id)) {
      positionInPrevious.set(item.id, positionInPrevious.size);
    }
  }

  const shared = currentItems.flatMap((after) => {
    const before = previousById.get(after.id);
    const position = positionInPrevious.get(after.id);
    if (before === undefined || position === undefined) return [];
    return [{ before, after, position }];
  });

  for (const { before, after } of shared) {
    const fields: ChangedField[] = [];
    if (before.name !== after.name) fields.push('name');
    if ((before.description ?? '') !== (after.description ?? '')) {
      fields.push('description');
    }
    if (fields.length) changes.push({ kind: 'edited', before, after, fields });
  }

  const keptTheirOrder = indicesKeepingTheirOrder(
    shared.map(({ position }) => position),
  );

  shared.forEach(({ before, after }, index) => {
    if (keptTheirOrder.has(index)) {
      if (before.order !== after.order) {
        changes.push({
          kind: 'shifted',
          item: after,
          from: rowNumber(before.order),
          to: rowNumber(after.order),
        });
      }
      return;
    }
    changes.push({
      kind: 'moved',
      item: after,
      from: rowNumber(before.order),
      to: rowNumber(after.order),
    });
  });

  return changes;
}

export function primaryChanges(changes: Change[]): Change[] {
  return changes.filter((change) => change.kind !== 'shifted');
}

export function shifts(
  changes: Change[],
): Extract<Change, { kind: 'shifted' }>[] {
  return changes.filter(
    (change): change is Extract<Change, { kind: 'shifted' }> =>
      change.kind === 'shifted',
  );
}
