import { Transaction } from "./transaction.model";
import { Status } from "./transfer.status.enum";

export interface TransferFunds {
    transactionId: string;
    accountOrigin: string;
    accountDestination: string;
    value: number;
    status: Status;
    message?: string;
    createdAt: Date;
    updateAt: Date;
    transactions: Transaction[]
}

