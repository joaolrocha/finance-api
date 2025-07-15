import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateGoalProgressDto {
  @ApiProperty({
    description: 'Valor a ser adicionado ou subtraído',
    example: 500,
    minimum: 0,
  })
  @IsNumber({}, { message: 'Valor deve ser um número' })
  @Min(0, { message: 'Valor deve ser positivo' })
  @Type(() => Number)
  amount: number;

  @ApiPropertyOptional({
    description: 'Operação: 1 para adicionar, -1 para subtrair',
    example: 1,
    enum: [1, -1],
    default: 1,
  })
  @IsOptional()
  @IsNumber(
    {},
    {
      message:
        'Operação deve ser um número (1 para adicionar, -1 para subtrair)',
    },
  )
  operation?: 1 | -1 = 1;
}
