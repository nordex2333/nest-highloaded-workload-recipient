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
    page = 1,
    limit = 100,
  ) {
    let where: any = startDate || endDate ? {
        createdAt: Between(
            new Date(startDate || 0), 
            new Date(endDate || Date.now())
        )
    } : {};

    let [items, totalItems] = await this.transactionRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    let totalPages = Math.ceil(totalItems / limit);

    return {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }
}