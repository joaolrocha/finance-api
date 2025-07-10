import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import {
  TransactionStatus,
  TransactionType,
} from '../entities/transaction.entity';

export class CreateTransactionDto {
  @IsString({ message: 'Título é obrigatório' })
  @IsNotEmpty({ message: 'Título não pode estar vazio' })
  @Transform(({ value }) => value?.trim())
  title: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  description?: string;

  @IsNumber({}, { message: 'Valor deve ser um número' })
  @Min(0.01, { message: 'Valor deve ser maior que zero' })
  @Type(() => Number)
  amount: number;

  @IsEnum(TransactionType, {
    message: 'Tipo deve ser "income" ou "expense"',
  })
  type: TransactionType;

  @IsOptional()
  @IsEnum(TransactionStatus, {
    message: 'Status deve ser "pending", "completed" ou "cancelled"',
  })
  status?: TransactionStatus = TransactionStatus.COMPLETED;

  @IsDateString({}, { message: 'Data deve estar no formato ISO (YYYY-MM-DD)' })
  date: string;

  @IsOptional()
  @IsString()
  attachment?: string; // URL do comprovante

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]; // Array de tags

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean = false;

  @IsOptional()
  @IsString()
  recurringFrequency?: string; // 'monthly', 'weekly', 'yearly'

  @IsUUID(4, { message: 'ID da categoria deve ser um UUID válido' })
  categoryId: string;

  @IsOptional()
  @IsUUID(4, { message: 'ID do usuário deve ser um UUID válido' })
  userId?: string; // Será preenchido automaticamente via JWT
}
