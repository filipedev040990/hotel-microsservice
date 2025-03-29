import { HotelWithRoomData, ReservartionRepositoryInterface, ReservationRepositoryData } from '@/domain/repositories/reservation-repository.interface'
import { prismaClient } from './prisma-client'

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

  async updateStatus (reservationId: string, status: string): Promise<void> {
    await prismaClient.reservation.update({ where: { id: reservationId }, data: { status: status, paymentStatus: status } })
  }
}
