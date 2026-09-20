import { describe, expect, it } from 'vitest';
import type { ListItem, ListRecord, ListVersion } from './list';
import { foldFor, foldRollback, foldVersion } from './list-query';
import { appendVersion } from './record-order';

const item = (id: string, order: number): ListItem => ({
  id,
  name: id.toUpperCase(),
  order,
});

const version = (number: number, ids: string[]): ListVersion => ({
  listId: 1,
  number,
  items: ids.map(item),
});

const record = (current: ListVersion, history: ListVersion[]): ListRecord => ({
  current,
  history,
});

describe('foldVersion', () => {
  it('makes the arriving version current and puts it at the head of the record', () => {
    const before = record(version(3, ['a', 'b']), [
      version(3, ['a', 'b']),
      version(2, ['a']),
    ]);

    const after = foldVersion(before, version(4, ['a', 'b', 'c']));

    expect(after.current.number).toBe(4);
    expect(after.history.map((entry) => entry.number)).toEqual([4, 3, 2]);
  });

  it('delegates to appendVersion rather than restating it', () => {
    const before = record(version(3, ['a']), [
      version(3, ['a']),
      version(2, []),
      version(1, []),
    ]);
    const arriving = version(4, ['a', 'b']);

    expect(foldVersion(before, arriving).history).toEqual(
      appendVersion(before.history, arriving),
    );
  });

  it('treats a version with no record behind it as the whole record', () => {
    const after = foldVersion(undefined, version(1, ['a']));

    expect(after.current.number).toBe(1);
    expect(after.history.map((entry) => entry.number)).toEqual([1]);
  });
});

describe('foldRollback', () => {
  it('drops every version above the target, because the rollback destroyed them', () => {
    const before = record(version(4, ['a', 'b', 'c']), [
      version(4, ['a', 'b', 'c']),
      version(3, ['a', 'b']),
      version(2, ['a']),
      version(1, []),
    ]);

    const after = foldRollback(before, version(2, ['a']));

    expect(after.current.number).toBe(2);
    expect(after.history.map((entry) => entry.number)).toEqual([2, 1]);
  });

  it('is not the rule foldVersion uses — the two disagree on the same input', () => {
    const before = record(version(4, ['a', 'b']), [
      version(4, ['a', 'b']),
      version(3, ['a']),
    ]);
    const target = version(1, []);

    expect(
      foldVersion(before, target).history.map((entry) => entry.number),
    ).toEqual([1, 4, 3]);
    expect(
      foldRollback(before, target).history.map((entry) => entry.number),
    ).toEqual([1]);
  });
});

describe('foldFor', () => {
  it('truncates for a restore and appends for everything else', () => {
    const before = record(version(3, ['a', 'b']), [
      version(3, ['a', 'b']),
      version(2, ['a']),
      version(1, []),
    ]);
    const arriving = version(2, ['a']);

    const kinds = [
      { kind: 'add', draft: { name: 'x' } },
      { kind: 'edit', id: 'a', draft: { name: 'x' } },
      { kind: 'remove', id: 'a' },
      { kind: 'move', id: 'a', position: 1 },
      { kind: 'restore', number: 2 },
    ] as const;

    const folded = kinds.map((action) => ({
      kind: action.kind,
      numbers: foldFor(action)(before, arriving).history.map(
        (entry) => entry.number,
      ),
    }));

    expect(folded).toEqual([
      { kind: 'add', numbers: [2, 3, 1] },
      { kind: 'edit', numbers: [2, 3, 1] },
      { kind: 'remove', numbers: [2, 3, 1] },
      { kind: 'move', numbers: [2, 3, 1] },
      { kind: 'restore', numbers: [2, 1] },
    ]);
  });

  it('is the only truncating case, asserted by counting rather than by eye', () => {
    const before = record(version(3, ['a']), [
      version(3, ['a']),
      version(2, []),
      version(1, []),
    ]);
    const arriving = version(1, []);

    const truncating = (
      [
        { kind: 'add', draft: { name: 'x' } },
        { kind: 'edit', id: 'a', draft: { name: 'x' } },
        { kind: 'remove', id: 'a' },
        { kind: 'move', id: 'a', position: 2 },
        { kind: 'restore', number: 1 },
      ] as const
    ).filter(
      (action) => foldFor(action)(before, arriving).history.length === 1,
    );

    expect(truncating.map((action) => action.kind)).toEqual(['restore']);
  });
});
