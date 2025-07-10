import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsString({ message: 'Nome é obrigatório' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsString({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  password: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Renda mensal deve ser um número' })
  @Min(0, { message: 'Renda mensal deve ser positiva' })
  @Transform(({ value }) => parseFloat(value))
  monthlyIncome?: number;
}
