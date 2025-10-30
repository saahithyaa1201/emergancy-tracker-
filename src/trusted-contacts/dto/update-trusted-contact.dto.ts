import { IsString, IsEmail, IsOptional, IsInt, Min, Max, IsBoolean, Matches } from 'class-validator';

export class UpdateTrustedContactDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @Matches(/^(\+94|0)[0-9]{9}$/, {
    message: 'Phone must be a valid Sri Lankan number (e.g., +94771234567 or 0771234567)',
  })
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  priority?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}