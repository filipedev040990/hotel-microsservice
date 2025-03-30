import { ReservartionRepositoryInterface, ReservationRepositoryData } from '@/domain/repositories/reservation-repository.interface'
import { RoomRepositoryInterface } from '@/domain/repositories/room-repository.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { CheckoutReservationUseCaseInterface } from '@/domain/usecases/reservation/checkout-reservation-usecase.interface'
import { AppContainer } from '@/infra/container/register'
import { RESERVATION_STATUS, ROOM_STATUS } from '@/shared/constants'
import { InvalidParamError, MissingParamError } from '@/shared/errors'

export class CheckoutReservationUseCase implements CheckoutReservationUseCaseInterface {
  private readonly reservationRepository: ReservartionRepositoryInterface
  private readonly roomRepository: RoomRepositoryInterface
  private readonly loggerService: LoggerServiceInterface

  constructor (params: AppContainer) {
    this.reservationRepository = params.reservationRepository
    this.roomRepository = params.roomRepository
    this.loggerService = params.loggerService
  }

  async execute (reservationId: string): Promise<void> {
    try {
      const { id, roomId } = await this.getReservationById(reservationId)

      await this.reservationRepository.updateStatus(id, RESERVATION_STATUS.FINISHED)
      await this.roomRepository.updateStatus(roomId, ROOM_STATUS.AVAILABLE)
    } catch (error) {
      this.loggerService.error('CheckoutReservationUseCase error', { error })
      throw error
    }
  }

  async getReservationById (reservationId: string): Promise<ReservationRepositoryData> {
    if (!reservationId) {
      throw new MissingParamError('id')
    }

    const reservationExisting = await this.reservationRepository.getById(reservationId)
    if (!reservationExisting) {
      throw new InvalidParamError('id')
    }

    if (reservationExisting.status === RESERVATION_STATUS.FINISHED) {
      throw new InvalidParamError('This reservation already finished')
    }

    if (reservationExisting.status !== RESERVATION_STATUS.CONFIRMED) {
      throw new InvalidParamError('This reservation is not confirmed')
    }

    return reservationExisting
  }
}
