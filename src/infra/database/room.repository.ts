import { RoomRepositoryData, RoomRepositoryInterface } from '@/domain/repositories/room-repository.interface'
import { prismaClient } from './prisma-client'

export class RoomRepository implements RoomRepositoryInterface {
  async save (data: RoomRepositoryData): Promise<void> {
    await prismaClient.room.create({ data })
  }

  async getByNumberAndHotelId (number: number, hotelId: string): Promise<RoomRepositoryData | null> {
    const room = await prismaClient.room.findFirst({ where: { number, hotelId } })
    return room ?? null
  }
}
