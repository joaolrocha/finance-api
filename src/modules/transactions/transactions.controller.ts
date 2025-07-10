import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionFiltersDto } from './dto/transaction-filters.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { TransactionStatsDto } from './dto/transaction-stats.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
@UseInterceptors(ClassSerializerInterceptor)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    const transaction =
      await this.transactionsService.create(createTransactionDto);
    return plainToInstance(TransactionResponseDto, transaction);
  }

  @Get()
  async findAll(
    @Query('userId') userId: string,
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    filters: TransactionFiltersDto,
  ): Promise<{
    data: TransactionResponseDto[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const result = await this.transactionsService.findAll(userId, filters);

    return {
      data: result.data.map((transaction) =>
        plainToInstance(TransactionResponseDto, transaction),
      ),
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      },
    };
  }

  @Get('stats')
  async getStats(
    @Query('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<TransactionStatsDto> {
    return await this.transactionsService.getStats(userId, startDate, endDate);
  }

  @Get('summary')
  async getSummary(
    @Query('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{
    totalIncome: number;
    totalExpense: number;
    balance: number;
    transactionCount: number;
  }> {
    const stats = await this.transactionsService.getStats(
      userId,
      startDate,
      endDate,
    );

    return {
      totalIncome: stats.totalIncome,
      totalExpense: stats.totalExpense,
      balance: stats.balance,
      transactionCount: stats.transactionCount,
    };
  }

  @Get('by-category')
  async getByCategory(
    @Query('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<
    {
      categoryId: string;
      categoryName: string;
      total: number;
      count: number;
      type: string;
    }[]
  > {
    const stats = await this.transactionsService.getStats(
      userId,
      startDate,
      endDate,
    );
    return stats.byCategory;
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('userId') userId: string,
  ): Promise<TransactionResponseDto> {
    const transaction = await this.transactionsService.findOne(id, userId);
    return plainToInstance(TransactionResponseDto, transaction);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Query('userId') userId: string,
  ): Promise<TransactionResponseDto> {
    const transaction = await this.transactionsService.update(
      id,
      updateTransactionDto,
      userId,
    );
    return plainToInstance(TransactionResponseDto, transaction);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('userId') userId: string,
  ): Promise<{ message: string }> {
    await this.transactionsService.remove(id, userId);
    return { message: 'Transação removida com sucesso' };
  }
}
