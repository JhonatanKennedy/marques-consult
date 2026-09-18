import { Version } from '../entities/version.entity.js';

export abstract class VersionRepository {
  abstract getCurrentVersion(listId?: number): Promise<Version>;
  abstract getHistory(listId?: number): Promise<Version[]>;
  abstract findByNumber(
    number: number,
    listId?: number,
  ): Promise<Version | null>;
  abstract save(version: Version): Promise<Version>;
}
