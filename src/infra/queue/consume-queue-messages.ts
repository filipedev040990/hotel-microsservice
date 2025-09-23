import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { QueueServiceInterface } from '@/domain/services/queue-service.interface'
import { AppContainer } from '../container/register'
import { QUEUES } from '@/shared/constants'
import { ConfirmReservationPaymentUseCaseInterface } from '@/domain/usecases/reservation/confirm-reservation-payment-usecase.interface'
import { ConsumeQueueMessagesInterface } from '@/domain/queue/consume-queue-messages.interface'
import { getRequestId, runWithRequestContext } from './request-context'

export class ConsumeQueueMessages implements ConsumeQueueMessagesInterface {
  private readonly queueService: QueueServiceInterface
  private readonly loggerService: LoggerServiceInterface
  private readonly confirmReservationPaymentUseCase: ConfirmReservationPaymentUseCaseInterface

  constructor(params: AppContainer) {
    this.queueService = params.queueService
    this.loggerService = params.loggerService
    this.confirmReservationPaymentUseCase = params.confirmReservationPaymentUseCase
  }

  async execute(): Promise<void> {
    await this.queueService.start()

    for (const queue of QUEUES) {
      await this.queueService.consume(queue, async (message: any) => {
        await runWithRequestContext(async () => {
          try {
            const parsedMessage = JSON.parse(message.content.toString())
            const requestId = getRequestId()

            this.loggerService.info('Received message', {
              requestId,
              queueName: queue,
              receivedMessage: JSON.stringify(parsedMessage)
            })

            await this.handleMessage(queue, parsedMessage, requestId)
          } catch (error) {
            const requestId = getRequestId()
            this.loggerService.error('ConsumeQueueMessages error', { error, requestId })
            throw error
          }
        }, message.properties?.headers?.['x-request-id'])
      })
    }
  }

  async handleMessage(queueName: string, message: any, requestId: string): Promise<void> {
    switch (queueName) {
      case 'processed_reservation_payment':
        // eslint-disable-next-line no-case-declarations
        const input = { requestId, ...message }
        this.loggerService.info('ConfirmReservationPaymentUseCase.execute called', { input })
        await this.confirmReservationPaymentUseCase.execute(input)
        break
      default:
        break
    }
  }
}
