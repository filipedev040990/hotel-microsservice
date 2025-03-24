import { AppContainer } from '@/domain/container/container.types'
import { HotelEntity } from '@/domain/entities/hotel.entity'
import { HotelRepositoryData, HotelRepositoryInterface } from '@/domain/repositories/hotel-repository.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { CreateHotelUseCaseInput, CreateHotelUseCaseInterface } from '@/domain/usecases/create-hotel-usecase.interface'

export class CreateHotelUseCase implements CreateHotelUseCaseInterface {
  private readonly hotelRepository: HotelRepositoryInterface
  private readonly loggerService: LoggerServiceInterface

  constructor (params: AppContainer) {
    this.hotelRepository = params.hotelRepository
    this.loggerService = params.loggerService
  }

  async execute (input: CreateHotelUseCaseInput): Promise<{ id: string }> {
    try {
      const hotel = HotelEntity.build(input)
      await this.hotelRepository.save(this.makeRepositoryInput(hotel))
      return { id: hotel.id }
    } catch (error) {
      this.loggerService.error('CreateHotelUseCase error', { error })
      throw error
    }
  }

  makeRepositoryInput (hotel: HotelEntity): HotelRepositoryData {
    const { id, name, externalCode, address, createdAt, updatedAt } = hotel
    return {
      id,
      name,
      externalCode,
      country: address.country,
      city: address.city,
      state: address.state,
      district: address.district,
      street: address.street,
      number: address.number,
      complement: address?.complement,
      createdAt,
      updatedAt
    }
  }
}
