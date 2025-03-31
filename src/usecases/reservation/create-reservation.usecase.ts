import { ReservationEntity } from '@/domain/entities/reservation/reservation.entity'
import { ReservartionRepositoryInterface, ReservationRepositoryData } from '@/domain/repositories/reservation-repository.interface'
import { RoomRepositoryInterface } from '@/domain/repositories/room-repository.interface'
import { CacheServiceInterface } from '@/domain/services/cache-service.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { PubSubServiceInterface } from '@/domain/services/pub-sub-service.interface'
import { CreateReservationUseCaseInput, CreateReservationUseCaseInterface, CreateReservationUseCaseOutput } from '@/domain/usecases/reservation/create-reservation-usecase.interface'
import { AppContainer } from '@/infra/container/register'
import { HOTELS_CACHE_KEY, PAYMENT_STATUS, RESERVATION_REQUEST_CHANNEL, RESERVATION_STATUS, ROOM_STATUS } from '@/shared/constants'
import { InvalidParamError } from '@/shared/errors'

export class CreateReservationUseCase implements CreateReservationUseCaseInterface {
  private readonly reservationRepository: ReservartionRepositoryInterface
  private readonly roomRepository: RoomRepositoryInterface
  private readonly pubSubService: PubSubServiceInterface
  private readonly loggerService: LoggerServiceInterface
  private readonly cacheService: CacheServiceInterface

  constructor (params: AppContainer) {
    this.reservationRepository = params.reservationRepository
    this.roomRepository = params.roomRepository
    this.pubSubService = params.pubSubService
    this.loggerService = params.loggerService
    this.cacheService = params.cacheService
  }

  async execute (input: CreateReservationUseCaseInput): Promise<CreateReservationUseCaseOutput> {
    try {
      const reservation = ReservationEntity.build(input)

      await this.checkRoomIsAvailable(reservation.roomId)
      await this.roomRepository.updateStatus(reservation.roomId, ROOM_STATUS.IN_PROCESS_BOOKING)
      await this.saveReservation(reservation)
      await this.subscribeChannel(reservation)
      await this.publishMessage(reservation)
      await this.cacheService.del(HOTELS_CACHE_KEY)

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

  async checkRoomIsAvailable (roomId: string): Promise<void> {
    const room = await this.reservationRepository.getRoomById(roomId)

    if (!room) {
      throw new InvalidParamError('roomId')
    }

    if (room.status !== ROOM_STATUS.AVAILABLE) {
      throw new InvalidParamError('This room already reserved')
    }
  }

  async subscribeChannel (reservation: ReservationEntity): Promise<void> {
    const channel = reservation.id

    this.loggerService.info(`Subscribed on channel: ${channel}`)

    await this.pubSubService.subscribe(channel, async (message: string) => {
      try {
        let data
        try {
          data = JSON.parse(message)
        } catch (parseError) {
          this.loggerService.error('Error parsing message', { message, parseError })
          return
        }

        let roomStatus
        let reservationStatus
        let paymentStatus

        if (data.status === PAYMENT_STATUS.CONFIRMED) {
          roomStatus = ROOM_STATUS.RESERVED
          reservationStatus = RESERVATION_STATUS.CONFIRMED
          paymentStatus = PAYMENT_STATUS.CONFIRMED
        } else {
          roomStatus = ROOM_STATUS.AVAILABLE
          reservationStatus = RESERVATION_STATUS.CANCELED
          paymentStatus = PAYMENT_STATUS.CANCELED
        }

        await this.roomRepository.updateStatus(data.roomId, roomStatus)
        await this.reservationRepository.updateStatus(data.id, reservationStatus, paymentStatus)
        await this.cacheService.del(HOTELS_CACHE_KEY)

        this.loggerService.info(`Reservation ${reservation.id} updated to status: ${reservationStatus}`)
      } catch (error) {
        this.loggerService.error(`Error processing message for reservation ${reservation.id}`, { error })
      }
    })
  }

  async publishMessage (reservation: ReservationEntity): Promise<void> {
    try {
      const channel = RESERVATION_REQUEST_CHANNEL
      const message = JSON.stringify({
        id: reservation.id,
        externalCode: reservation.externalCode,
        roomId: reservation.roomId,
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        guestEmail: reservation.guestEmail,
        paymentDetails: {
          paymentMethod: reservation.paymentDetails.paymentMethod,
          cardToken: reservation.paymentDetails.cardToken,
          total: reservation.paymentDetails.total
        }
      })
      await this.pubSubService.publish(channel, message)
      this.loggerService.info('Published message success', { channel, message })
    } catch (error) {
      this.loggerService.error('Publish message error', { error })
      throw error
    }
  }

  async saveReservation (reservation: ReservationEntity): Promise<void> {
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
      updatedAt: reservation.updatedAt
    }

    await this.reservationRepository.save(repositoryInput)
  }
}
