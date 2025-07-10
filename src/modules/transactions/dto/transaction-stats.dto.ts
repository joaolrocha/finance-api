import { Expose } from 'class-transformer';

export class TransactionStatsDto {
  @Expose()
  totalIncome: number;

  @Expose()
  totalExpense: number;

  @Expose()
  balance: number;

  @Expose()
  transactionCount: number;

  @Expose()
  avgTransactionValue: number;

  @Expose()
  period: {
    startDate: string;
    endDate: string;
  };

  @Expose()
  byCategory: {
    categoryId: string;
    categoryName: string;
    total: number;
    count: number;
    type: string;
  }[];

  @Expose()
  byMonth?: {
    month: string;
    income: number;
    expense: number;
    balance: number;
  }[];
}
