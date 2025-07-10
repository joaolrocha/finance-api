import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transaction.dto';

// Remove userId do update (não deve ser alterado)
export class UpdateTransactionDto extends PartialType(
  OmitType(CreateTransactionDto, ['userId'] as const),
) {}
