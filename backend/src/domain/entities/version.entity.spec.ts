import { describe, expect, it } from 'vitest';
import { ItemNotFoundError } from '../errors/item-not-found.error.js';
import { ListItem } from './list-item.entity.js';
import { Version } from './version.entity.js';

const item = (id: string, order: number, name = id): ListItem =>
  new ListItem({ id, name, description: `${name} description`, order });

const versionOf = (...items: ListItem[]): Version => new Version(1, 1, items);

/** Ids in list order, which is what every assertion here is really about. */
const idsInOrder = (version: Version): string[] =>
  [...version.items].sort((a, b) => a.order - b.order).map((i) => i.id);

const ordersInOrder = (version: Version): number[] =>
  [...version.items].sort((a, b) => a.order - b.order).map((i) => i.order);

const three = () => versionOf(item('a', 0), item('b', 1), item('c', 2));

describe('Version.addItem', () => {
  it('appends the item at the end of the list', () => {
    const next = three().addItem('Novo', 'uma descrição');

    expect(idsInOrder(next)).toEqual(['a', 'b', 'c', next.items.at(-1)!.id]);
    expect(next.items.at(-1)!.name).toBe('Novo');
    expect(next.items.at(-1)!.description).toBe('uma descrição');
  });

  it('numbers the new version one above the one it grew from', () => {
    const current = new Version(1, 7, [item('a', 0)]);

    expect(current.addItem('Novo').number).toBe(8);
  });

  it('leaves the version it grew from untouched', () => {
    const current = three();
    const before = [...current.items];

    current.addItem('Novo');

    expect(current.items).toEqual(before);
    expect(current.number).toBe(1);
  });
});

describe('Version.editItem', () => {
  it('replaces the named item data and nothing else', () => {
    const next = three().editItem('b', 'Renomeado', 'nova descrição');

    expect(next.items.find((i) => i.id === 'b')).toMatchObject({
      id: 'b',
      name: 'Renomeado',
      description: 'nova descrição',
      order: 1,
    });
    expect(next.items.find((i) => i.id === 'a')).toMatchObject({ name: 'a' });
    expect(next.items.find((i) => i.id === 'c')).toMatchObject({ name: 'c' });
  });

  it('numbers the new version one above the one it grew from', () => {
    const current = new Version(1, 4, [item('a', 0)]);

    expect(current.editItem('a', 'Outro').number).toBe(5);
  });

  it('leaves the version it grew from untouched', () => {
    const current = three();
    const before = [...current.items];

    current.editItem('a', 'Renomeado');

    expect(current.items).toEqual(before);
  });
});

describe('Version.removeItem', () => {
  it('drops the named item', () => {
    const next = three().removeItem('b');

    expect(idsInOrder(next)).toEqual(['a', 'c']);
  });

  it('reindexes the survivors contiguously from zero', () => {
    const next = three().removeItem('b');

    expect(ordersInOrder(next)).toEqual([0, 1]);
  });

  it('reindexes when the first item goes', () => {
    const next = three().removeItem('a');

    expect(idsInOrder(next)).toEqual(['b', 'c']);
    expect(ordersInOrder(next)).toEqual([0, 1]);
  });

  it('reindexes when the last item goes', () => {
    const next = three().removeItem('c');

    expect(idsInOrder(next)).toEqual(['a', 'b']);
    expect(ordersInOrder(next)).toEqual([0, 1]);
  });

  it('leaves the version it grew from untouched', () => {
    const current = three();
    const before = [...current.items];

    current.removeItem('b');

    expect(current.items).toEqual(before);
  });
});

describe('Version.reorderItem', () => {
  it('moves an item up one position', () => {
    const next = three().reorderItem('b', 0);

    expect(idsInOrder(next)).toEqual(['b', 'a', 'c']);
    expect(ordersInOrder(next)).toEqual([0, 1, 2]);
  });

  it('moves an item down one position', () => {
    const next = three().reorderItem('b', 2);

    expect(idsInOrder(next)).toEqual(['a', 'c', 'b']);
    expect(ordersInOrder(next)).toEqual([0, 1, 2]);
  });

  it('moves an item to the first position', () => {
    const next = three().reorderItem('c', 0);

    expect(idsInOrder(next)).toEqual(['c', 'a', 'b']);
  });

  it('moves an item to the last position', () => {
    const next = three().reorderItem('a', 2);

    expect(idsInOrder(next)).toEqual(['b', 'c', 'a']);
  });

  it('always leaves the orders contiguous from zero', () => {
    for (const [id, to] of [
      ['a', 2],
      ['b', 0],
      ['c', 1],
    ] as const) {
      expect(ordersInOrder(three().reorderItem(id, to))).toEqual([0, 1, 2]);
    }
  });

  it('leaves the version it grew from untouched', () => {
    const current = three();
    const before = [...current.items];

    current.reorderItem('c', 0);

    expect(current.items).toEqual(before);
  });
});

describe('Version mutations naming an item that is not there', () => {
  const absent = 'nao-existe';

  it('refuses an edit', () => {
    expect(() => three().editItem(absent, 'Qualquer')).toThrow(
      ItemNotFoundError,
    );
  });

  it('refuses a removal', () => {
    expect(() => three().removeItem(absent)).toThrow(ItemNotFoundError);
  });

  it('refuses a reorder', () => {
    expect(() => three().reorderItem(absent, 0)).toThrow(ItemNotFoundError);
  });

  it('names the item it could not find', () => {
    try {
      three().removeItem(absent);
      expect.unreachable('removeItem should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ItemNotFoundError);
      expect((error as ItemNotFoundError).itemId).toBe(absent);
    }
  });

  it('leaves every position byte-identical after a refused reorder', () => {
    const current = three();
    const before = current.items.map((i) => ({ id: i.id, order: i.order }));

    expect(() => current.reorderItem(absent, 0)).toThrow(ItemNotFoundError);

    expect(current.items.map((i) => ({ id: i.id, order: i.order }))).toEqual(
      before,
    );
  });
});
