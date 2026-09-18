import { randomUUID } from 'crypto';
import { ListItem } from './list-item.entity.js';
// import { ItemNotFoundError } from '../errors/item-not-found.error';

export class Version {
  constructor(
    readonly listId: number,
    readonly number: number,
    readonly items: ListItem[],
    readonly id?: number,
    readonly restoredFromNumber?: number,
  ) {}

  private nextVersion(items: ListItem[], restoredFromNumber?: number): Version {
    return new Version(
      this.listId,
      this.number + 1,
      items,
      undefined,
      restoredFromNumber,
    );
  }

  addItem(name: string, description?: string): Version {
    const newItem = new ListItem({
      id: randomUUID(),
      name,
      description,
      order: this.items.length,
    });
    return this.nextVersion([...this.items, newItem]);
  }

  removeItem(itemId: string): Version {
    this.ensureItemExists(itemId);
    const remaining = this.items
      .filter((i) => i.id !== itemId)
      .map((item, index) => item.withOrder(index));
    return this.nextVersion(remaining);
  }

  editItem(itemId: string, name: string, description?: string): Version {
    this.ensureItemExists(itemId);
    const updated = this.items.map((item) =>
      item.id === itemId ? item.withUpdatedData(name, description) : item,
    );
    return this.nextVersion(updated);
  }

  reorderItem(itemId: string, newOrder: number): Version {
    this.ensureItemExists(itemId);
    const sorted = [...this.items].sort((a, b) => a.order - b.order);
    const currentIndex = sorted.findIndex((i) => i.id === itemId);

    const [moved] = sorted.splice(currentIndex, 1);
    sorted.splice(newOrder, 0, moved);

    const reindexed = sorted.map((item, index) => item.withOrder(index));
    return this.nextVersion(reindexed);
  }

  restoredAs(nextNumber: number): Version {
    return new Version(
      this.listId,
      nextNumber,
      this.items,
      undefined,
      this.number,
    );
  }

  private ensureItemExists(itemId: string): void {
    // if (!this.items.some((i) => i.id === itemId)) {
    //   throw new ItemNotFoundError(itemId);
    // }
  }
}
