import { HotelRepositoryData, HotelRepositoryInterface } from '@/domain/repositories/hotel-repository.interface'
import { prismaClient } from './prisma-client'

export class HotelRepository implements HotelRepositoryInterface {
  async save (data: HotelRepositoryData): Promise<void> {
    await prismaClient.hotel.create({ data })
  }

  async update (input: HotelRepositoryData): Promise<void> {
    const { id, ...data } = input
    await prismaClient.hotel.update({ where: { id }, data })
  }

  async getById (id: string): Promise<HotelRepositoryData | null> {
    const hotel = await prismaClient.hotel.findFirst({ where: { id } })

    if (!hotel) {
      return null
    }

    const { complement, ...data } = hotel

    return {
      ...data,
      complement: complement ?? undefined
    }
  }
}
