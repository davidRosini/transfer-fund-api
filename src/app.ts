import * as http from "http";
import * as winston from "winston";
import * as expressWinston from "express-winston";

import cors from "cors";
import debug from "debug";
import express from "express";
import helmet from "helmet";

import MongoDBService from "./common/services/mongoose.service";
import RabbitMqService from "./common/services/rabbitmq.service";
import ProcessTransferConsumer from "./broker/process.transfer.consumer";
import ProcessTransferSender from "./broker/process.transfer.sender";

import { CommonRoutesConfig } from "./common/common.routes.config";
import { TransferRoutes } from "./routes/transfer.routes.config";

const log: debug.IDebugger = debug("app");

class App {
  private app: express.Application;
  private server: http.Server;

  private host: string;
  private port: number;

  private routes: Array<CommonRoutesConfig> = [];

  private loggerOptions: expressWinston.LoggerOptions;

  constructor(host: string = "localhost", port: number = 3000) {
    this.host = host;
    this.port = port;

    this.app = express();
    this.server = http.createServer(this.app);
    this.loggerOptions = this.getLoggerOptions();

    this.initializeMiddlewares();
    this.initializeLogger();
    this.initializeRoutes();
  }

  private getLoggerOptions(): expressWinston.LoggerOptions {
    return {
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
      ),
    };
  }

  private initializeMiddlewares() {
    log("Initialize middlewares...");
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
  }

  private initializeLogger() {
    log("Initialize loggers...");
    if (!process.env.DEBUG) {
      this.loggerOptions.meta = false;
    }
    this.app.use(expressWinston.logger(this.loggerOptions));
  }

  private initializeRoutes() {
    log("Initialize routes...");
    this.routes.push(new TransferRoutes(this.app));

    this.app.get("/", (req: express.Request, res: express.Response) => {
      res
        .status(200)
        .send(`Server running at http://${this.host}:${this.port}`);
    });
  }

  public startServer() {
    log("Starting server listening...");
    this.server.listen(this.port, () => {
      this.routes.forEach((route: CommonRoutesConfig) => {
        log(`Routes configured for ${route.getName()}`);
      });
      console.log(`Server running at http://${this.host}:${this.port}`);
    });
  }

  public connectToTheDatabase(host: string, port: number) {
    log("Connecting to Data Base...");
    MongoDBService.conectToDataBase(host, port);
  }

  public async setupQueue(
    host: string,
    port: number,
    user: string,
    pass: string
  ) {
    log("Connecting to Queue...");
    await RabbitMqService.conectToQueueService(host, port, user, pass);
    log("Setup sender...");
    await ProcessTransferSender.setupSender();
    log("Setup consumer...");
    await ProcessTransferConsumer.setupConsumer();
  }
}

export default App;
