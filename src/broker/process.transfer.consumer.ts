import debug from "debug";
import RabbitMqService from "../common/services/rabbitmq.service";
import transferService from "../services/transfer.service";

import { Channel, ConsumeMessage } from "amqplib";

const log: debug.IDebugger = debug("app:process-transfer-sender-service");
const PROCESS_TRANFER_FUNDS_QUEUE: string = "process_transfer_funds_queue";

class ProcessTransferConsumer {
  private channel: Channel | undefined;

  private async getChannel(): Promise<Channel> {
    if (!this.channel) {
      this.channel = await RabbitMqService.createChannel();
    }
    return this.channel!;
  }

  consumer =
    (channel: Channel) =>
    async (msg: ConsumeMessage | null): Promise<void> => {
      log("Consuming message from queue: " + PROCESS_TRANFER_FUNDS_QUEUE);
      if (msg) {
        const transactionId = msg.content.toString();
        log("Processing transfer, transactionId: " + transactionId);
        const transferStatus = await transferService.processTransfer(
          transactionId
        );
        log("Transfer preocessed with status: " + transferStatus?.status);
        channel.ack(msg);
      }
    };

  async setupConsumer() {
    log("Setup consumer for queue: " + PROCESS_TRANFER_FUNDS_QUEUE);
    const channel = await this.getChannel();
    await channel.assertQueue(PROCESS_TRANFER_FUNDS_QUEUE);
    await channel.consume(PROCESS_TRANFER_FUNDS_QUEUE, this.consumer(channel));
  }
}

export default new ProcessTransferConsumer();
