import client, { Connection, Channel } from "amqplib";
import debug from "debug";

const log: debug.IDebugger = debug("app:rabbitmq-service");

class RabbitMqService {
  private connection: Connection | undefined;

  constructor() {}

  public async conectToQueueService(
    host: string,
    port: number,
    user: string,
    pass: string
  ) {
    log("Attempting RabbitMQ connection...");
    this.connection = await client.connect(
      `amqp://${user}:${pass}@${host}:${port}`
    );
  }

  async createChannel(): Promise<Channel> {
    log("Creating a channel...");
    return await this.connection!.createChannel();
  }
}

export default new RabbitMqService();
