import mongooseService from "../common/services/mongoose.service";

import debug from "debug";

import { TransferFunds } from "../models/transfer.model";
import { UpdateTransferStatusDto } from "../dtos/update.transfer.status.dto";
import { UpdateTransactionStatusDto } from "../dtos/update.transaction.status.dto";

const log: debug.IDebugger = debug("app:transfer-dao");

class TransferFundDao {
  Schema = mongooseService.getMongoose().Schema;

  transferFundSchema = new this.Schema<TransferFunds>({
    transactionId: { type: String, unique: true },
    accountOrigin: String,
    accountDestination: String,
    value: Number,
    status: String,
    message: String,
    createdAt: Date,
    updateAt: Date,
    transactions: [
      {
        account: String,
        value: Number,
        operation: String,
        status: String,
        message: String,
        date: Date,
      },
    ],
  });

  TransferFund = mongooseService
    .getMongoose()
    .model<TransferFunds>("TransferFund", this.transferFundSchema);

  constructor() {
    log("Created new instance of TransferFundDao");
  }

  async saveTransfer(fields: TransferFunds) {
    log("Saving TransferFunds...transactionId: " + fields.transactionId);
    const transferFund = new this.TransferFund({
      transactionId: fields.transactionId,
      accountDestination: fields.accountDestination,
      accountOrigin: fields.accountOrigin,
      value: fields.value,
      status: fields.status,
      createdAt: fields.createdAt,
      updateAt: fields.updateAt,
    });
    fields.transactions.forEach((transaction) => {
      transferFund.transactions.push({
        account: transaction.account,
        value: transaction.value,
        status: transaction.status,
        operation: transaction.operation,
      });
    });
    await transferFund.save();
    log("TransferFunds saved, transactionId: " + fields.transactionId);
    return fields.transactionId;
  }

  async findTransferBy(transactionId: string): Promise<TransferFunds | null> {
    log("find TransferFunds by transactionId: " + transactionId);
    return this.TransferFund.findOne({ transactionId: transactionId }).exec();
  }

  async updateStatusBy(
    transactionId: string,
    dto: UpdateTransferStatusDto
  ): Promise<TransferFunds | null> {
    log(
      "Updating TransferFunds, status: " +
        dto.status +
        ", transactonId " +
        transactionId
    );
    return await this.TransferFund.findOneAndUpdate(
      { transactionId: transactionId },
      {
        $set: {
          status: dto.status,
          message: dto.message,
          updateAt: dto.updateAt,
        },
      },
      { new: true }
    ).exec();
  }

  async updateTransactionStatus(dto: UpdateTransactionStatusDto) {
    log(
      "Updating transaction, status: " +
        dto.status +
        ", transactionId: " +
        dto.transactionId +
        ", account: " +
        dto.account
    );
    await this.TransferFund.updateOne(
      {
        transactionId: dto.transactionId,
        transactions: {
          $elemMatch: { account: dto.account, operation: dto.operation },
        },
      },
      {
        $set: {
          "transactions.$.status": dto.status,
          "transactions.$.message": dto.message,
          "transactions.$.date": dto.date,
        },
      }
    ).exec();
  }
}

export default new TransferFundDao();
