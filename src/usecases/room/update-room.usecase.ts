import { RoomEntity } from '@/domain/entities/room.entity'
import { BuildRoomEntityInput } from '@/domain/entities/room.types'
import { RoomRepositoryData, RoomRepositoryInterface } from '@/domain/repositories/room-repository.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { UpdateRoomUseCaseInput, UpdateRoomUseCaseInterface } from '@/domain/usecases/update-room-usecase.interface'
import { AppContainer } from '@/infra/container/register'
import { ConflictResourceError, InvalidParamError, MissingParamError } from '@/shared/errors'

export class UpdateRoomUseCase implements UpdateRoomUseCaseInterface {
  private readonly roomRepository: RoomRepositoryInterface
  private readonly loggerService: LoggerServiceInterface

  constructor (params: AppContainer) {
    this.roomRepository = params.roomRepository
    this.loggerService = params.loggerService
  }

  async execute (input: UpdateRoomUseCaseInput): Promise<RoomRepositoryData> {
    try {
      await this.validate(input)

      const roomExisting = await this.getRoom(input)

      const updatedRoom = RoomEntity.build(this.makeEntityInput(roomExisting, input))

      await this.roomRepository.update(updatedRoom)

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
