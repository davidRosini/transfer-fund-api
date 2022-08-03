import debug from "debug";
import RabbitMqService from "../common/services/rabbitmq.service";

import { Channel } from "amqplib";

const log: debug.IDebugger = debug("app:process-transfer-sender-service");
const PROCESS_TRANFER_FUNDS_QUEUE: string = "process_transfer_funds_queue";

class ProcessTransferSender {
  private channel: Channel | undefined;

  private async getChannel(): Promise<Channel> {
    if (!this.channel) {
      this.channel = await RabbitMqService.createChannel();
    }
    return this.channel!;
  }

  async sendMessage(message: string) {
    log("Sending message to queue: " + PROCESS_TRANFER_FUNDS_QUEUE);
    const channel = await this.getChannel();
    channel.sendToQueue(PROCESS_TRANFER_FUNDS_QUEUE, Buffer.from(message));
  }

  async setupSender() {
    log("Setup sender for queue: " + PROCESS_TRANFER_FUNDS_QUEUE);
    const channel = await this.getChannel();
    await channel.assertQueue(PROCESS_TRANFER_FUNDS_QUEUE);
  }
}

export default new ProcessTransferSender();
