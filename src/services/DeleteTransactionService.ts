import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionsRepository.findOne({ where: { id } });
    const balance = await transactionsRepository.getBalance();

    if (!transaction) {
      throw new AppError('Transaction does not exists');
    }

    if (balance.total - transaction.value < 0) {
      throw new AppError(
        'Operation cannot be completed, balance will be less than zero',
      );
    }

    await transactionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
