import { Expose } from 'class-transformer';
import { GoalStatus, GoalType } from '../entities/goal.entity';

export class GoalResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description?: string;

  @Expose()
  type: GoalType;

  @Expose()
  targetAmount: number;

  @Expose()
  currentAmount: number;

  @Expose()
  deadline: Date;

  @Expose()
  status: GoalStatus;

  @Expose()
  color?: string;

  @Expose()
  icon?: string;

  @Expose()
  isAutomatic: boolean;

  @Expose()
  rules?: object;

  @Expose()
  userId: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  // Campos calculados
  @Expose()
  progress: number; // Percentual de progresso

  @Expose()
  isCompleted: boolean; // Se atingiu 100%

  @Expose()
  daysRemaining: number; // Dias até o deadline

  @Expose()
  isOverdue: boolean; // Se passou do prazo

  @Expose()
  dailyTargetToReach: number; // Quanto precisa por dia para atingir a meta
}
