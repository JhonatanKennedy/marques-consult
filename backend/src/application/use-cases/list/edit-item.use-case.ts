import { Injectable } from '@nestjs/common';
import { VersionRepository } from '../../../domain/repositories/item.repository.js';

@Injectable()
export class EditItemUseCase {
  constructor(private readonly versionRepository: VersionRepository) {}

  async execute(itemId: string, name: string, description?: string) {
    const current = await this.versionRepository.getCurrentVersion();
    const updated = current.editItem(itemId, name, description);
    return this.versionRepository.save(updated);
  }
}
