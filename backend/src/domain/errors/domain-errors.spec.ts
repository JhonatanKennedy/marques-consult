import { describe, expect, it } from 'vitest';
import { ItemNotFoundError } from './item-not-found.error.js';
import { VersionNotFoundError } from './version-not-found.error.js';

describe('ItemNotFoundError', () => {
  it('carries the identifier it was given', () => {
    const error = new ItemNotFoundError('item-42');

    expect(error.itemId).toBe('item-42');
  });

  it('names itself so a filter can match on the class, not the message', () => {
    const error = new ItemNotFoundError('item-42');

    expect(error.name).toBe('ItemNotFoundError');
    expect(error).toBeInstanceOf(Error);
  });

  it('keeps the identifier in the message too', () => {
    expect(new ItemNotFoundError('item-42').message).toContain('item-42');
  });
});

describe('VersionNotFoundError', () => {
  it('carries the version number it was given', () => {
    const error = new VersionNotFoundError(7);

    expect(error.versionNumber).toBe(7);
  });

  it('names itself so a filter can match on the class, not the message', () => {
    const error = new VersionNotFoundError(7);

    expect(error.name).toBe('VersionNotFoundError');
    expect(error).toBeInstanceOf(Error);
  });

  it('keeps the version number in the message too', () => {
    expect(new VersionNotFoundError(7).message).toContain('7');
  });
});
