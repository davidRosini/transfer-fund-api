import * as dotenv from "dotenv";

dotenv.config();

class Env {
  public appPort: number;
  public appHost: string;

  public dbPort: number;
  public dbHost: string;

  public accountApiUrl: string;

  public queueHost: string;
  public queuePort: number;
  public queueUser: string;
  public queuePass: string;

  constructor() {
    if (!process.env.APP_PORT) {
      console.log("APP_PORT not configuraded");
      process.exit(1);
    }
    this.appPort = parseInt(process.env.APP_PORT as string, 10);

    if (!process.env.APP_HOST) {
      console.log("APP_HOST not configuraded");
      process.exit(1);
    }
    this.appHost = process.env.APP_HOST as string;

    if (!process.env.DB_PORT) {
      console.log("DB_PORT not configuraded");
      process.exit(1);
    }
    this.dbPort = parseInt(process.env.DB_PORT as string, 10);

    if (!process.env.DB_HOST) {
      console.log("DB_HOST not configuraded");
      process.exit(1);
    }
    this.dbHost = process.env.DB_HOST as string;

    if (!process.env.ACCOUNT_API_URL) {
      console.log("ACCOUNT_API_URL not configuraded");
      process.exit(1);
    }
    this.accountApiUrl = process.env.ACCOUNT_API_URL as string;

    if (!process.env.QUEUE_HOST) {
      console.log("QUEUE_HOST not configuraded");
      process.exit(1);
    }
    this.queueHost = process.env.QUEUE_HOST as string;

    if (!process.env.QUEUE_PORT) {
      console.log("QUEUE_PORT not configuraded");
      process.exit(1);
    }
    this.queuePort = parseInt(process.env.QUEUE_PORT as string, 10);

    if (!process.env.QUEUE_USER) {
      console.log("QUEUE_USER not configuraded");
      process.exit(1);
    }
    this.queueUser = process.env.QUEUE_USER as string;

    if (!process.env.QUEUE_PASS) {
      console.log("QUEUE_PASS not configuraded");
      process.exit(1);
    }
    this.queuePass = process.env.QUEUE_PASS as string;
  }
}

export default new Env();
