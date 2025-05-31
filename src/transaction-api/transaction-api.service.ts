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
    limit = 1000,
  ) {
    //AK NEW USE IT
    let where: any = startDate || endDate ? {
        createdAt: Between(
            new Date(startDate || 0), 
            new Date(endDate || Date.now())
        )
    } : {};

    // let where: any = {};
    // if (startDate && endDate) {
    //   where.createdAt = Between(new Date(startDate), new Date(endDate));
    // } else if (startDate) {
    //   where.createdAt = Between(new Date(startDate), new Date());
    // } else if (endDate) {
    //   where.createdAt = Between(new Date(0), new Date(endDate));
    // }

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