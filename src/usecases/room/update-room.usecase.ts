import { RoomEntity } from '@/domain/entities/room/room.entity'
import { BuildRoomEntityInput } from '@/domain/entities/room/room.types'
import { RoomRepositoryData, RoomRepositoryInterface } from '@/domain/repositories/room-repository.interface'
import { CacheServiceInterface } from '@/domain/services/cache-service.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { UpdateRoomUseCaseInput, UpdateRoomUseCaseInterface } from '@/domain/usecases/room/update-room-usecase.interface'
import { AppContainer } from '@/infra/container/register'
import { HOTELS_CACHE_KEY } from '@/shared/constants'
import { ConflictResourceError, InvalidParamError, MissingParamError } from '@/shared/errors'

export class UpdateRoomUseCase implements UpdateRoomUseCaseInterface {
  private readonly roomRepository: RoomRepositoryInterface
  private readonly loggerService: LoggerServiceInterface
  private readonly cacheService: CacheServiceInterface

  constructor (params: AppContainer) {
    this.roomRepository = params.roomRepository
    this.loggerService = params.loggerService
    this.cacheService = params.cacheService
  }

  async execute (input: UpdateRoomUseCaseInput): Promise<RoomRepositoryData> {
    try {
      await this.validate(input)

      const roomExisting = await this.getRoom(input)

      const updatedRoom = RoomEntity.build(this.makeEntityInput(roomExisting, input))

      await this.roomRepository.update(updatedRoom)
      await this.cacheService.del(HOTELS_CACHE_KEY)

      return updatedRoom
    } catch (error) {
      this.loggerService.error('UpdateRoomUseCase error', { error })
      throw error
    }
  }

  async validate (input: UpdateRoomUseCaseInput): Promise<void> {
    if (!input.id) {
      throw new MissingParamError('id')
    }

    const { id, ...data } = input

    if (Object.keys(data).length === 0) {
      throw new InvalidParamError('Provide at least one field to update')
    }
  }

  async getRoom (input: UpdateRoomUseCaseInput): Promise<RoomRepositoryData> {
    const roomExisting = await this.roomRepository.getById(input.id)

    if (!roomExisting) {
      throw new InvalidParamError('id')
    }

    if (input.number && input.number !== roomExisting.number) {
      const roomWithThisNumber = await this.roomRepository.getByNumberAndHotelId(input.number, roomExisting.hotelId)

      if (roomWithThisNumber && roomWithThisNumber.id !== input.id) {
        throw new ConflictResourceError('A room with this number already exists for this hotel.')
      }
    }

    return roomExisting
  }

  makeEntityInput (roomExisting: RoomEntity, input: UpdateRoomUseCaseInput): BuildRoomEntityInput {
    return {
      id: roomExisting.id,
      externalCode: roomExisting.externalCode,
      number: input.number ?? roomExisting.number,
      description: input.description ?? roomExisting.description,
      type: input.type ?? roomExisting.type,
      amenities: input.amenities ?? roomExisting.amenities,
      capacity: input.capacity ?? roomExisting.capacity,
      floor: input.floor ?? roomExisting.floor,
      hotelId: roomExisting.hotelId,
      price: input.price ?? roomExisting.price,
      status: roomExisting.status,
      createdAt: roomExisting.createdAt,
      updatedAt: new Date()
    }
  }
}
