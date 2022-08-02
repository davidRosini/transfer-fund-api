import { Operation } from "./transaction.operation.enum";
import { Status } from "./transfer.status.enum";

export interface Transaction {
    account: string;
    value: number;
    operation: Operation;
    status: Status;
    message?: string;
    date?: Date;
}
