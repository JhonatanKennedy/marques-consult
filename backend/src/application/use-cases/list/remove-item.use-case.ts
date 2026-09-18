import { Injectable } from '@nestjs/common';
import { VersionRepository } from '../../../domain/repositories/item.repository.js';

@Injectable()
export class RemoveItemUseCase {
  constructor(private readonly versionRepository: VersionRepository) {}

  async execute(itemId: string) {
    const current = await this.versionRepository.getCurrentVersion();
    const updated = current.removeItem(itemId);
    return this.versionRepository.save(updated);
  }
}
