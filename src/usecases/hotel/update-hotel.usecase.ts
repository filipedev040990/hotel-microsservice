import { HotelEntity } from '@/domain/entities/hotel.entity'
import { Address, BuildHotelEntityInput } from '@/domain/entities/hotel.types'
import { HotelRepositoryData, HotelRepositoryInterface } from '@/domain/repositories/hotel-repository.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { UpdateHotelUseCaseInput } from '@/domain/usecases/update-hotel-usecase.interface'
import { AppContainer } from '@/infra/container/register'
import { InvalidParamError, MissingParamError } from '@/shared/errors'

export class UpdateHotelUseCase {
  private readonly hotelRepository: HotelRepositoryInterface
  private readonly loggerService: LoggerServiceInterface

  constructor (params: AppContainer) {
    this.hotelRepository = params.hotelRepository
    this.loggerService = params.loggerService
  }

  async execute (input: UpdateHotelUseCaseInput): Promise<void> {
    try {
      this.validate(input)

      const hotelExisting = await this.getHotelById(input.id)

      const hotelEntity = HotelEntity.build(this.makeEntityInput(hotelExisting, input))

      const updatedHotel = await this.hotelRepository.update(this.makeRepositoryInput(hotelEntity))

      return updatedHotel
    } catch (error) {
      this.loggerService.error('UpdateHotelUseCase error', { error })
      throw error
    }
  }

  private validate (input: UpdateHotelUseCaseInput): void {
    const { id, name, address } = input

    if (!id) {
      throw new MissingParamError('id')
    }

    if (!name && this.isAddressEmptyOrInvalid(address)) {
      throw new InvalidParamError('Provide at least one field to update')
    }
  }

  private isAddressEmptyOrInvalid (address?: Address): boolean {
    return !address || Object.values(address).every(value => value == null || value === '')
  }

  private async getHotelById (hotelId: string): Promise<HotelRepositoryData> {
    const hotelExisting = await this.hotelRepository.getById(hotelId)

    if (!hotelExisting) {
      throw new InvalidParamError('id')
    }

    return hotelExisting
  }

  private makeEntityInput (existingHotel: HotelRepositoryData, input: UpdateHotelUseCaseInput): BuildHotelEntityInput {
    return {
      id: existingHotel.id,
      name: input.name ?? existingHotel.name,
      address: {
        country: input?.address?.country ?? existingHotel.country,
        state: input?.address?.state ?? existingHotel.state,
        city: input?.address?.city ?? existingHotel.city,
        district: input?.address?.district ?? existingHotel.district,
        street: input?.address?.street ?? existingHotel.street,
        number: input?.address?.number ?? existingHotel.number,
        complement: input?.address?.complement ?? existingHotel.complement
      },
      createdAt: existingHotel.createdAt,
      updatedAt: new Date()
    }
  }

  private makeRepositoryInput (hotel: HotelEntity): HotelRepositoryData {
    const { id, name, externalCode, address, createdAt, updatedAt } = hotel
    return {
      id,
      name,
      externalCode,
      ...address,
      createdAt,
      updatedAt
    }
  }
}
