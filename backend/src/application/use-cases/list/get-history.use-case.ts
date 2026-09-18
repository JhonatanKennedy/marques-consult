import { Injectable } from '@nestjs/common';
import { VersionRepository } from '../../../domain/repositories/item.repository.js';

@Injectable()
export class GetHistoryUseCase {
  constructor(private readonly versionRepository: VersionRepository) {}

  execute() {
    return this.versionRepository.getHistory();
  }
}
