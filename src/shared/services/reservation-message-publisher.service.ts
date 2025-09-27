import { ReservationEntity } from '@/domain/entities/reservation/reservation.entity'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { QueueServiceInterface } from '@/domain/services/queue-service.interface'
import { ReservationMessagePublisherInterface } from '@/domain/services/reservation-message-publisher-service.interface'
import { AppContainer } from '@/infra/container/register'
import { NEW_RESERVATION_EXCHANGE_NAME, NEW_RESERVATION_ROUNTING_KEY_NAME } from '@/shared/constants'

export class ReservationMessagePublisher implements ReservationMessagePublisherInterface {
  private readonly queueService: QueueServiceInterface
  private readonly loggerService: LoggerServiceInterface

  constructor(params: AppContainer) {
    this.queueService = params.queueService
    this.loggerService = params.loggerService
  }

  async publishNewReservation(reservation: ReservationEntity): Promise<void> {
    const exchangeName = NEW_RESERVATION_EXCHANGE_NAME
    const routingKeyName = NEW_RESERVATION_ROUNTING_KEY_NAME

    const message = JSON.stringify({
      id: reservation.id,
      externalCode: reservation.externalCode,
      roomId: reservation.roomId,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      guestEmail: reservation.guestEmail,
      paymentDetails: reservation.paymentDetails
    })

    try {
      const isPublished = await this.queueService.publish(exchangeName, routingKeyName, message)

      this.loggerService.info(isPublished ? 'Published message success' : 'Published message failed', { exchangeName, routingKeyName, message })
    } catch (error) {
      this.loggerService.error('Publish message error', { error })
      throw error
    }
  }
}
