import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Transaction,
  TransactionType,
} from '../transactions/entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionFiltersDto } from './dto/transaction-filters.dto';
import { TransactionStatsDto } from './dto/transaction-stats.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    // Converter tags array para JSON string
    const transactionData = {
      ...createTransactionDto,
      tags: createTransactionDto.tags
        ? JSON.stringify(createTransactionDto.tags)
        : null,
    };

    const transaction = this.transactionRepository.create(transactionData);
    return await this.transactionRepository.save(transaction);
  }

  async findAll(
    userId: string,
    filters: TransactionFiltersDto,
  ): Promise<{
    data: Transaction[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 20,
      orderBy = 'date',
      order = 'DESC',
      ...whereFilters
    } = filters;

    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.category', 'category')
      .where('transaction.userId = :userId', { userId });

    // Aplicar filtros
    if (whereFilters.type) {
      queryBuilder.andWhere('transaction.type = :type', {
        type: whereFilters.type,
      });
    }

    if (whereFilters.status) {
      queryBuilder.andWhere('transaction.status = :status', {
        status: whereFilters.status,
      });
    }

    if (whereFilters.categoryId) {
      queryBuilder.andWhere('transaction.categoryId = :categoryId', {
        categoryId: whereFilters.categoryId,
      });
    }

    if (whereFilters.startDate && whereFilters.endDate) {
      queryBuilder.andWhere(
        'transaction.date BETWEEN :startDate AND :endDate',
        {
          startDate: whereFilters.startDate,
          endDate: whereFilters.endDate,
        },
      );
    } else if (whereFilters.startDate) {
      queryBuilder.andWhere('transaction.date >= :startDate', {
        startDate: whereFilters.startDate,
      });
    } else if (whereFilters.endDate) {
      queryBuilder.andWhere('transaction.date <= :endDate', {
        endDate: whereFilters.endDate,
      });
    }

    if (whereFilters.minAmount !== undefined) {
      queryBuilder.andWhere('transaction.amount >= :minAmount', {
        minAmount: whereFilters.minAmount,
      });
    }

    if (whereFilters.maxAmount !== undefined) {
      queryBuilder.andWhere('transaction.amount <= :maxAmount', {
        maxAmount: whereFilters.maxAmount,
      });
    }

    if (whereFilters.search) {
      queryBuilder.andWhere(
        '(transaction.title ILIKE :search OR transaction.description ILIKE :search)',
        { search: `%${whereFilters.search}%` },
      );
    }

    if (whereFilters.tag) {
      queryBuilder.andWhere('transaction.tags LIKE :tag', {
        tag: `%"${whereFilters.tag}"%`,
      });
    }

    // Ordenação
    const validOrderBy = ['date', 'amount', 'title', 'createdAt'];
    const orderByField = validOrderBy.includes(orderBy) ? orderBy : 'date';
    queryBuilder.orderBy(`transaction.${orderByField}`, order);

    // Paginação
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    // Converter tags JSON string de volta para array
    const transactions = data.map((transaction) => ({
      ...transaction,
      tags: transaction.tags ? JSON.parse(transaction.tags) : [],
    }));

    return {
      data: transactions,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string, userId: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id, userId },
      relations: ['category'],
    });

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada');
    }

    // Converter tags JSON string para array
    transaction.tags = transaction.tags ? JSON.parse(transaction.tags) : [];

    return transaction;
  }

  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
    userId: string,
  ): Promise<Transaction> {
    const transaction = await this.findOne(id, userId);

    // Converter tags array para JSON string se fornecido
    const updateData = {
      ...updateTransactionDto,
      tags: updateTransactionDto.tags
        ? JSON.stringify(updateTransactionDto.tags)
        : transaction.tags,
    };

    Object.assign(transaction, updateData);
    const updated = await this.transactionRepository.save(transaction);

    // Converter tags de volta para array na resposta
    updated.tags = updated.tags ? JSON.parse(updated.tags) : [];

    return updated;
  }

  async remove(id: string, userId: string): Promise<void> {
    const transaction = await this.findOne(id, userId);
    await this.transactionRepository.remove(transaction);
  }

  async getStats(
    userId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<TransactionStatsDto> {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoin('transaction.category', 'category')
      .where('transaction.userId = :userId', { userId });

    if (startDate && endDate) {
      queryBuilder.andWhere(
        'transaction.date BETWEEN :startDate AND :endDate',
        {
          startDate,
          endDate,
        },
      );
    }

    const transactions = await queryBuilder
      .select([
        'transaction.amount',
        'transaction.type',
        'transaction.categoryId',
        'category.name',
        'transaction.date',
      ])
      .getMany();

    // Calcular estatísticas
    const totalIncome = transactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const balance = totalIncome - totalExpense;
    const transactionCount = transactions.length;
    const avgTransactionValue =
      transactionCount > 0
        ? (totalIncome + totalExpense) / transactionCount
        : 0;

    // Agrupar por categoria
    const categoryMap = new Map();
    transactions.forEach((transaction) => {
      const key = transaction.categoryId;
      if (!categoryMap.has(key)) {
        categoryMap.set(key, {
          categoryId: transaction.categoryId,
          categoryName: transaction.category?.name || 'Sem categoria',
          total: 0,
          count: 0,
          type: transaction.type,
        });
      }
      const category = categoryMap.get(key);
      category.total += Number(transaction.amount);
      category.count += 1;
    });

    const byCategory = Array.from(categoryMap.values());

    return {
      totalIncome,
      totalExpense,
      balance,
      transactionCount,
      avgTransactionValue,
      period: {
        startDate: startDate || '',
        endDate: endDate || '',
      },
      byCategory,
    };
  }
}
