import { ReservartionRepositoryInterface } from '@/domain/repositories/reservation-repository.interface'
import { RoomRepositoryInterface } from '@/domain/repositories/room-repository.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import {
  ConfirmReservationPaymentUseCaseInput,
  ConfirmReservationPaymentUseCaseInterface
} from '@/domain/usecases/reservation/confirm-reservation-payment-usecase.interface'
import { AppContainer } from '@/infra/container/register'
import { PAYMENT_STATUS, RESERVATION_STATUS, ROOM_STATUS } from '@/shared/constants'

export type ValidateRoomAndReservationOutput = {
  valid: boolean
  oldStatus?: string
}

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
      const missingParam = this.validatedParams(input)

      if (missingParam) {
        this.loggerService.error('Validation failed: missing required parameter', {
          requestId: input.requestId,
          missingParam,
          input
        })
        return
      }

      const { roomId, reservationId, status } = input

      const isValidStatus = this.validateStatus(status)

      if (!isValidStatus) {
        this.loggerService.error('Validation failed: invalid reservation status', {
          requestId: input.requestId,
          input,
          validStatuses: Object.values(RESERVATION_STATUS)
        })
        return
      }

      const room = await this.validateRoom(roomId)

      if (!room.valid) {
        this.loggerService.error('Validation failed: invalid roomId', {
          requestId: input.requestId,
          input
        })
        return
      }

      const reservation = await this.validateRervation(reservationId)

      if (!reservation.valid) {
        this.loggerService.error('Validation failed: invalid rerservationId', {
          requestId: input.requestId,
          input
        })
        return
      }

      let roomStatus
      let reservationStatus
      let paymentStatus
      const reason = input.reason ?? null

      if (status === PAYMENT_STATUS.CONFIRMED) {
        roomStatus = ROOM_STATUS.RESERVED
        reservationStatus = RESERVATION_STATUS.CONFIRMED
        paymentStatus = PAYMENT_STATUS.CONFIRMED
      } else {
        roomStatus = ROOM_STATUS.AVAILABLE
        reservationStatus = RESERVATION_STATUS.CANCELED
        paymentStatus = PAYMENT_STATUS.CANCELED
      }

      if (roomStatus !== room.oldStatus) {
        await this.roomRepository.updateStatus(roomId, roomStatus)
        this.loggerService.info('Room status updated', {
          requestId: input.requestId,
          previousStatus: room.oldStatus,
          newStatus: roomStatus
        })
      }

      if (reservationStatus !== reservation.oldStatus) {
        await this.reservationRepository.updateStatus(reservationId, reservationStatus, paymentStatus)
        this.loggerService.info('Reservation status updated', {
          requestId: input.requestId,
          previousStatus: reservation.oldStatus,
          newStatus: reservationStatus,
          reason
        })
      }
    } catch (error) {
      this.loggerService.error('ConfirmReservationPaymentUseCase error', {
        requestId: input.requestId,
        error
      })
      throw error
    }
  }

  private validatedParams(input: ConfirmReservationPaymentUseCaseInput): string | null {
    const requiredFields: Array<keyof ConfirmReservationPaymentUseCaseInput> = ['reservationId', 'roomId', 'status']
    for (const field of requiredFields) {
      if (!input[field]) {
        return field
      }
    }
    return null
  }

  private async validateRoom(roomId: string): Promise<ValidateRoomAndReservationOutput> {
    const room = await this.roomRepository.getById(roomId)
    if (!room) {
      return { valid: false }
    }
    return { valid: true, oldStatus: room.status }
  }

  private async validateRervation(reservationId: string): Promise<ValidateRoomAndReservationOutput> {
    const reservation = await this.reservationRepository.getById(reservationId)
    if (!reservation) {
      return { valid: false }
    }
    return { valid: true, oldStatus: reservation.status }
  }

  private validateStatus(status: string): boolean {
    if (!Object.values(RESERVATION_STATUS).includes(status)) {
      return false
    }

    return true
  }
}
