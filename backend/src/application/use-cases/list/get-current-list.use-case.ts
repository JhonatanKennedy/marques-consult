import { Injectable } from '@nestjs/common';
import { VersionRepository } from '../../../domain/repositories/item.repository.js';

@Injectable()
export class GetCurrentListUseCase {
  constructor(private readonly versionRepository: VersionRepository) {}

  execute() {
    return this.versionRepository.getCurrentVersion();
  }
}
