import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateGoalProgressDto {
  @IsNumber({}, { message: 'Valor deve ser um número' })
  @Min(0, { message: 'Valor deve ser positivo' })
  @Type(() => Number)
  amount: number;

  @IsOptional()
  @IsNumber(
    {},
    {
      message:
        'Operação deve ser um número (1 para adicionar, -1 para subtrair)',
    },
  )
  operation?: 1 | -1 = 1; // 1 = adicionar, -1 = subtrair
}
