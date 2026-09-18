import { Injectable } from '@nestjs/common';
import { VersionRepository } from '../../../domain/repositories/item.repository.js';

@Injectable()
export class AddItemUseCase {
  constructor(private readonly versionRepository: VersionRepository) {}

  async execute(name: string, description?: string) {
    const current = await this.versionRepository.getCurrentVersion();
    const updated = current.addItem(name, description);
    return this.versionRepository.save(updated);
  }
}
