import { Version } from '../src/domain/entities/version.entity.js';
import { VersionRepository } from '../src/domain/repositories/item.repository.js';

export class InMemoryVersionRepository extends VersionRepository {
  private versions: Version[] = [];
  private nextId = 1;

  seed(versions: Version[]): this {
    this.versions = [...versions];
    this.nextId = versions.length + 1;
    return this;
  }

  all(): Version[] {
    return [...this.versions].sort((a, b) => a.number - b.number);
  }

  numbers(): number[] {
    return this.all().map((v) => v.number);
  }

  get size(): number {
    return this.versions.length;
  }

  async getCurrentVersion(): Promise<Version> {
    const highest = this.all().at(-1);
    if (!highest) {
      throw new Error(
        'InMemoryVersionRepository is empty — seed it before exercising a use case',
      );
    }
    return highest;
  }

  async getHistory(): Promise<Version[]> {
    return this.all();
  }

  async findByNumber(number: number): Promise<Version | null> {
    return this.versions.find((v) => v.number === number) ?? null;
  }

  async save(version: Version): Promise<Version> {
    if (this.versions.some((v) => v.number === version.number)) {
      throw new Error(
        `Unique constraint failed: version ${version.number} already exists`,
      );
    }

    const stored = new Version(
      version.listId,
      version.number,
      version.items,
      this.nextId++,
      version.createdAt ?? new Date(),
    );

    this.versions.push(stored);
    return stored;
  }

  async deleteVersionsAfter(number: number): Promise<number> {
    const doomed = this.versions.filter((v) => v.number > number);
    this.versions = this.versions.filter((v) => v.number <= number);
    return doomed.length;
  }
}
