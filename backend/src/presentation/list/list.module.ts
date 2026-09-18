import { Module } from '@nestjs/common';
import { ListController } from './list.controller.js';
import { VersionRepository } from '../../domain/repositories/item.repository.js';
import { PrismaVersionRepository } from '../../infrastructure/repositories/prisma-version.repository.js';
import { AddItemUseCase } from '../../application/use-cases/list/add-item.use-case.js';
import { RemoveItemUseCase } from '../../application/use-cases/list/remove-item.use-case.js';
import { EditItemUseCase } from '../../application/use-cases/list/edit-item.use-case.js';
import { ReorderItemUseCase } from '../../application/use-cases/list/reorder-item.use-case.js';
import { RestoreVersionUseCase } from '../../application/use-cases/list/restore-version.use-case.js';
import { GetCurrentListUseCase } from '../../application/use-cases/list/get-current-list.use-case.js';
import { GetHistoryUseCase } from '../../application/use-cases/list/get-history.use-case.js';

@Module({
  controllers: [ListController],
  providers: [
    { provide: VersionRepository, useClass: PrismaVersionRepository },
    AddItemUseCase,
    RemoveItemUseCase,
    EditItemUseCase,
    ReorderItemUseCase,
    RestoreVersionUseCase,
    GetCurrentListUseCase,
    GetHistoryUseCase,
  ],
})
export class ListModule {}
