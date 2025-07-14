import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  TransactionStatus,
  TransactionType,
} from '../entities/transaction.entity';
import { CategoryResponseDto } from '../../categories/dto/category-response.dto';

export class TransactionResponseDto {
  @ApiProperty({
    description: 'ID único da transação',
    example: 'uuid-da-transacao',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Título da transação',
    example: 'Almoço no restaurante',
  })
  @Expose()
  title: string;

  @ApiPropertyOptional({
    description: 'Descrição da transação',
    example: 'Almoço de trabalho com equipe',
  })
  @Expose()
  description?: string;

  @ApiProperty({
    description: 'Valor da transação',
    example: 45.5,
  })
  @Expose()
  amount: number;

  @ApiProperty({
    description: 'Tipo da transação',
    enum: TransactionType,
    example: TransactionType.EXPENSE,
  })
  @Expose()
  type: TransactionType;

  @ApiProperty({
    description: 'Status da transação',
    enum: TransactionStatus,
    example: TransactionStatus.COMPLETED,
  })
  @Expose()
  status: TransactionStatus;

  @ApiProperty({
    description: 'Data da transação',
    example: '2025-01-10T00:00:00Z',
  })
  @Expose()
  date: Date;

  @ApiPropertyOptional({
    description: 'URL do comprovante',
    example: 'https://example.com/comprovante.pdf',
  })
  @Expose()
  attachment?: string;

  @ApiPropertyOptional({
    description: 'Tags da transação',
    example: ['alimentacao', 'trabalho'],
    type: [String],
  })
  @Expose()
  tags?: string[];

  @ApiProperty({
    description: 'Se é transação recorrente',
    example: false,
  })
  @Expose()
  isRecurring: boolean;

  @ApiPropertyOptional({
    description: 'Frequência da recorrência',
    example: 'monthly',
  })
  @Expose()
  recurringFrequency?: string;

  @ApiProperty({
    description: 'ID da categoria',
    example: 'uuid-da-categoria',
  })
  @Expose()
  categoryId: string;

  @ApiProperty({
    description: 'ID do usuário',
    example: 'uuid-do-usuario',
  })
  @Expose()
  userId: string;

  @ApiProperty({
    description: 'Data de criação',
    example: '2025-01-10T10:00:00Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização',
    example: '2025-01-10T10:00:00Z',
  })
  @Expose()
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Dados da categoria relacionada',
    type: CategoryResponseDto,
  })
  @Expose()
  @Type(() => CategoryResponseDto)
  category?: CategoryResponseDto;
}
