import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { AddItemUseCase } from '../../application/use-cases/list/add-item.use-case.js';
import { RemoveItemUseCase } from '../../application/use-cases/list/remove-item.use-case.js';
import { EditItemUseCase } from '../../application/use-cases/list/edit-item.use-case.js';
import { ReorderItemUseCase } from '../../application/use-cases/list/reorder-item.use-case.js';
import { RestoreVersionUseCase } from '../../application/use-cases/list/restore-version.use-case.js';
import { GetCurrentListUseCase } from '../../application/use-cases/list/get-current-list.use-case.js';
import { GetHistoryUseCase } from '../../application/use-cases/list/get-history.use-case.js';
import { CreateItemDto } from '../dto/create-item.dto.js';
import { UpdateItemDto } from '../dto/update-item.dto.js';
import { ReorderItemDto } from '../dto/reorder-item.dto.js';

@Controller('list')
export class ListController {
  constructor(
    private readonly addItem: AddItemUseCase,
    private readonly removeItem: RemoveItemUseCase,
    private readonly editItem: EditItemUseCase,
    private readonly reorderItem: ReorderItemUseCase,
    private readonly restoreVersion: RestoreVersionUseCase,
    private readonly getCurrentList: GetCurrentListUseCase,
    private readonly getHistory: GetHistoryUseCase,
  ) {}

  @Get()
  current() {
    return this.getCurrentList.execute();
  }

  @Get('history')
  history() {
    return this.getHistory.execute();
  }

  @Post('items')
  add(@Body() dto: CreateItemDto) {
    return this.addItem.execute(dto.name, dto.description);
  }

  @Delete('items/:id')
  remove(@Param('id') id: string) {
    return this.removeItem.execute(id);
  }

  @Patch('items/:id')
  edit(@Param('id') id: string, @Body() dto: UpdateItemDto) {
    return this.editItem.execute(id, dto.name, dto.description);
  }

  @Patch('items/:id/reorder')
  reorder(@Param('id') id: string, @Body() dto: ReorderItemDto) {
    return this.reorderItem.execute(id, dto.newOrder);
  }

  @Post('restore/:number')
  restore(@Param('number', ParseIntPipe) number: number) {
    return this.restoreVersion.execute(number);
  }
}
