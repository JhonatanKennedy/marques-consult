import { IsNotEmpty, IsOptional, IsString } from '@nestjs/class-validator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
