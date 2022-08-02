import * as dotenv from "dotenv";

dotenv.config();

class Env {
  public appPort: number;
  public appHost: string;

  public dbPort: number;
  public dbHost: string;

  public accountApiUrl: string;

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
  }
}

export default new Env();
