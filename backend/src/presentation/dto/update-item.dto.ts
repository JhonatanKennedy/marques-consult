import { IsNotEmpty, IsOptional, IsString } from '@nestjs/class-validator';

export class UpdateItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
