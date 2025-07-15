import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email único do usuário',
    example: 'joao@finance.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
    minLength: 2,
  })
  @IsString({ message: 'Nome é obrigatório' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty({
    description: 'Senha do usuário (será hasheada automaticamente)',
    example: '123456',
    minLength: 6,
  })
  @IsString({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  password: string;

  @ApiPropertyOptional({
    description: 'URL do avatar do usuário',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({
    description: 'Renda mensal do usuário em reais',
    example: 5000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Renda mensal deve ser um número' })
  @Min(0, { message: 'Renda mensal deve ser positiva' })
  @Transform(({ value }) => parseFloat(value))
  monthlyIncome?: number;
}
