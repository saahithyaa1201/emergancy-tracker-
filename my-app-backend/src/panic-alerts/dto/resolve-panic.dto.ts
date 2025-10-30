import { IsString, IsOptional } from 'class-validator';

export class ResolvePanicDto {
  @IsString()
  @IsOptional()
  notes?: string;
}