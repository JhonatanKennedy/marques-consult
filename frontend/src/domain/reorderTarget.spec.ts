import { describe, expect, it } from 'vitest';
import type { ListItem } from './list';
import {
  droppedPosition,
  reorderItems,
  steppedPosition,
} from './reorderTarget';

const item = (id: string, order: number): ListItem => ({
  id,
  name: id.toUpperCase(),
  order,
});

const LIST: ListItem[] = [
  item('a', 0),
  item('b', 1),
  item('c', 2),
  item('d', 3),
  item('e', 4),
];

const positions = (items: ListItem[]): string[] =>
  items.map((entry) => `${entry.id}${entry.order}`);

describe('reorderItems', () => {
  describe('a move rewrites the order of every displaced entry', () => {
    it('moves an entry down to the last position, reindexing the three it passed', () => {
      expect(positions(reorderItems(LIST, 'b', 4))).toEqual([
        'a0',
        'c1',
        'd2',
        'e3',
        'b4',
      ]);
    });

    it('moves an entry up to the second position, reindexing the three it passed', () => {
      expect(positions(reorderItems(LIST, 'e', 1))).toEqual([
        'a0',
        'e1',
        'b2',
        'c3',
        'd4',
      ]);
    });

    it('reorders a move of one step in either direction', () => {
      expect(positions(reorderItems(LIST, 'c', 3))).toEqual([
        'a0',
        'b1',
        'd2',
        'c3',
        'e4',
      ]);
      expect(positions(reorderItems(LIST, 'c', 1))).toEqual([
        'a0',
        'c1',
        'b2',
        'd3',
        'e4',
      ]);
    });

    it('leaves the result sorted by order', () => {
      for (const moved of [
        reorderItems(LIST, 'b', 4),
        reorderItems(LIST, 'e', 1),
        reorderItems(LIST, 'a', 2),
      ]) {
        const orders = moved.map((entry) => entry.order);

        expect(orders).toEqual([...orders].sort((left, right) => left - right));
        expect(orders).toEqual([0, 1, 2, 3, 4]);
      }
    });

    it('reads the same target index the same way in both directions', () => {
      expect(
        reorderItems(LIST, 'b', 2).find((entry) => entry.id === 'b')?.order,
      ).toBe(2);
      expect(
        reorderItems(LIST, 'd', 2).find((entry) => entry.id === 'd')?.order,
      ).toBe(2);
    });

    it('keeps the entry its own, changing nothing but their orders', () => {
      const moved = reorderItems(LIST, 'b', 4);

      expect(moved.map((entry) => entry.id)).toEqual(['a', 'c', 'd', 'e', 'b']);
      expect(moved.find((entry) => entry.id === 'b')?.name).toBe('B');
    });
  });

  describe('a list holding one entry', () => {
    it('stays where it is, whatever target it is given', () => {
      expect(positions(reorderItems([item('a', 0)], 'a', 0))).toEqual(['a0']);
    });
  });

  describe('an id the list does not hold', () => {
    it('returns the list unchanged rather than throwing', () => {
      expect(reorderItems(LIST, 'zz', 2)).toBe(LIST);
    });
  });

  describe('the list is read in the order it renders', () => {
    it('gives the same result for a shuffled copy of the same list', () => {
      const shuffled = [LIST[2], LIST[0], LIST[4], LIST[1], LIST[3]];

      expect(positions(reorderItems(shuffled, 'b', 4))).toEqual(
        positions(reorderItems(LIST, 'b', 4)),
      );
    });
  });
});

describe('steppedPosition', () => {
  describe('a move that is possible', () => {
    it('returns the neighbour position going up', () => {
      expect(steppedPosition(LIST, 'c', -1)).toBe(1);
    });

    it('returns the neighbour position going down', () => {
      expect(steppedPosition(LIST, 'c', 1)).toBe(3);
    });
  });

  describe('a move the entry makes impossible', () => {
    it('returns null for the topmost entry going up', () => {
      expect(steppedPosition(LIST, 'a', -1)).toBeNull();
    });

    it('returns null for the bottommost entry going down', () => {
      expect(steppedPosition(LIST, 'e', 1)).toBeNull();
    });

    it('returns null in both directions for a list holding one entry', () => {
      const single = [item('a', 0)];

      expect(steppedPosition(single, 'a', -1)).toBeNull();
      expect(steppedPosition(single, 'a', 1)).toBeNull();
    });
  });

  describe('an id the list does not hold', () => {
    it('returns null rather than the position of a neighbour', () => {
      expect(steppedPosition(LIST, 'zz', -1)).toBeNull();
      expect(steppedPosition(LIST, 'zz', 1)).toBeNull();
    });
  });

  describe('the list is read in the order it renders', () => {
    it('gives the same answer for a shuffled copy of the same list', () => {
      const shuffled = [LIST[2], LIST[0], LIST[4], LIST[1], LIST[3]];

      expect(steppedPosition(shuffled, 'a', -1)).toBeNull();
      expect(steppedPosition(shuffled, 'a', 1)).toBe(1);
    });
  });
});

describe('droppedPosition', () => {
  it('returns null when the entry is dropped where it started', () => {
    expect(droppedPosition(2, 2)).toBeNull();
  });

  it('returns the target when the entry is dropped elsewhere', () => {
    expect(droppedPosition(0, 4)).toBe(4);
    expect(droppedPosition(4, 0)).toBe(0);
  });
});
