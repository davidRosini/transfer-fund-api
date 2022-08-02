import express from "express";
import debug from "debug";

import AccountService from "../services/account.service";
import TransferService from "../services/transfer.service";

import { validate as uuidValidator } from "uuid";

const log: debug.IDebugger = debug("app:transfer-middleware");

class TransferMiddleware {
  async validateRequiredTransferBodyFields(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (
      req.body &&
      req.body.accountOrigin &&
      req.body.accountDestination &&
      req.body.value
    ) {
      next();
    } else {
      log(
        "Missing required fields accountOrigin and accountDestination and value"
      );
      res.status(400).send({
        error: `Missing required fields accountOrigin and accountDestination and value`,
      });
    }
  }

  async validateAccountsExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      log("Validate account origin: " + req.body.accountOrigin);
      await AccountService.findAccount(req.body.accountOrigin);
    } catch (err: any) {
      log("Invalid account origin: " + req.body.accountOrigin);
      res.status(404).send({
        error: `Invalid account origin`,
      });
      return;
    }

    try {
      log("Validate account destination: " + req.body.accountDestination);
      await AccountService.findAccount(req.body.accountDestination);
    } catch (err: any) {
      log("Invalid account destination: " + req.body.accountDestination);
      res.status(404).send({
        error: `Invalid account destination`,
      });
      return;
    }

    next();
  }

  async validateValue(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    log("Validate value: " + req.body.value);
    if (req.body.value > 0) {
      next();
    } else {
      log("Invalid value: " + req.body.value);
      res.status(400).send({
        error: `Invalid value is zero or negative`,
      });
    }
  }

  async validateTransactionId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    log("Validate transactionId format: " + req.params.transactionId);
    if (uuidValidator(req.params.transactionId)) {
      next();
    } else {
      log("Invalid transactionId format: " + req.params.transactionId);
      res.status(400).send({
        error: `Invalid transactionId format`,
      });
    }
  }

  async validateTransferExists(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    log("Validate transfer exists: " + req.params.transactionId);
    const transfer = await TransferService.findBy(req.params.transactionId);
    if (transfer) {
      next();
    } else {
      log("Transfer not found: " + req.params.transactionId);
      res.status(404).send({
        error: `Transaction ${req.params.transactionId} not found`,
      });
    }
  }

  async extractTransactionId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    req.body.transactionId = req.params.transactionId;
    next();
  }
}

export default new TransferMiddleware();
