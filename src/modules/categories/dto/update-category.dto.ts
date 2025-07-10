import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

// Remove userId do update (não deve ser alterado)
export class UpdateCategoryDto extends PartialType(
  OmitType(CreateCategoryDto, ['userId'] as const),
) {}
