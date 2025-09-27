import { ReservationEntity } from '@/domain/entities/reservation/reservation.entity'
import { PaymentDetails } from '@/domain/entities/reservation/reservation.types'
import { ReservartionRepositoryInterface } from '@/domain/repositories/reservation-repository.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { ReservationMessagePublisherInterface } from '@/domain/services/reservation-message-publisher-service.interface'
import { ResendReservationPaymentMessageUseCaseInterface } from '@/domain/usecases/reservation/resend-reservation-payment-message-usecase.interface'
import { AppContainer } from '@/infra/container/register'
import { RESERVATION_STATUS } from '@/shared/constants'

export class ResendReservationPaymentMessageUseCase implements ResendReservationPaymentMessageUseCaseInterface {
  private readonly reservationRepository: ReservartionRepositoryInterface
  private readonly reservationMessagePublisher: ReservationMessagePublisherInterface
  private readonly loggerService: LoggerServiceInterface

  constructor(params: AppContainer) {
    this.reservationRepository = params.reservationRepository
    this.reservationMessagePublisher = params.reservationMessagePublisher
    this.loggerService = params.loggerService
  }

  async execute(): Promise<void> {
    this.loggerService.info('ResendReservationPaymentMessageUseCase.execute<called>')

    try {
      const reservations = await this.reservationRepository.getByStatus(RESERVATION_STATUS.PROCESSING)

      if (!reservations) {
        this.loggerService.warn('No reservations to resend payment message')
        return
      }

      for (const reservation of reservations) {
        const reservationMessage: ReservationEntity = {
          id: reservation.id,
          roomId: reservation.roomId,
          externalCode: reservation.externalCode,
          checkIn: reservation.checkIn,
          checkOut: reservation.checkOut,
          guestEmail: reservation.guestEmail,
          guestId: reservation.guestId,
          paymentDetails: {
            cardToken: reservation.paymentCardToken,
            paymentMethod: reservation.paymentMethod,
            total: reservation.paymentTotal
          },
          status: reservation.status,
          reason: reservation.reason ?? (null as any),
          createdAt: reservation.createdAt,
          updatedAt: reservation.updatedAt
        }

        await this.reservationMessagePublisher.publishNewReservation(reservationMessage)
      }
    } catch (error) {
      this.loggerService.error('ResendReservationPaymentMessageUseCase error', { error })
      throw error
    }
  }
}
