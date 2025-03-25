import { HotelRepositoryData, HotelRepositoryInterface } from '@/domain/repositories/hotel-repository.interface'
import { prismaClient } from './prisma-client'

export class HotelRepository implements HotelRepositoryInterface {
  async save (data: HotelRepositoryData): Promise<void> {
    await prismaClient.hotel.create({ data })
  }
}
