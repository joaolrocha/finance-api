import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { GoalStatus, GoalType } from '../entities/goal.entity';

export class GoalResponseDto {
  @ApiProperty({
    description: 'ID único da meta',
    example: 'uuid-da-meta',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Título da meta',
    example: 'Férias no Exterior',
  })
  @Expose()
  title: string;

  @ApiPropertyOptional({
    description: 'Descrição da meta',
    example: 'Economizar para viagem de 15 dias na Europa',
  })
  @Expose()
  description?: string;

  @ApiProperty({
    description: 'Tipo da meta',
    enum: GoalType,
    example: GoalType.SAVINGS,
  })
  @Expose()
  type: GoalType;

  @ApiProperty({
    description: 'Valor alvo da meta',
    example: 15000,
  })
  @Expose()
  targetAmount: number;

  @ApiProperty({
    description: 'Valor atual acumulado',
    example: 2000,
  })
  @Expose()
  currentAmount: number;

  @ApiProperty({
    description: 'Data limite para atingir a meta',
    example: '2025-12-31T00:00:00Z',
  })
  @Expose()
  deadline: Date;

  @ApiProperty({
    description: 'Status da meta',
    enum: GoalStatus,
    example: GoalStatus.ACTIVE,
  })
  @Expose()
  status: GoalStatus;

  @ApiPropertyOptional({
    description: 'Cor da meta',
    example: '#4CAF50',
  })
  @Expose()
  color?: string;

  @ApiPropertyOptional({
    description: 'Ícone da meta',
    example: 'airplane',
  })
  @Expose()
  icon?: string;

  @ApiProperty({
    description: 'Se é meta automática',
    example: false,
  })
  @Expose()
  isAutomatic: boolean;

  @ApiPropertyOptional({
    description: 'Regras da meta automática',
    example: { categoryId: 'uuid', maxMonthlyAmount: 800 },
  })
  @Expose()
  rules?: object;

  @ApiProperty({
    description: 'ID do usuário proprietário',
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

  // Campos calculados
  @ApiProperty({
    description: 'Progresso em percentual (0-100)',
    example: 13.33,
  })
  @Expose()
  progress: number;

  @ApiProperty({
    description: 'Se a meta foi completada (100%)',
    example: false,
  })
  @Expose()
  isCompleted: boolean;

  @ApiProperty({
    description: 'Dias restantes até o deadline',
    example: 330,
  })
  @Expose()
  daysRemaining: number;

  @ApiProperty({
    description: 'Se a meta está atrasada',
    example: false,
  })
  @Expose()
  isOverdue: boolean;

  @ApiProperty({
    description: 'Valor que precisa economizar por dia para atingir a meta',
    example: 39.39,
  })
  @Expose()
  dailyTargetToReach: number;
}
