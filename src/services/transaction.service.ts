import AccountService from "./account.service";
import TransactionDao from "../daos/transfer.dao";

import { Status } from "../models/transfer.status.enum";
import { Transaction } from "../models/transaction.model";

class TransactionService {
  async processTransaction(transactionId: string, transaction: Transaction) {
    if (Status.IN_QUEUE != transaction.status) {
      return transaction.status;
    }

    await TransactionDao.updateTransactionStatus({
      transactionId: transactionId,
      account: transaction.account,
      operation: transaction.operation,
      status: Status.PROCESSING,
      date: new Date(),
    });

    transaction.status = Status.PROCESSING;

    return await this.executeAccountTransfer(transactionId, transaction);
  }

  async executeAccountTransfer(
    transactionId: string,
    transaction: Transaction
  ) {
    if (Status.PROCESSING != transaction.status) {
      return transaction.status;
    }

    try {
      await AccountService.transferBalance({
        accountNumber: transaction.account,
        value: transaction.value,
        type: transaction.operation,
      });
      await TransactionDao.updateTransactionStatus({
        transactionId: transactionId,
        account: transaction.account,
        operation: transaction.operation,
        status: Status.CONFIRMED,
        date: new Date(),
      });
      return Status.CONFIRMED;
    } catch (e: any) {
      await TransactionDao.updateTransactionStatus({
        transactionId: transactionId,
        account: transaction.account,
        operation: transaction.operation,
        status: Status.ERROR,
        date: new Date(),
        message: e.message,
      });
      return Status.ERROR;
    }
  }
}

export default new TransactionService();
