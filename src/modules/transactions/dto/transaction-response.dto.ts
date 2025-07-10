import { Expose, Type } from 'class-transformer';
import {
  TransactionStatus,
  TransactionType,
} from '../entities/transaction.entity';
import { CategoryResponseDto } from '../../categories/dto/category-response.dto';

export class TransactionResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description?: string;

  @Expose()
  amount: number;

  @Expose()
  type: TransactionType;

  @Expose()
  status: TransactionStatus;

  @Expose()
  date: Date;

  @Expose()
  attachment?: string;

  @Expose()
  tags?: string[];

  @Expose()
  isRecurring: boolean;

  @Expose()
  recurringFrequency?: string;

  @Expose()
  categoryId: string;

  @Expose()
  userId: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  // Relacionamento com categoria
  @Expose()
  @Type(() => CategoryResponseDto)
  category?: CategoryResponseDto;
}
