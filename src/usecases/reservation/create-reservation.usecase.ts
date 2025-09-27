import { ReservationEntity } from '@/domain/entities/reservation/reservation.entity'
import { ReservartionRepositoryInterface, ReservationRepositoryData } from '@/domain/repositories/reservation-repository.interface'
import { RoomRepositoryInterface } from '@/domain/repositories/room-repository.interface'
import { CacheServiceInterface } from '@/domain/services/cache-service.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { QueueServiceInterface } from '@/domain/services/queue-service.interface'
import { ReservationMessagePublisherInterface } from '@/domain/services/reservation-message-publisher-service.interface'
import {
  CreateReservationUseCaseInput,
  CreateReservationUseCaseInterface,
  CreateReservationUseCaseOutput
} from '@/domain/usecases/reservation/create-reservation-usecase.interface'
import { AppContainer } from '@/infra/container/register'
import { HOTELS_CACHE_KEY, PAYMENT_STATUS, ROOM_STATUS } from '@/shared/constants'
import { InvalidParamError } from '@/shared/errors'

export class CreateReservationUseCase implements CreateReservationUseCaseInterface {
  private readonly reservationRepository: ReservartionRepositoryInterface
  private readonly roomRepository: RoomRepositoryInterface
  private readonly loggerService: LoggerServiceInterface
  private readonly cacheService: CacheServiceInterface
  private readonly queueService: QueueServiceInterface
  private readonly reservationMessagePublisher: ReservationMessagePublisherInterface

  constructor(params: AppContainer) {
    this.reservationRepository = params.reservationRepository
    this.roomRepository = params.roomRepository
    this.loggerService = params.loggerService
    this.cacheService = params.cacheService
    this.queueService = params.queueService
    this.reservationMessagePublisher = params.reservationMessagePublisher
  }

  async execute(input: CreateReservationUseCaseInput): Promise<CreateReservationUseCaseOutput> {
    try {
      const reservation = ReservationEntity.build(input)

      await this.checkRoomIsAvailable(reservation.roomId)
      await this.roomRepository.updateStatus(reservation.roomId, ROOM_STATUS.IN_PROCESS_BOOKING)
      await this.saveReservation(reservation)
      await this.reservationMessagePublisher.publishNewReservation(reservation)
      await this.cacheService.del(HOTELS_CACHE_KEY)

      this.loggerService.info('Reservation created', { reservationId: reservation.id })

      return {
        id: reservation.id,
        roomId: reservation.roomId,
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        status: reservation.status,
        paymentStatus: PAYMENT_STATUS.PROCESSING,
        createdAt: reservation.createdAt
      }
    } catch (error) {
      this.loggerService.error('CreateReservationUseCase error', { error })
      throw error
    }
  }

  async checkRoomIsAvailable(roomId: string): Promise<void> {
    const room = await this.reservationRepository.getRoomById(roomId)

    if (!room) {
      throw new InvalidParamError('roomId')
    }

    if (room.status !== ROOM_STATUS.AVAILABLE) {
      throw new InvalidParamError('This room already reserved')
    }
  }

  async saveReservation(reservation: ReservationEntity): Promise<void> {
    const repositoryInput: ReservationRepositoryData = {
      id: reservation.id,
      externalCode: reservation.externalCode,
      roomId: reservation.roomId,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      guestEmail: reservation.guestEmail,
      guestId: reservation.guestId,
      paymentCardToken: reservation.paymentDetails.cardToken,
      paymentMethod: reservation.paymentDetails.paymentMethod,
      paymentStatus: PAYMENT_STATUS.PROCESSING,
      paymentTotal: reservation.paymentDetails.total,
      status: reservation.status,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt,
      reason: null
    }

    await this.reservationRepository.save(repositoryInput)
  }
}
