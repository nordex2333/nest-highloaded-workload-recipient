import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionApiService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async getTransactions(
    startDate?: string,
    endDate?: string,
    page: number | string = 1,
    limit: number | string = 1000,
  ) {
    let pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
    let limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit;

    let where: any = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.$gte = new Date(startDate);
      if (endDate) where.createdAt.$lte = new Date(endDate);
    }

    let [items, totalItems] = await this.transactionRepository.findAndCount({
      where,
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      order: { createdAt: 'DESC' },
    });

    let totalPages = Math.ceil(totalItems / limitNum);

    return {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limitNum,
        totalPages,
        currentPage: pageNum,
      },
    };
  }
}