import { Operation } from "../models/transaction.operation.enum";

export interface AccountTransferbalanceDto {
  accountNumber: string;
  value: number;
  type: Operation;
}
