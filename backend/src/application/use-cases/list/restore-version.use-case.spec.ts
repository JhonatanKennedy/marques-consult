import { describe, expect, it } from 'vitest';
import { RestoreVersionUseCase } from './restore-version.use-case.js';
import { AddItemUseCase } from './add-item.use-case.js';
import { InMemoryVersionRepository } from '../../../../test/version-repository.fake.js';
import { VersionNotFoundError } from '../../../domain/errors/version-not-found.error.js';
import { ListItem } from '../../../domain/entities/list-item.entity.js';
import { Version } from '../../../domain/entities/version.entity.js';

const item = (id: string, order: number): ListItem =>
  new ListItem({ id, name: id, description: `${id} description`, order });

/**
 * A version whose contents name their own number, so a test can tell at a
 * glance whether the version it got back is the one it asked for.
 */
const numbered = (number: number, createdAt?: Date): Version =>
  new Version(
    1,
    number,
    [item(`n${number}`, 0), item(`n${number}-b`, 1)],
    number,
    createdAt,
  );

/** Versions 1 through `upTo`, each with a distinct creation time. */
const record = (upTo: number): Version[] =>
  Array.from({ length: upTo }, (_, i) =>
    numbered(i + 1, new Date(2026, 0, i + 1)),
  );

const repositoryHolding = (...numbers: number[]): InMemoryVersionRepository =>
  new InMemoryVersionRepository().seed(numbers.map((n) => numbered(n)));

const restore = (repo: InMemoryVersionRepository, number: number) =>
  new RestoreVersionUseCase(repo).execute(number);

describe('RestoreVersionUseCase', () => {
  describe('discards the versions after the target', () => {
    it('makes the target the current version and destroys everything above it', async () => {
      const repo = new InMemoryVersionRepository().seed(record(9));

      await restore(repo, 2);

      expect(repo.numbers()).toEqual([1, 2]);
      expect((await repo.getCurrentVersion()).number).toBe(2);
    });

    it('leaves versions at or below the target untouched', async () => {
      const repo = new InMemoryVersionRepository().seed(record(9));

      await restore(repo, 5);

      expect(repo.numbers()).toEqual([1, 2, 3, 4, 5]);
    });

    it('restores from a record holding only the target itself', async () => {
      const repo = repositoryHolding(1);

      await restore(repo, 1);

      expect(repo.numbers()).toEqual([1]);
    });
  });

  describe('writes no entry of its own', () => {
    it('shrinks the record by exactly the number of versions above the target', async () => {
      const repo = new InMemoryVersionRepository().seed(record(9));

      await restore(repo, 2);

      // 9 held, 7 destroyed, nothing appended in their place.
      expect(repo.size).toBe(2);
    });

    it('appends nothing even when the target is the current version', async () => {
      const repo = new InMemoryVersionRepository().seed(record(4));

      await restore(repo, 4);

      expect(repo.size).toBe(4);
      expect(repo.numbers()).toEqual([1, 2, 3, 4]);
    });

    it('returns the target rather than a freshly written version', async () => {
      const repo = new InMemoryVersionRepository().seed(record(5));

      const restored = await restore(repo, 3);

      expect(restored.number).toBe(3);
      expect(restored.id).toBe(3);
      expect(restored.items.map((i) => i.id)).toEqual(['n3', 'n3-b']);
    });
  });

  describe('the target keeps its own timestamp', () => {
    it('preserves the creation time the target already had', async () => {
      const repo = new InMemoryVersionRepository().seed(record(5));
      const before = (await repo.findByNumber(2))!.createdAt;

      const restored = await restore(repo, 2);

      expect(restored.createdAt).toEqual(before);
      expect((await repo.getCurrentVersion()).createdAt).toEqual(before);
    });
  });

  describe('numbers are positions, not identities', () => {
    it('reuses a destroyed number for the next mutation', async () => {
      const repo = new InMemoryVersionRepository().seed(record(5));

      await restore(repo, 2);
      const appended = await new AddItemUseCase(repo).execute('Novo');

      // Not 6: the record's newest version is 2, so the next number is 3 —
      // the same number a destroyed version once held.
      expect(appended.number).toBe(3);
      expect(repo.numbers()).toEqual([1, 2, 3]);
    });

    it('hands the reused number to a version that is genuinely new', async () => {
      const repo = new InMemoryVersionRepository().seed(record(5));

      await restore(repo, 2);
      const appended = await new AddItemUseCase(repo).execute('Novo');

      expect(appended.id).toBeDefined();
      expect(appended.items.map((i) => i.name)).toContain('Novo');
      // The destroyed version 3 held n3; the new version 3 does not.
      expect(appended.items.map((i) => i.id)).not.toContain('n3');
    });
  });

  describe('refuses a version that does not exist', () => {
    it('throws VersionNotFoundError naming the number', async () => {
      const repo = new InMemoryVersionRepository().seed(record(5));

      await expect(restore(repo, 42)).rejects.toThrow(VersionNotFoundError);
      await expect(restore(repo, 42)).rejects.toThrow('42');
    });

    it('changes nothing when it refuses', async () => {
      const repo = new InMemoryVersionRepository().seed(record(5));

      await expect(restore(repo, 42)).rejects.toThrow(VersionNotFoundError);

      expect(repo.numbers()).toEqual([1, 2, 3, 4, 5]);
      expect(repo.size).toBe(5);
      expect((await repo.getCurrentVersion()).number).toBe(5);
    });

    it('refuses version 0 and negative numbers', async () => {
      const repo = new InMemoryVersionRepository().seed(record(5));

      await expect(restore(repo, 0)).rejects.toThrow(VersionNotFoundError);
      await expect(restore(repo, -1)).rejects.toThrow(VersionNotFoundError);

      expect(repo.numbers()).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('the refusal is checked before anything is destroyed', () => {
    it('does not delete a record whose target is above the newest version', async () => {
      const repo = repositoryHolding(1, 2);

      await expect(restore(repo, 3)).rejects.toThrow(VersionNotFoundError);

      expect(repo.numbers()).toEqual([1, 2]);
    });
  });
});
