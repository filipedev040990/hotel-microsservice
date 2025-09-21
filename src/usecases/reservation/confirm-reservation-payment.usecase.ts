import { ReservartionRepositoryInterface } from '@/domain/repositories/reservation-repository.interface'
import { RoomRepositoryInterface } from '@/domain/repositories/room-repository.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import {
  ConfirmReservationPaymentUseCaseInput,
  ConfirmReservationPaymentUseCaseInterface
} from '@/domain/usecases/reservation/confirm-reservation-payment-usecase.interface'
import { AppContainer } from '@/infra/container/register'
import { PAYMENT_STATUS, RESERVATION_STATUS, ROOM_STATUS } from '@/shared/constants'
import { InvalidParamError, MissingParamError } from '@/shared/errors'

export class ConfirmReservationPaymentUseCase implements ConfirmReservationPaymentUseCaseInterface {
  private readonly reservationRepository: ReservartionRepositoryInterface
  private readonly roomRepository: RoomRepositoryInterface
  private readonly loggerService: LoggerServiceInterface

  constructor(params: AppContainer) {
    this.reservationRepository = params.reservationRepository
    this.roomRepository = params.roomRepository
    this.loggerService = params.loggerService
  }

  async execute(input: ConfirmReservationPaymentUseCaseInput): Promise<void> {
    try {
      const { reservationId, roomId, status } = this.validatedFields(input)

      this.validateStatus(status)

      await this.validateRoom(roomId)
      await this.validateRervation(reservationId)

      let roomStatus
      let reservationStatus
      let paymentStatus

      if (status === PAYMENT_STATUS.CONFIRMED) {
        roomStatus = ROOM_STATUS.RESERVED
        reservationStatus = RESERVATION_STATUS.CONFIRMED
        paymentStatus = PAYMENT_STATUS.CONFIRMED
      } else {
        roomStatus = ROOM_STATUS.AVAILABLE
        reservationStatus = RESERVATION_STATUS.CANCELED
        paymentStatus = PAYMENT_STATUS.CANCELED
      }

      await this.roomRepository.updateStatus(roomId, roomStatus)
      await this.reservationRepository.updateStatus(reservationId, reservationStatus, paymentStatus)
    } catch (error) {
      this.loggerService.error('ConfirmReservationPaymentUseCase error', { error })
      throw error
    }
  }

  private validatedFields(input: ConfirmReservationPaymentUseCaseInput): ConfirmReservationPaymentUseCaseInput {
    const requiredFields: Array<keyof ConfirmReservationPaymentUseCaseInput> = ['reservationId', 'roomId', 'status']
    for (const field of requiredFields) {
      if (!input[field]) {
        throw new MissingParamError(field)
      }
    }
    return input
  }

  private async validateRoom(roomId: string): Promise<void> {
    const room = await this.roomRepository.getById(roomId)
    if (!room) {
      throw new InvalidParamError('roomId')
    }
  }

  private async validateRervation(reservationId: string): Promise<void> {
    const reservation = await this.reservationRepository.getById(reservationId)
    if (!reservation) {
      throw new InvalidParamError('reservationId')
    }
  }

  private validateStatus(status: string): void {
    if (!Object.values(RESERVATION_STATUS).includes(status)) {
      throw new InvalidParamError('status')
    }
  }
}
