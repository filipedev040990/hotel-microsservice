import { HotelWithRoomData, ReservartionRepositoryInterface, ReservationRepositoryData } from '@/domain/repositories/reservation-repository.interface'
import { prismaClient } from './prisma-client'
import { ListReservationsByGuestIdOutput } from '@/domain/usecases/reservation/list-reservations-by-guest-id-usecase.interface'

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

  async updateStatus (reservationId: string, status: string, paymentStatus?: string): Promise<void> {
    const data: { status: string, paymentStatus?: string } = { status: status }

    if (paymentStatus) {
      data.paymentStatus = paymentStatus
    }

    await prismaClient.reservation.update({ where: { id: reservationId }, data })
  }

  async getById (reservationId: string): Promise<ReservationRepositoryData | null> {
    const reservation = await prismaClient.reservation.findFirst({ where: { id: reservationId } })
    return reservation ?? null
  }

  async getByGuestId (guestId: string): Promise<ListReservationsByGuestIdOutput[] | null> {
    const reservations = await prismaClient.reservation.findMany({
      where: {
        guestId
      },
      select: {
        checkIn: true,
        checkOut: true,
        status: true,
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
    }) as any

    if (!reservations) {
      return null
    }

    const output: ListReservationsByGuestIdOutput[] = reservations.map((reservation: any) => {
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
          checkIn: reservation.checkIn,
          checkOut: reservation.checkOut,
          status: reservation.status
        }
      }
    })

    return output
  }
}
