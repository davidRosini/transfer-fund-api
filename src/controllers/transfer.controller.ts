import debug from "debug";
import express from "express";
import transferService from "../services/transfer.service";

const log: debug.IDebugger = debug("app:transfer-controller");

class TransferController {
  async createTransfer(req: express.Request, res: express.Response) {
    log("Creating transfer...");
    const transfer = await transferService.create(req.body);
    log("Transfer created transactionId: " + transfer.transactionId);
    res.status(201).send({ transactionId: transfer.transactionId });
  }

  async getTransferStatus(req: express.Request, res: express.Response) {
    log("Get transfer status, transactionId: " + req.body.transactionId);
    const transferStatus = await transferService.findTransferStatusBy(
      req.body.transactionId
    );
    log("Transfer status: " + transferStatus);
    res.status(200).send(transferStatus);
  }

  async processTransfer(req: express.Request, res: express.Response) {
    log("Processing transfer, transactionId: " + req.body.transactionId);
    const transferStatus = await transferService.processTransfer(
      req.body.transactionId
    );
    log("Transfer preocessed with status: " + transferStatus?.status);
    res.status(200).send(transferStatus);
  }
}

export default new TransferController();
