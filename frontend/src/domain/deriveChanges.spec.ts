import { describe, expect, it } from 'vitest';
import { deriveChanges, primaryChanges, shifts } from './deriveChanges';
import type { Change, ListItem, ListVersion } from './list';

const item = (
  id: string,
  order: number,
  name = id.toUpperCase(),
): ListItem => ({
  id,
  name,
  order,
});

const version = (number: number, items: ListItem[]): ListVersion => ({
  listId: 1,
  number,
  items,
});

const addedIds = (changes: Change[]): string[] =>
  changes
    .filter((change) => change.kind === 'added')
    .map((added) => added.item.id);

const removedIds = (changes: Change[]): string[] =>
  changes
    .filter((change) => change.kind === 'removed')
    .map((removed) => removed.item.id);

const editedIds = (changes: Change[]): string[] =>
  changes
    .filter((change) => change.kind === 'edited')
    .map((edited) => edited.after.id);

const movedIds = (changes: Change[]): string[] =>
  changes
    .filter((change) => change.kind === 'moved')
    .map((moved) => moved.item.id);

const shiftedIds = (changes: Change[]): string[] =>
  shifts(changes).map((change) => change.item.id);

describe('deriveChanges', () => {
  describe('a single reposition reindexes its neighbours', () => {
    it('reports the one item that moved and calls every other row a shift', () => {
      const before = version(2, [
        item('a', 0),
        item('b', 1),
        item('c', 2),
        item('d', 3),
      ]);

      const after = version(3, [
        item('d', 0),
        item('a', 1),
        item('b', 2),
        item('c', 3),
      ]);

      const changes = deriveChanges(before, after);

      expect(movedIds(changes)).toEqual(['d']);
      expect(shiftedIds(changes)).toEqual(['a', 'b', 'c']);
    });

    it('describes the move in one-based row numbers, as the reader counts rows', () => {
      const before = version(2, [item('a', 0), item('b', 1), item('c', 2)]);
      const after = version(3, [item('c', 0), item('a', 1), item('b', 2)]);

      const [move] = deriveChanges(before, after).filter(
        (change) => change.kind === 'moved',
      );

      expect(move).toMatchObject({ item: { id: 'c' }, from: 3, to: 1 });
    });

    it('separates the consequence from the act, so a collapsed row shows only the move', () => {
      const before = version(2, [item('a', 0), item('b', 1), item('c', 2)]);
      const after = version(3, [item('c', 0), item('a', 1), item('b', 2)]);

      const changes = deriveChanges(before, after);

      expect(primaryChanges(changes).map((change) => change.kind)).toEqual([
        'moved',
      ]);
      expect(shiftedIds(changes)).toEqual(['a', 'b']);
    });
  });

  describe('order is judged only on the items both versions hold', () => {
    it('never reports an addition as a move, only as an insertion and its shifts', () => {
      const before = version(2, [item('a', 0), item('b', 1)]);

      const after = version(3, [item('a', 0), item('c', 1), item('b', 2)]);

      const changes = deriveChanges(before, after);

      expect(addedIds(changes)).toEqual(['c']);
      expect(movedIds(changes)).toEqual([]);
      expect(shiftedIds(changes)).toEqual(['b']);
    });

    it('never reports a removal as a move', () => {
      const before = version(2, [item('a', 0), item('b', 1), item('c', 2)]);

      const after = version(3, [item('a', 0), item('c', 1)]);

      const changes = deriveChanges(before, after);

      expect(removedIds(changes)).toEqual(['b']);
      expect(movedIds(changes)).toEqual([]);
      expect(shiftedIds(changes)).toEqual(['c']);
    });
  });

  describe('the items that keep their order are the most that can', () => {
    it('keeps the longest run still in order, not merely the longest prefix', () => {
      const before = version(2, [
        item('a', 0),
        item('b', 1),
        item('c', 2),
        item('d', 3),
        item('e', 4),
      ]);

      const after = version(3, [
        item('a', 0),
        item('b', 1),
        item('e', 2),
        item('c', 3),
        item('d', 4),
      ]);

      const changes = deriveChanges(before, after);

      expect(movedIds(changes)).toEqual(['e']);
      expect(shiftedIds(changes)).toEqual(['c', 'd']);
    });
  });

  describe('an edit is read off the item, not off its position', () => {
    it('reports the edit even when the edited item also changed rows', () => {
      const before = version(2, [
        item('a', 0, 'Alpha'),
        item('b', 1, 'Beta'),
        item('c', 2, 'Gamma'),
      ]);

      const after = version(3, [
        item('b', 0, 'Beta'),
        item('a', 1, 'Alpha renomeado'),
        item('c', 2, 'Gamma'),
      ]);

      const changes = deriveChanges(before, after);

      expect(editedIds(changes)).toEqual(['a']);
      expect(movedIds(changes)).toEqual(['b']);

      expect(shiftedIds(changes)).toEqual(['a']);
    });

    it('names the fields that changed and stays silent when none did', () => {
      const before = version(2, [item('a', 0, 'Alpha'), item('b', 1, 'Beta')]);
      const after = version(3, [item('a', 0, 'Alpha'), item('b', 1, 'Beta')]);

      expect(deriveChanges(before, after)).toEqual([]);
    });
  });

  describe('the first version is a beginning only when nothing precedes it', () => {
    it('calls version 1 the creation', () => {
      expect(deriveChanges(null, version(1, []))).toEqual([
        { kind: 'created' },
      ]);
    });

    it('does not call a later version a creation just because nothing precedes it here', () => {
      expect(deriveChanges(null, version(2, [item('a', 0)]))).toEqual([]);
    });
  });
});
