import { ReservartionRepositoryInterface, ReservationRepositoryData } from '@/domain/repositories/reservation-repository.interface'
import { RoomRepositoryInterface } from '@/domain/repositories/room-repository.interface'
import { CacheServiceInterface } from '@/domain/services/cache-service.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { CancelReservationUseCaseInput, CancelReservationUseCaseInterface } from '@/domain/usecases/reservation/cancel-reservation-usecase.interface'
import { AppContainer } from '@/infra/container/register'
import { HOTELS_CACHE_KEY, PAYMENT_STATUS, RESERVATION_STATUS, ROOM_STATUS } from '@/shared/constants'
import { InvalidParamError, MissingParamError } from '@/shared/errors'

export class CancelReservationUseCase implements CancelReservationUseCaseInterface {
  private readonly reservationRepository: ReservartionRepositoryInterface
  private readonly loggerService: LoggerServiceInterface
  private readonly cacheService: CacheServiceInterface
  private readonly roomRepository: RoomRepositoryInterface

  constructor (params: AppContainer) {
    this.reservationRepository = params.reservationRepository
    this.loggerService = params.loggerService
    this.cacheService = params.cacheService
    this.roomRepository = params.roomRepository
  }

  async execute (input: CancelReservationUseCaseInput): Promise<void> {
    try {
      const reservation = await this.getReservation(input)
      await this.reservationRepository.updateStatus(input.reservationId, RESERVATION_STATUS.CANCELED, PAYMENT_STATUS.REFUNDED)
      await this.roomRepository.updateStatus(reservation.roomId, ROOM_STATUS.AVAILABLE)
      await this.cacheService.del(HOTELS_CACHE_KEY)
    } catch (error) {
      this.loggerService.error('CancelReservationUseCase error', { error })
      throw error
    }
  }

  async getReservation (input: CancelReservationUseCaseInput): Promise<ReservationRepositoryData> {
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

    return reservation
  }
}
