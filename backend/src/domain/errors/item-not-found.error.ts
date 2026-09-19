/**
 * Raised when an operation names an item the current version does not hold.
 *
 * The identifier is carried as a field rather than only interpolated into the
 * message, so the presentation layer can name the missing item without parsing
 * prose back out of a string.
 */
export class ItemNotFoundError extends Error {
  readonly itemId: string;

  constructor(itemId: string) {
    super(`Item ${itemId} is not in the current version of the list`);
    this.name = 'ItemNotFoundError';
    this.itemId = itemId;
  }
}
