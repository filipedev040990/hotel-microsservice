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
}
