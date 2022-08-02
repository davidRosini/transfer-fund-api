import { Operation } from "../models/transaction.operation.enum";
import { Status } from "../models/transfer.status.enum";

export interface UpdateTransactionStatusDto {
  transactionId: string;
  account: string;
  operation: Operation;
  status: Status;
  message?: string;
  date?: Date;
}
