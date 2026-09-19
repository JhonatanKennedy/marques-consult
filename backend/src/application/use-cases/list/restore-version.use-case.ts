import { Injectable } from '@nestjs/common';
import { VersionNotFoundError } from '../../../domain/errors/version-not-found.error.js';
import { VersionRepository } from '../../../domain/repositories/item.repository.js';
import { Version } from '../../../domain/entities/version.entity.js';

@Injectable()
export class RestoreVersionUseCase {
  constructor(private readonly versionRepository: VersionRepository) {}

  async execute(versionNumber: number): Promise<Version> {
    const target = await this.versionRepository.findByNumber(versionNumber);
    if (!target) {
      throw new VersionNotFoundError(versionNumber);
    }

    await this.versionRepository.deleteVersionsAfter(versionNumber);

    return target;
  }
}
