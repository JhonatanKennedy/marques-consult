import 'dotenv/config';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { PrismaVersionRepository } from '../src/infrastructure/repositories/prisma-version.repository.js';
import { Version } from '../src/domain/entities/version.entity.js';
import { ListItem } from '../src/domain/entities/list-item.entity.js';

class Rollback extends Error {}

const PROBE_NUMBER = 987_654;

type TransactionClient = Omit<
  PrismaService,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

const describeIfDatabase = process.env.DATABASE_URL ? describe : describe.skip;

describeIfDatabase('Version round trip through Prisma (e2e)', () => {
  let prisma: PrismaService;

  beforeAll(() => {
    prisma = new PrismaService();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  async function rolledBack(
    body: (tx: TransactionClient) => Promise<void>,
  ): Promise<void> {
    try {
      await prisma.$transaction(async (tx) => {
        await body(tx);
        throw new Rollback();
      });
    } catch (error) {
      if (!(error instanceof Rollback)) throw error;
    }
  }

  const repositoryOver = (tx: TransactionClient): PrismaVersionRepository =>
    new PrismaVersionRepository(tx as PrismaService);

  const items = (): ListItem[] => [
    new ListItem({
      id: 'round-trip-a',
      name: 'Comprar café',
      description: 'do bom',
      order: 0,
    }),
    new ListItem({ id: 'round-trip-b', name: 'Sem descrição', order: 1 }),
  ];

  const sample = (listId = 0, number = PROBE_NUMBER): Version =>
    new Version(listId, number, items());

  it('preserves every field the domain sets on a saved version', async () => {
    await rolledBack(async (tx) => {
      const repository = repositoryOver(tx);

      const saved = await repository.save(sample());
      const readBack = await repository.findByNumber(PROBE_NUMBER);

      expect(readBack).not.toBeNull();
      expect(readBack!.number).toBe(saved.number);
      expect(readBack!.listId).toBe(saved.listId);
      expect(readBack!.id).toBe(saved.id);
    });
  });

  it('preserves each item, in order, with all of its fields', async () => {
    await rolledBack(async (tx) => {
      const repository = repositoryOver(tx);

      await repository.save(sample());
      const readBack = (await repository.findByNumber(PROBE_NUMBER))!;

      expect(readBack.items).toHaveLength(2);

      const [first, second] = [...readBack.items].sort(
        (a, b) => a.order - b.order,
      );

      expect(first).toMatchObject({
        id: 'round-trip-a',
        name: 'Comprar café',
        description: 'do bom',
        order: 0,
      });
      expect(second).toMatchObject({
        id: 'round-trip-b',
        name: 'Sem descrição',
        order: 1,
      });

      expect(second.description).toBeUndefined();
    });
  });

  it('stamps a creation time the domain can read back', async () => {
    await rolledBack(async (tx) => {
      const repository = repositoryOver(tx);

      await repository.save(sample());
      const readBack = (await repository.findByNumber(PROBE_NUMBER))!;

      expect(readBack.createdAt).toBeInstanceOf(Date);
      expect(readBack.createdAt!.getTime()).toBeGreaterThan(0);
    });
  });

  it('destroys versions above a number and reports how many went', async () => {
    await rolledBack(async (tx) => {
      const repository = repositoryOver(tx);

      const base = PROBE_NUMBER;
      for (const number of [base, base + 1, base + 2]) {
        await repository.save(sample(0, number));
      }

      const deleted = await repository.deleteVersionsAfter(base);

      expect(deleted).toBe(2);
      expect(await repository.findByNumber(base + 1)).toBeNull();
      expect(await repository.findByNumber(base + 2)).toBeNull();
      expect(await repository.findByNumber(base)).not.toBeNull();
    });
  });

  it('rejects a write naming a field the schema does not define', async () => {
    await rolledBack(async (tx) => {
      const list =
        (await tx.list.findFirst()) ?? (await tx.list.create({ data: {} }));

      const valid = { listId: list.id, number: PROBE_NUMBER, content: [] };

      await tx.version.create({ data: valid });

      const drifted = {
        ...valid,
        number: PROBE_NUMBER + 1,
        thisColumnDoesNotExist: true,
      } as unknown as Parameters<typeof tx.version.create>[0]['data'];

      await expect(tx.version.create({ data: drifted })).rejects.toThrow();
    });
  });
});
