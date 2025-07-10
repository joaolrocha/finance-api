import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsHexColor,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { GoalStatus, GoalType } from '../entities/goal.entity';

export class CreateGoalDto {
  @IsString({ message: 'Título é obrigatório' })
  @IsNotEmpty({ message: 'Título não pode estar vazio' })
  @Transform(({ value }) => value?.trim())
  title: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  description?: string;

  @IsOptional()
  @IsEnum(GoalType, {
    message: 'Tipo deve ser "savings", "expense_limit" ou "debt_payment"',
  })
  type?: GoalType = GoalType.SAVINGS;

  @IsNumber({}, { message: 'Valor da meta deve ser um número' })
  @Min(0.01, { message: 'Valor da meta deve ser maior que zero' })
  @Type(() => Number)
  targetAmount: number;

  @IsOptional()
  @IsNumber({}, { message: 'Valor atual deve ser um número' })
  @Min(0, { message: 'Valor atual deve ser positivo' })
  @Type(() => Number)
  currentAmount?: number = 0;

  @IsDateString(
    {},
    { message: 'Data limite deve estar no formato ISO (YYYY-MM-DD)' },
  )
  deadline: string;

  @IsOptional()
  @IsEnum(GoalStatus, {
    message: 'Status deve ser "active", "completed", "paused" ou "cancelled"',
  })
  status?: GoalStatus = GoalStatus.ACTIVE;

  @IsOptional()
  @IsHexColor({
    message: 'Cor deve ser um código hexadecimal válido (#FF5733)',
  })
  color?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsBoolean()
  isAutomatic?: boolean = false;

  @IsOptional()
  rules?: object; // Regras para metas automáticas (JSON)

  @IsOptional()
  @IsUUID(4, { message: 'ID do usuário deve ser um UUID válido' })
  userId?: string; // Será preenchido automaticamente via JWT
}
