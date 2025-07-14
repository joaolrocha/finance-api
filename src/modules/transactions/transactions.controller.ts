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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionFiltersDto } from './dto/transaction-filters.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { TransactionStatsDto } from './dto/transaction-stats.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsService } from './transactions.service';

@ApiTags('Transactions')
@ApiBearerAuth('JWT-auth')
@Controller('transactions')
@UseInterceptors(ClassSerializerInterceptor)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova transação' })
  @ApiResponse({
    status: 201,
    description: 'Transação criada com sucesso',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    const transaction =
      await this.transactionsService.create(createTransactionDto);
    return plainToInstance(TransactionResponseDto, transaction);
  }

  @Get()
  @ApiOperation({ summary: 'Listar transações com filtros e paginação' })
  @ApiQuery({ name: 'userId', description: 'ID do usuário', required: true })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filtrar por tipo (income/expense)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filtrar por status',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'Filtrar por categoria',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Data inicial (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Data final (YYYY-MM-DD)',
  })
  @ApiQuery({ name: 'minAmount', required: false, description: 'Valor mínimo' })
  @ApiQuery({ name: 'maxAmount', required: false, description: 'Valor máximo' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Buscar no título/descrição',
  })
  @ApiQuery({ name: 'tag', required: false, description: 'Filtrar por tag' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Página (padrão: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Itens por página (padrão: 20)',
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    description: 'Campo ordenação (padrão: date)',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    description: 'Direção (ASC/DESC, padrão: DESC)',
  })
  @ApiResponse({
    status: 200,
    description: 'Transações retornadas com sucesso',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/TransactionResponseDto' },
        },
        pagination: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 150 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 20 },
            totalPages: { type: 'number', example: 8 },
          },
        },
      },
    },
  })
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
  @ApiOperation({ summary: 'Obter estatísticas completas das transações' })
  @ApiQuery({ name: 'userId', description: 'ID do usuário', required: true })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Data inicial para filtro (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Data final para filtro (YYYY-MM-DD)',
  })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso',
    type: TransactionStatsDto,
  })
  async getStats(
    @Query('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<TransactionStatsDto> {
    return await this.transactionsService.getStats(userId, startDate, endDate);
  }

  @Get('summary')
  @ApiOperation({
    summary: 'Obter resumo financeiro (receitas, despesas, saldo)',
  })
  @ApiQuery({ name: 'userId', description: 'ID do usuário', required: true })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Data inicial para filtro (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Data final para filtro (YYYY-MM-DD)',
  })
  @ApiResponse({
    status: 200,
    description: 'Resumo financeiro retornado com sucesso',
    schema: {
      type: 'object',
      properties: {
        totalIncome: { type: 'number', example: 5000.0 },
        totalExpense: { type: 'number', example: 3200.5 },
        balance: { type: 'number', example: 1799.5 },
        transactionCount: { type: 'number', example: 25 },
      },
    },
  })
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
  @ApiOperation({ summary: 'Obter gastos agrupados por categoria' })
  @ApiQuery({ name: 'userId', description: 'ID do usuário', required: true })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Data inicial para filtro (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Data final para filtro (YYYY-MM-DD)',
  })
  @ApiResponse({
    status: 200,
    description: 'Dados agrupados por categoria retornados com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          categoryId: { type: 'string', example: 'uuid-categoria' },
          categoryName: { type: 'string', example: 'Alimentação' },
          total: { type: 'number', example: 800.0 },
          count: { type: 'number', example: 15 },
          type: { type: 'string', example: 'expense' },
        },
      },
    },
  })
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
  @ApiOperation({ summary: 'Buscar transação por ID' })
  @ApiParam({ name: 'id', description: 'ID único da transação' })
  @ApiQuery({ name: 'userId', description: 'ID do usuário', required: true })
  @ApiResponse({
    status: 200,
    description: 'Transação encontrada com sucesso',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('userId') userId: string,
  ): Promise<TransactionResponseDto> {
    const transaction = await this.transactionsService.findOne(id, userId);
    return plainToInstance(TransactionResponseDto, transaction);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar transação' })
  @ApiParam({ name: 'id', description: 'ID único da transação' })
  @ApiQuery({ name: 'userId', description: 'ID do usuário', required: true })
  @ApiResponse({
    status: 200,
    description: 'Transação atualizada com sucesso',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
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
  @ApiOperation({ summary: 'Remover transação' })
  @ApiParam({ name: 'id', description: 'ID único da transação' })
  @ApiQuery({ name: 'userId', description: 'ID do usuário', required: true })
  @ApiResponse({
    status: 200,
    description: 'Transação removida com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Transação removida com sucesso' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('userId') userId: string,
  ): Promise<{ message: string }> {
    await this.transactionsService.remove(id, userId);
    return { message: 'Transação removida com sucesso' };
  }
}
