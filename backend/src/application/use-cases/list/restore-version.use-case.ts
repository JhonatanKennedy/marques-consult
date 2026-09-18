import { Injectable } from '@nestjs/common';
// import { VersionNotFoundError } from '../../domain/errors/version-not-found.error';
import { VersionRepository } from '../../../domain/repositories/item.repository.js';

@Injectable()
export class RestoreVersionUseCase {
  constructor(private readonly versionRepository: VersionRepository) {}

  async execute(versionNumber: number) {
    const target = await this.versionRepository.findByNumber(versionNumber);
    if (!target) {
      // throw new VersionNotFoundError(versionNumber);
      throw Error();
    }

    const current = await this.versionRepository.getCurrentVersion();
    const restored = target.restoredAs(current.number + 1);

    return this.versionRepository.save(restored);
  }
}
