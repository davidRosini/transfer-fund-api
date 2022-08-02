import { Status } from "../models/transfer.status.enum";

export interface UpdateTransferStatusDto {
  status: Status;
  message?: string;
  updateAt: Date;
}
