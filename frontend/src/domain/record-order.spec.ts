import { describe, expect, it } from 'vitest';
import type { ListVersion } from './list';
import { appendVersion, truncateHistory } from './record-order';

const version = (number: number): ListVersion => ({
  listId: 1,
  number,
  items: [],
});

const numbers = (history: ListVersion[]): number[] =>
  history.map((entry) => entry.number);

const occurrences = (history: ListVersion[], number: number): number =>
  history.filter((entry) => entry.number === number).length;

const RECORD = [version(5), version(4), version(3), version(2), version(1)];

describe('appendVersion', () => {
  describe('a mutation appends one above the current version', () => {
    it('prepends it and leaves the rest in place', () => {
      const history = [version(3), version(2), version(1)];

      expect(numbers(appendVersion(history, version(4)))).toEqual([4, 3, 2, 1]);
    });

    it('starts a record that was empty', () => {
      expect(numbers(appendVersion([], version(1)))).toEqual([1]);
    });
  });

  describe('a number already in the record', () => {
    it('replaces the existing entry rather than repeating it', () => {
      const history = [version(3), version(2), version(1)];

      const next = appendVersion(history, version(2));

      expect(numbers(next)).toEqual([2, 3, 1]);
      expect(occurrences(next, 2)).toBe(1);
    });
  });
});

describe('truncateHistory', () => {
  describe('a rollback destroys every version above its target', () => {
    it('keeps the target and drops each strictly greater number', () => {
      const next = truncateHistory(RECORD, version(3));

      expect(numbers(next)).toEqual([3, 2, 1]);
    });

    it('drops the version immediately above the target too', () => {
      const next = truncateHistory(RECORD, version(4));

      expect(numbers(next)).toEqual([4, 3, 2, 1]);
      expect(numbers(next)).not.toContain(5);
    });

    it('keeps every version below the target', () => {
      const next = truncateHistory(RECORD, version(3));

      expect(numbers(next)).toEqual(expect.arrayContaining([2, 1]));
    });
  });

  describe('the target is already in the record when the reply arrives', () => {
    it('ends up holding the target once, from the reply', () => {
      const next = truncateHistory(RECORD, version(4));

      expect(occurrences(next, 4)).toBe(1);
      expect(numbers(next)[0]).toBe(4);
    });
  });

  describe('rolling back to the newest version destroys nothing', () => {
    it('leaves the record exactly as it was', () => {
      const next = truncateHistory(RECORD, version(5));

      expect(numbers(next)).toEqual([5, 4, 3, 2, 1]);
    });
  });
});
