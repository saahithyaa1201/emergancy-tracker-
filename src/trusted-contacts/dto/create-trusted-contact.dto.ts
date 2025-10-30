import { IsString, IsEmail, IsOptional, IsInt, Min, Max, IsNotEmpty, Matches } from 'class-validator';

export class CreateTrustedContactDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(\+94|0)[0-9]{9}$/, {
    message: 'Phone must be a valid Sri Lankan number (e.g., +94771234567 or 0771234567)',
  })
  phone: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  priority?: number;
}