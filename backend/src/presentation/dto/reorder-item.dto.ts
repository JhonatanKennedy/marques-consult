import { IsInt, Min } from '@nestjs/class-validator';

export class ReorderItemDto {
  @IsInt()
  @Min(0)
  newOrder: number;
}
