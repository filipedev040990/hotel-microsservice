import { HotelWithRoomData, ReservartionRepositoryInterface, ReservationRepositoryData } from '@/domain/repositories/reservation-repository.interface'
import { prismaClient } from './prisma-client'
import { ListReservationsOutput } from '@/domain/usecases/reservation/list-reservations-by-guest-id-usecase.interface'

export class ReservationRepository implements ReservartionRepositoryInterface {
  async save (data: ReservationRepositoryData): Promise<void> {
    await prismaClient.reservation.create({ data })
  }

  async getRoomById (roomId: string): Promise<HotelWithRoomData | null> {
    const room = await prismaClient.room.findFirst({ where: { id: roomId } })

    if (!room) {
      return null
    }

    return {
      roomId: room.id,
      status: room.status
    }
  }

  async updateStatus (reservationId: string, status: string, paymentStatus?: string, reason?: string): Promise<void> {
    const data: { status: string, paymentStatus?: string, reason?: string } = { status: status }

    if (paymentStatus) {
      data.paymentStatus = paymentStatus
    }

    if (reason) {
      data.reason = reason
    }

    await prismaClient.reservation.update({ where: { id: reservationId }, data })
  }

  async getById (reservationId: string): Promise<ReservationRepositoryData | null> {
    const reservation = await prismaClient.reservation.findFirst({ where: { id: reservationId } })

    if (!reservation) {
      return null
    }

    return {
      id: reservation.id,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      externalCode: reservation.externalCode,
      guestEmail: reservation.guestEmail,
      guestId: reservation.guestId,
      paymentCardToken: reservation.paymentCardToken,
      paymentMethod: reservation.paymentCardToken,
      status: reservation.status,
      reason: reservation.reason ?? undefined,
      roomId: reservation.roomId,
      paymentStatus: reservation.paymentStatus,
      paymentTotal: reservation.paymentTotal,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt
    }
  }

  async get (guestId?: string): Promise<ListReservationsOutput[] | null> {
    const options: any = {
      select: {
        id: true,
        externalCode: true,
        checkIn: true,
        checkOut: true,
        status: true,
        reason: true,
        guestId: true,
        room: {
          select: {
            id: true,
            number: true,
            type: true,
            capacity: true,
            price: true,
            amenities: true,
            floor: true,
            hotel: {
              select: {
                name: true,
                country: true,
                state: true,
                city: true,
                district: true,
                street: true,
                number: true,
                complement: true
              }
            }
          }
        }
      }
    }

    if (guestId) {
      options.where = {
        guestId
      }
    }

    const reservations = await prismaClient.reservation.findMany(options)

    if (!reservations) {
      return null
    }

    const output: ListReservationsOutput[] = reservations.map((reservation: any) => {
      return {
        hotel: {
          name: reservation.room.hotel.name,
          address: {
            country: reservation.room.hotel.country,
            state: reservation.room.hotel.state,
            city: reservation.room.hotel.city,
            district: reservation.room.hotel.district,
            street: reservation.room.hotel.street,
            number: reservation.room.hotel.number,
            complement: reservation.room.hotel.complement
          }
        },
        room: {
          id: reservation.room.id,
          number: reservation.room.number,
          type: reservation.room.type,
          capacity: reservation.room.capacity,
          description: reservation.room.description,
          price: reservation.room.price,
          amenities: reservation.room.amenities,
          floor: reservation.room.floor
        },
        reservation: {
          id: reservation.id,
          externalCode: reservation.externalCode,
          checkIn: reservation.checkIn,
          checkOut: reservation.checkOut,
          status: reservation.status,
          reason: reservation.reason,
          guestId: reservation.guestId
        }
      }
    })

    return output
  }
}
