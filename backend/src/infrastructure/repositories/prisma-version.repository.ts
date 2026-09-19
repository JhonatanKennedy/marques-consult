import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { VersionRepository } from '../../domain/repositories/item.repository.js';
import { Version } from '../../domain/entities/version.entity.js';
import { ListItem } from '../../domain/entities/list-item.entity.js';

@Injectable()
export class PrismaVersionRepository implements VersionRepository {
  constructor(private readonly prisma: PrismaService) {}

  private async getOrCreateListId(): Promise<number> {
    let list = await this.prisma.list.findFirst();

    if (!list) {
      list = await this.prisma.list.create({ data: {} });
      await this.prisma.version.create({
        data: { listId: list.id, number: 1, content: [] },
      });
    }

    return list.id;
  }

  private toDomain(record: {
    listId: number;
    number: number;
    content: unknown;
    id: number;
    createdAt?: Date;
  }): Version {
    const items = (record.content as any[]).map((i) => new ListItem(i));
    return new Version(
      record.listId,
      record.number,
      items,
      record.id,
      record.createdAt,
    );
  }

  async getCurrentVersion(): Promise<Version> {
    const listId = await this.getOrCreateListId();
    const record = await this.prisma.version.findFirst({
      where: { listId },
      orderBy: { number: 'desc' },
    });
    return this.toDomain(record!);
  }

  async getHistory(): Promise<Version[]> {
    const listId = await this.getOrCreateListId();
    const records = await this.prisma.version.findMany({
      where: { listId },
      orderBy: { number: 'asc' },
    });
    return records.map((r) => this.toDomain(r));
  }

  async findByNumber(number: number): Promise<Version | null> {
    const listId = await this.getOrCreateListId();
    const record = await this.prisma.version.findUnique({
      where: { listId_number: { listId, number } },
    });
    return record ? this.toDomain(record) : null;
  }

  async deleteVersionsAfter(number: number): Promise<number> {
    const listId = await this.getOrCreateListId();
    const { count } = await this.prisma.version.deleteMany({
      where: { listId, number: { gt: number } },
    });
    return count;
  }

  async save(version: Version): Promise<Version> {
    const listId = await this.getOrCreateListId();
    const content = version.items.map((i) => ({
      id: i.id,
      name: i.name,
      description: i.description,
      order: i.order,
    }));

    const record = await this.prisma.version.create({
      data: {
        listId,
        number: version.number,
        content,
      },
    });

    return this.toDomain(record);
  }
}
