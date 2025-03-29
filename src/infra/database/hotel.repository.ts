import { HotelRepositoryData, HotelRepositoryInterface } from '@/domain/repositories/hotel-repository.interface'
import { prismaClient } from './prisma-client'
import { ListHotelsUseCaseOutput } from '@/domain/usecases/hotel/list-hotels-usecase.interface'

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

  async find (hotelId?: string): Promise<ListHotelsUseCaseOutput[]> {
    const options: any = {
      select: {
        name: true,
        country: true,
        state: true,
        city: true,
        district: true,
        street: true,
        number: true,
        complement: true,
        Room: {
          select: {
            externalCode: true,
            number: true,
            type: true,
            capacity: true,
            description: true,
            price: true,
            status: true,
            amenities: true,
            floor: true
          }
        }
      }
    }

    if (hotelId) {
      options.where = { id: hotelId }
    }

    const output = await prismaClient.hotel.findMany(options)

    const formattedOutput: ListHotelsUseCaseOutput[] = output.map((hotel: any) => {
      return {
        name: hotel.name,
        address: {
          country: hotel.country,
          state: hotel.state,
          city: hotel.city,
          district: hotel.district,
          street: hotel.street,
          number: hotel.number,
          complement: hotel.complement
        },
        rooms: hotel.Room.map((room: any) => {
          return {
            externalCode: room.externalCode,
            number: room.number,
            type: room.type,
            capacity: room.capacity,
            description: room.description,
            price: room.price,
            status: room.status,
            amenities: room.amenities,
            floor: room.floor
          }
        })
      }
    })

    return formattedOutput
  }
}
