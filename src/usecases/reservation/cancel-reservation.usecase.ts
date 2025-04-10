import { ReservartionRepositoryInterface } from '@/domain/repositories/reservation-repository.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { CancelReservationUseCaseInput, CancelReservationUseCaseInterface } from '@/domain/usecases/reservation/cancel-reservation-usecase.interface'
import { AppContainer } from '@/infra/container/register'
import { PAYMENT_STATUS, RESERVATION_STATUS } from '@/shared/constants'
import { InvalidParamError, MissingParamError } from '@/shared/errors'

export class CancelReservationUseCase implements CancelReservationUseCaseInterface {
  private readonly reservationRepository: ReservartionRepositoryInterface
  private readonly loggerService: LoggerServiceInterface

  constructor (params: AppContainer) {
    this.reservationRepository = params.reservationRepository
    this.loggerService = params.loggerService
  }

  async execute (input: CancelReservationUseCaseInput): Promise<void> {
    try {
      await this.validate(input)
      await this.reservationRepository.updateStatus(input.reservationId, RESERVATION_STATUS.CANCELED, PAYMENT_STATUS.REFUNDED)
    } catch (error) {
      this.loggerService.error('CancelReservationUseCase error', { error })
      throw error
    }
  }

  async validate (input: CancelReservationUseCaseInput): Promise<void> {
    const { reservationId, guestId } = input

    if (!reservationId) {
      throw new MissingParamError('reservationId')
    }

    if (!guestId) {
      throw new MissingParamError('guestId')
    }

    const reservation = await this.reservationRepository.getById(reservationId)

    if (!reservation) {
      throw new InvalidParamError('reservationId')
    }

    if (reservation.guestId !== guestId || reservation.status !== RESERVATION_STATUS.CONFIRMED) {
      throw new InvalidParamError('This reservation cannot be cancelled')
    }
  }
}
