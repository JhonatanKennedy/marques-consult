import { Injectable } from '@nestjs/common';
import { VersionRepository } from '../../../domain/repositories/item.repository.js';

@Injectable()
export class ReorderItemUseCase {
  constructor(private readonly versionRepository: VersionRepository) {}

  async execute(itemId: string, newOrder: number) {
    const current = await this.versionRepository.getCurrentVersion();
    const updated = current.reorderItem(itemId, newOrder);
    return this.versionRepository.save(updated);
  }
}
