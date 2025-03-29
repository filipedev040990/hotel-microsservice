import { ReservationEntity } from '@/domain/entities/reservation/reservation.entity'
import { ReservartionRepositoryInterface } from '@/domain/repositories/reservation-repository.interface'
import { RoomRepositoryInterface } from '@/domain/repositories/room-repository.interface'
import { PubSubServiceInterface } from '@/domain/services/pub-sub-service.interface'
import { CreateReservationUseCaseInput, CreateReservationUseCaseInterface, CreateReservationUseCaseOutput } from '@/domain/usecases/hotel/create-reservation-usecase.interface'
import { AppContainer } from '@/infra/container/register'
import { PAYMENT_STATUS, RESERVATION_REQUEST_CHANNEL, ROOM_STATUS } from '@/shared/constants'
import { InvalidParamError } from '@/shared/errors'

export class CreateReservationUseCase implements CreateReservationUseCaseInterface {
  private readonly reservationRepository: ReservartionRepositoryInterface
  private readonly roomRepository: RoomRepositoryInterface
  private readonly pubSubService: PubSubServiceInterface

  constructor (params: AppContainer) {
    this.reservationRepository = params.reservationRepository
    this.roomRepository = params.roomRepository
    this.pubSubService = params.pubSubService
  }

  async execute (input: CreateReservationUseCaseInput): Promise<CreateReservationUseCaseOutput> {
    const reservation = ReservationEntity.build(input)

    await this.checkRoomIsAvailable(reservation.hotelId, reservation.roomId)
    await this.roomRepository.updateStatus(reservation.roomId, ROOM_STATUS.IN_PROCESS_BOOKING)
    await this.publishMessage(reservation)

    return {
      id: reservation.id,
      hotelId: reservation.hotelId,
      roomId: reservation.roomId,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      guestName: reservation.guestName,
      status: reservation.status,
      paymentStatus: PAYMENT_STATUS.PROCESSING,
      createdAt: reservation.createdAt
    }
  }

  async checkRoomIsAvailable (hotelId: string, roomId: string): Promise<void> {
    const room = await this.reservationRepository.getByHotelIdAndRoomId(hotelId, roomId)

    if (!room) {
      throw new InvalidParamError('roomId')
    }

    if (room.status !== ROOM_STATUS.AVAILABLE) {
      throw new InvalidParamError('This room already reserved')
    }
  }

  async publishMessage (reservation: ReservationEntity): Promise<void> {
    await this.pubSubService.publish(RESERVATION_REQUEST_CHANNEL, JSON.stringify({
      id: reservation.id,
      externalCode: reservation.externalCode,
      hotelId: reservation.hotelId,
      roomId: reservation.roomId,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      guestName: reservation.guestName,
      guestEmail: reservation.guestEmail,
      paymentDetails: {
        paymentMethod: reservation.paymentDetails.paymentMethod,
        cardToken: reservation.paymentDetails.cardToken,
        total: reservation.paymentDetails.total
      }
    }))
  }
}
