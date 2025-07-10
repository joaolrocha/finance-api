import { Expose } from 'class-transformer';
import { CategoryType } from '../entities/category.entity';

export class CategoryResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  color: string;

  @Expose()
  icon: string;

  @Expose()
  type: CategoryType;

  @Expose()
  isDefault: boolean;

  @Expose()
  isActive: boolean;

  @Expose()
  userId?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
