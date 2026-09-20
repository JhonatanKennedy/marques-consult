import { describe, expect, it } from 'vitest';
import {
  dimsSurface,
  inFlight,
  isMoving,
  isRemoving,
  isRestoring,
} from './in-flight';
import type { ListAction } from '@/domain/list-action';

const draft = { name: 'x' };

const remove = (id: string): ListAction => ({ kind: 'remove', id });
const restore = (number: number): ListAction => ({ kind: 'restore', number });

describe('inFlight', () => {
  it('reports the action only while it is pending', () => {
    expect(inFlight(true, remove('abc'))).toEqual(remove('abc'));

    expect(inFlight(false, remove('abc'))).toBeNull();
  });

  it('reports nothing before the first call, when there are no variables', () => {
    expect(inFlight(true, undefined)).toBeNull();
    expect(inFlight(false, undefined)).toBeNull();
  });
});

describe('isRemoving', () => {
  it('matches the removal of that item and no other', () => {
    expect(isRemoving(remove('a'), 'a')).toBe(true);
    expect(isRemoving(remove('a'), 'b')).toBe(false);
  });

  it('matches nothing when the action is another kind', () => {
    expect(isRemoving({ kind: 'add', draft }, 'a')).toBe(false);
    expect(isRemoving({ kind: 'edit', id: 'a', draft }, 'a')).toBe(false);
    expect(isRemoving({ kind: 'move', id: 'a', position: 1 }, 'a')).toBe(false);
    expect(isRemoving(restore(7), 'a')).toBe(false);
  });

  it('matches nothing when nothing is running', () => {
    expect(isRemoving(null, 'a')).toBe(false);
  });
});

describe('isRestoring', () => {
  it('matches the restore of that version and no other', () => {
    expect(isRestoring(restore(7), 7)).toBe(true);
    expect(isRestoring(restore(7), 8)).toBe(false);
  });

  it('matches nothing when the action is another kind', () => {
    expect(isRestoring({ kind: 'add', draft }, 7)).toBe(false);
    expect(isRestoring(remove('a'), 7)).toBe(false);
  });

  it('matches nothing when nothing is running', () => {
    expect(isRestoring(null, 7)).toBe(false);
  });
});

describe('isMoving', () => {
  const move = (id: string, position: number): ListAction => ({
    kind: 'move',
    id,
    position,
  });

  it('matches the move of that item and no other', () => {
    expect(isMoving(move('a', 0), 'a')).toBe(true);
    expect(isMoving(move('a', 0), 'b')).toBe(false);
  });

  it('matches nothing when the action is another kind', () => {
    expect(isMoving(remove('a'), 'a')).toBe(false);
    expect(isMoving(restore(7), 'a')).toBe(false);
    expect(isMoving({ kind: 'add', draft }, 'a')).toBe(false);
  });

  it('matches nothing when nothing is running', () => {
    expect(isMoving(null, 'a')).toBe(false);
  });
});

describe('dimsSurface', () => {
  it('dims for every action but the move', () => {
    expect(dimsSurface({ kind: 'add', draft })).toBe(true);
    expect(dimsSurface({ kind: 'edit', id: 'a', draft })).toBe(true);
    expect(dimsSurface(remove('a'))).toBe(true);
    expect(dimsSurface(restore(7))).toBe(true);
  });

  it('does not dim for a move, which reports itself on its own card', () => {
    expect(dimsSurface({ kind: 'move', id: 'a', position: 1 })).toBe(false);
  });

  it('does not dim when nothing is running', () => {
    expect(dimsSurface(null)).toBe(false);
  });
});
