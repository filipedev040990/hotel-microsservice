import { QueueServiceInterface } from '@/domain/services/queue-service.interface'
import { RABBIT_MQ_URI } from '../constants'
import * as amqp from 'amqplib'

export class QueueService implements QueueServiceInterface {
  private connection!: Awaited<ReturnType<typeof amqp.connect>>
  private channel!: amqp.Channel
  private readonly uri: string

  constructor() {
    this.uri = RABBIT_MQ_URI
  }

  async start(): Promise<void> {
    this.connection = await amqp.connect(this.uri)
    this.channel = await this.connection.createChannel()
  }

  async consume(queue: string, callback: Function): Promise<any> {
    await this.channel.assertQueue(queue, { durable: true })
    await this.channel.consume(queue, async (message) => {
      if (message) {
        await callback(message)
        this.channel.ack(message)
      }
    })
  }

  async publish(exchange: string, routingKey: string, message: string): Promise<boolean> {
    await this.start()
    await this.channel.assertExchange(exchange, 'direct', { durable: true })
    return this.channel.publish(exchange, routingKey, Buffer.from(message), { persistent: true })
  }

  async close(): Promise<void> {
    await this.channel.close()
  }
}
