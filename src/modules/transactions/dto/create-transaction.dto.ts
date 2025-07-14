import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Título da transação',
    example: 'Almoço no restaurante',
    minLength: 1,
  })
  @IsString({ message: 'Título é obrigatório' })
  @IsNotEmpty({ message: 'Título não pode estar vazio' })
  @Transform(({ value }) => value?.trim())
  title: string;

  @ApiPropertyOptional({
    description: 'Descrição detalhada da transação',
    example: 'Almoço de trabalho com equipe de desenvolvimento',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  description?: string;

  @ApiProperty({
    description: 'Valor da transação',
    example: 45.5,
    minimum: 0.01,
  })
  @IsNumber({}, { message: 'Valor deve ser um número' })
  @Min(0.01, { message: 'Valor deve ser maior que zero' })
  @Type(() => Number)
  amount: number;

  @ApiProperty({
    description: 'Tipo da transação',
    enum: TransactionType,
    example: TransactionType.EXPENSE,
    enumName: 'TransactionType',
  })
  @IsEnum(TransactionType, {
    message: 'Tipo deve ser "income" ou "expense"',
  })
  type: TransactionType;

  @ApiPropertyOptional({
    description: 'Status da transação',
    enum: TransactionStatus,
    example: TransactionStatus.COMPLETED,
    default: TransactionStatus.COMPLETED,
  })
  @IsOptional()
  @IsEnum(TransactionStatus, {
    message: 'Status deve ser "pending", "completed" ou "cancelled"',
  })
  status?: TransactionStatus = TransactionStatus.COMPLETED;

  @ApiProperty({
    description: 'Data da transação',
    example: '2025-01-10',
    format: 'date',
  })
  @IsDateString({}, { message: 'Data deve estar no formato ISO (YYYY-MM-DD)' })
  date: string;

  @ApiPropertyOptional({
    description: 'URL do comprovante ou anexo',
    example: 'https://example.com/comprovante.pdf',
  })
  @IsOptional()
  @IsString()
  attachment?: string;

  @ApiPropertyOptional({
    description: 'Tags da transação',
    example: ['alimentacao', 'trabalho', 'restaurante'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Se a transação é recorrente',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean = false;

  @ApiPropertyOptional({
    description: 'Frequência da recorrência',
    example: 'monthly',
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
  })
  @IsOptional()
  @IsString()
  recurringFrequency?: string;

  @ApiProperty({
    description: 'ID da categoria',
    example: 'uuid-da-categoria',
  })
  @IsUUID(4, { message: 'ID da categoria deve ser um UUID válido' })
  categoryId: string;

  @ApiPropertyOptional({
    description: 'ID do usuário (preenchido automaticamente via JWT)',
    example: 'uuid-do-usuario',
  })
  @IsOptional()
  @IsUUID(4, { message: 'ID do usuário deve ser um UUID válido' })
  userId?: string;
}
