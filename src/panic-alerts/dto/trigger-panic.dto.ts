import { IsNumber, IsOptional, Min, Max } from 'class-validator';

export class TriggerPanicDto {
  @IsNumber()
  @IsOptional()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @IsNumber()
  @IsOptional()
  @Min(-180)
  @Max(180)
  longitude?: number;
}