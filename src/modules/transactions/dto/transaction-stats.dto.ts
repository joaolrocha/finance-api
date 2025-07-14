import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TransactionStatsDto {
  @ApiProperty({
    description: 'Total de receitas no período',
    example: 5000.0,
  })
  @Expose()
  totalIncome: number;

  @ApiProperty({
    description: 'Total de despesas no período',
    example: 3200.5,
  })
  @Expose()
  totalExpense: number;

  @ApiProperty({
    description: 'Saldo (receitas - despesas)',
    example: 1799.5,
  })
  @Expose()
  balance: number;

  @ApiProperty({
    description: 'Quantidade total de transações',
    example: 25,
  })
  @Expose()
  transactionCount: number;

  @ApiProperty({
    description: 'Valor médio das transações',
    example: 320.0,
  })
  @Expose()
  avgTransactionValue: number;

  @ApiProperty({
    description: 'Período das estatísticas',
    example: {
      startDate: '2025-01-01',
      endDate: '2025-01-31',
    },
  })
  @Expose()
  period: {
    startDate: string;
    endDate: string;
  };

  @ApiProperty({
    description: 'Estatísticas agrupadas por categoria',
    example: [
      {
        categoryId: 'uuid-categoria-1',
        categoryName: 'Alimentação',
        total: 800.0,
        count: 15,
        type: 'expense',
      },
      {
        categoryId: 'uuid-categoria-2',
        categoryName: 'Salário',
        total: 5000.0,
        count: 1,
        type: 'income',
      },
    ],
  })
  @Expose()
  byCategory: {
    categoryId: string;
    categoryName: string;
    total: number;
    count: number;
    type: string;
  }[];

  @ApiPropertyOptional({
    description: 'Estatísticas mensais (quando disponível)',
    example: [
      {
        month: '2025-01',
        income: 5000.0,
        expense: 3200.5,
        balance: 1799.5,
      },
    ],
  })
  @Expose()
  byMonth?: {
    month: string;
    income: number;
    expense: number;
    balance: number;
  }[];
}
