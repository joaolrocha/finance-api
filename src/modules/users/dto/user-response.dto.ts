import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({
    description: 'ID único do usuário',
    example: 'uuid-do-usuario',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@finance.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  @Expose()
  name: string;

  @ApiPropertyOptional({
    description: 'URL do avatar do usuário',
    example: 'https://example.com/avatar.jpg',
  })
  @Expose()
  avatar?: string;

  @ApiProperty({
    description: 'Renda mensal do usuário',
    example: 5000,
  })
  @Expose()
  monthlyIncome: number;

  @ApiProperty({
    description: 'Se o usuário está ativo',
    example: true,
  })
  @Expose()
  isActive: boolean;

  @ApiProperty({
    description: 'Data de criação da conta',
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

  // Nunca retornar a senha
  @Exclude()
  password: string;
}
