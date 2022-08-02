import express from "express";
import TransferController from "../controllers/transfer.controller";
import TransferMiddleware from "../middleware/transfer.middleware";

import { CommonRoutesConfig } from "../common/common.routes.config";

export class TransferRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "TransferRoutes");
  }

  configureRoutes(): express.Application {
    this.app.route(`/api/fund-transfer`).post(
      TransferMiddleware.validateRequiredTransferBodyFields,
      TransferMiddleware.validateValue,
      // TransferMiddleware.validateAccountsExist, // high cost
      TransferController.createTransfer
    );
    this.app.param(`transactionId`, TransferMiddleware.extractTransactionId);
    this.app
      .route(`/api/fund-transfer/:transactionId`)
      .all(
        TransferMiddleware.validateTransactionId,
        TransferMiddleware.validateTransferExists
      )
      .get(TransferController.getTransferStatus);
    this.app
      .route(`/api/fund-transfer/:transactionId/process`)
      .all(
        TransferMiddleware.validateTransactionId,
        TransferMiddleware.validateTransferExists
      )
      .get(TransferController.processTransfer);

    return this.app;
  }
}
