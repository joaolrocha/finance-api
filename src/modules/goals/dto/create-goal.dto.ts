import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Título da meta',
    example: 'Férias no Exterior',
    minLength: 1,
  })
  @IsString({ message: 'Título é obrigatório' })
  @IsNotEmpty({ message: 'Título não pode estar vazio' })
  @Transform(({ value }) => value?.trim())
  title: string;

  @ApiPropertyOptional({
    description: 'Descrição detalhada da meta',
    example: 'Economizar para viagem de 15 dias na Europa',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  description?: string;

  @ApiPropertyOptional({
    description: 'Tipo da meta',
    enum: GoalType,
    example: GoalType.SAVINGS,
    default: GoalType.SAVINGS,
    enumName: 'GoalType',
  })
  @IsOptional()
  @IsEnum(GoalType, {
    message: 'Tipo deve ser "savings", "expense_limit" ou "debt_payment"',
  })
  type?: GoalType = GoalType.SAVINGS;

  @ApiProperty({
    description: 'Valor alvo da meta',
    example: 15000,
    minimum: 0.01,
  })
  @IsNumber({}, { message: 'Valor da meta deve ser um número' })
  @Min(0.01, { message: 'Valor da meta deve ser maior que zero' })
  @Type(() => Number)
  targetAmount: number;

  @ApiPropertyOptional({
    description: 'Valor atual já acumulado',
    example: 2000,
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Valor atual deve ser um número' })
  @Min(0, { message: 'Valor atual deve ser positivo' })
  @Type(() => Number)
  currentAmount?: number = 0;

  @ApiProperty({
    description: 'Data limite para atingir a meta',
    example: '2025-12-31',
    format: 'date',
  })
  @IsDateString(
    {},
    { message: 'Data limite deve estar no formato ISO (YYYY-MM-DD)' },
  )
  deadline: string;

  @ApiPropertyOptional({
    description: 'Status da meta',
    enum: GoalStatus,
    example: GoalStatus.ACTIVE,
    default: GoalStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(GoalStatus, {
    message: 'Status deve ser "active", "completed", "paused" ou "cancelled"',
  })
  status?: GoalStatus = GoalStatus.ACTIVE;

  @ApiPropertyOptional({
    description: 'Cor da meta em hexadecimal',
    example: '#4CAF50',
    pattern: '^#[0-9A-F]{6}$',
  })
  @IsOptional()
  @IsHexColor({
    message: 'Cor deve ser um código hexadecimal válido (#FF5733)',
  })
  color?: string;

  @ApiPropertyOptional({
    description: 'Ícone da meta',
    example: 'airplane',
    examples: ['airplane', 'home', 'car', 'graduation-cap', 'piggy-bank'],
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({
    description: 'Se a meta é automática (baseada em regras)',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isAutomatic?: boolean = false;

  @ApiPropertyOptional({
    description: 'Regras para metas automáticas (JSON)',
    example: {
      categoryId: 'uuid-categoria',
      maxMonthlyAmount: 800,
    },
  })
  @IsOptional()
  rules?: object;

  @ApiPropertyOptional({
    description: 'ID do usuário (preenchido automaticamente via JWT)',
    example: 'uuid-do-usuario',
  })
  @IsOptional()
  @IsUUID(4, { message: 'ID do usuário deve ser um UUID válido' })
  userId?: string;
}
