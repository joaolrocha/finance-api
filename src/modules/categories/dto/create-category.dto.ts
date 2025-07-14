import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsHexColor,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CategoryType } from '../entities/category.entity';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Netflix',
    minLength: 1,
  })
  @IsString({ message: 'Nome é obrigatório' })
  @IsNotEmpty({ message: 'Nome não pode estar vazio' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiPropertyOptional({
    description: 'Descrição da categoria',
    example: 'Assinaturas de streaming e entretenimento',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  description?: string;

  @ApiProperty({
    description: 'Cor da categoria em hexadecimal',
    example: '#E50914',
    pattern: '^#[0-9A-F]{6}$',
  })
  @IsHexColor({
    message: 'Cor deve ser um código hexadecimal válido (#FF5733)',
  })
  color: string;

  @ApiProperty({
    description: 'Ícone da categoria',
    example: 'tv',
    examples: [
      'restaurant',
      'car',
      'home',
      'medical',
      'salary',
      'tv',
      'shopping',
    ],
  })
  @IsString({ message: 'Ícone é obrigatório' })
  @IsNotEmpty({ message: 'Ícone não pode estar vazio' })
  icon: string;

  @ApiProperty({
    description: 'Tipo da categoria',
    enum: CategoryType,
    example: CategoryType.EXPENSE,
    enumName: 'CategoryType',
  })
  @IsEnum(CategoryType, {
    message: 'Tipo deve ser "income" ou "expense"',
  })
  type: CategoryType;

  @ApiPropertyOptional({
    description: 'ID do usuário (preenchido automaticamente via JWT)',
    example: 'uuid-do-usuario',
  })
  @IsOptional()
  @IsString()
  userId?: string; // Será preenchido automaticamente via JWT
}
