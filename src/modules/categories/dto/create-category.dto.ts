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
  @IsString({ message: 'Nome é obrigatório' })
  @IsNotEmpty({ message: 'Nome não pode estar vazio' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  description?: string;

  @IsHexColor({
    message: 'Cor deve ser um código hexadecimal válido (#FF5733)',
  })
  color: string;

  @IsString({ message: 'Ícone é obrigatório' })
  @IsNotEmpty({ message: 'Ícone não pode estar vazio' })
  icon: string;

  @IsEnum(CategoryType, {
    message: 'Tipo deve ser "income" ou "expense"',
  })
  type: CategoryType;

  @IsOptional()
  @IsString()
  userId?: string; // Será preenchido automaticamente via JWT
}
