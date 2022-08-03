import TransferDao from "../daos/transfer.dao";
import TransactionService from "./transaction.service";
import ProcessTransferSender from "../broker/process.transfer.sender";

import { CreateTransferDto } from "../dtos/create.transfer.dto";
import { UpdateTransferStatusDto } from "../dtos/update.transfer.status.dto";
import { Operation } from "../models/transaction.operation.enum";
import { Status } from "../models/transfer.status.enum";
import { TransferFunds } from "../models//transfer.model";

import { v4 as uuidv4 } from "uuid";

class TransferService {
  async create(dto: CreateTransferDto) {
    const transferFunds = this.createTransferFunds(dto);
    await TransferDao.saveTransfer(transferFunds);
    ProcessTransferSender.sendMessage(transferFunds.transactionId);
    return { transactionId: transferFunds.transactionId };
  }

  private createTransferFunds(dto: CreateTransferDto): TransferFunds {
    return {
      transactionId: uuidv4(),
      accountOrigin: dto.accountOrigin,
      accountDestination: dto.accountDestination,
      value: dto.value,
      status: Status.IN_QUEUE,
      createdAt: new Date(),
      updateAt: new Date(),
      transactions: [
        {
          account: dto.accountOrigin,
          value: dto.value,
          status: Status.IN_QUEUE,
          operation: Operation.DEBIT,
        },
        {
          account: dto.accountDestination,
          value: dto.value,
          status: Status.IN_QUEUE,
          operation: Operation.CREDIT,
        },
      ],
    };
  }

  async findBy(transactionId: string): Promise<TransferFunds | null> {
    const transferFunds = await TransferDao.findTransferBy(transactionId);
    return transferFunds;
  }

  async findTransferStatusBy(transactionId: string) {
    const transferFunds = await this.findBy(transactionId);
    return this.getTransferStatus(transferFunds!);
  }

  private getTransferStatus(transferFunds: TransferFunds) {
    if (transferFunds.status == Status.ERROR) {
      return {
        Status: transferFunds.status,
        Message: transferFunds.message,
      };
    }

    return { status: transferFunds.status };
  }

  async updateTransferStatus(
    transactionId: string,
    dto: UpdateTransferStatusDto
  ) {
    return await TransferDao.updateStatusBy(transactionId, dto);
  }

  async processTransfer(transactionId: string) {
    let transferFunds = await this.findBy(transactionId);

    if (Status.IN_QUEUE != transferFunds!.status) {
      return { status: transferFunds!.status };
    }

    transferFunds = await this.updateTransferStatus(
      transferFunds!.transactionId,
      {
        status: Status.PROCESSING,
        updateAt: new Date(),
      }
    );

    await this.processTransactions(transferFunds!);
    const status = await this.finalizeTransfer(transferFunds!.transactionId);
    return { status: status };
  }

  async processTransactions(transferFunds: TransferFunds) {
    if (Status.PROCESSING != transferFunds.status) {
      return transferFunds!.status;
    }

    const debitTransaction = transferFunds.transactions.find(
      (t) => t.operation == Operation.DEBIT
    );

    const trasactionStatus = await TransactionService.processTransaction(
      transferFunds.transactionId,
      debitTransaction!
    );

    if (trasactionStatus == Status.CONFIRMED) {
      const creditTransaction = transferFunds.transactions.find(
        (t) => t.operation == Operation.CREDIT
      );

      await TransactionService.processTransaction(
        transferFunds.transactionId,
        creditTransaction!
      );
    }
  }

  async finalizeTransfer(transactionId: string) {
    const transferFunds = await this.findBy(transactionId);

    const transactionsError = transferFunds?.transactions.some(
      (t) => t.status == Status.ERROR
    );

    if (transactionsError) {
      const errorMessage = transferFunds?.transactions.find(
        (t) => t.status == Status.ERROR
      )?.message;
      await this.updateTransferStatus(transferFunds!.transactionId, {
        status: Status.ERROR,
        message: errorMessage,
        updateAt: new Date(),
      });
      return Status.ERROR;
    }

    const transactionsConfirmed = transferFunds?.transactions.every(
      (t) => t.status == Status.CONFIRMED
    );

    if (transactionsConfirmed) {
      await this.updateTransferStatus(transferFunds!.transactionId, {
        status: Status.CONFIRMED,
        updateAt: new Date(),
      });
      return Status.CONFIRMED;
    }
  }
}

export default new TransferService();
