import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CategoryType } from '../entities/category.entity';

export class CategoryResponseDto {
  @ApiProperty({
    description: 'ID único da categoria',
    example: 'uuid-da-categoria',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Netflix',
  })
  @Expose()
  name: string;

  @ApiPropertyOptional({
    description: 'Descrição da categoria',
    example: 'Assinaturas de streaming e entretenimento',
  })
  @Expose()
  description?: string;

  @ApiProperty({
    description: 'Cor da categoria em hexadecimal',
    example: '#E50914',
  })
  @Expose()
  color: string;

  @ApiProperty({
    description: 'Ícone da categoria',
    example: 'tv',
  })
  @Expose()
  icon: string;

  @ApiProperty({
    description: 'Tipo da categoria',
    enum: CategoryType,
    example: CategoryType.EXPENSE,
  })
  @Expose()
  type: CategoryType;

  @ApiProperty({
    description: 'Se é uma categoria padrão do sistema',
    example: false,
  })
  @Expose()
  isDefault: boolean;

  @ApiProperty({
    description: 'Se a categoria está ativa',
    example: true,
  })
  @Expose()
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'ID do usuário proprietário',
    example: 'uuid-do-usuario',
  })
  @Expose()
  userId?: string;

  @ApiProperty({
    description: 'Data de criação',
    example: '2025-01-10T10:00:00Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Data de última atualização',
    example: '2025-01-10T10:00:00Z',
  })
  @Expose()
  updatedAt: Date;
}
