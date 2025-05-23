import { RoomEntity } from '@/domain/entities/room/room.entity'
import { HotelRepositoryInterface } from '@/domain/repositories/hotel-repository.interface'
import { RoomRepositoryInterface } from '@/domain/repositories/room-repository.interface'
import { CacheServiceInterface } from '@/domain/services/cache-service.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { CreateRoomUseCaseInput, CreateRoomUseCaseInterface } from '@/domain/usecases/room/create-room-usecase.interface'
import { AppContainer } from '@/infra/container/register'
import { HOTELS_CACHE_KEY } from '@/shared/constants'
import { ConflictResourceError, InvalidParamError } from '@/shared/errors'

export class CreateRoomUseCase implements CreateRoomUseCaseInterface {
  private readonly roomRepository: RoomRepositoryInterface
  private readonly loggerService: LoggerServiceInterface
  private readonly hotelRepository: HotelRepositoryInterface
  private readonly cacheService: CacheServiceInterface

  constructor (params: AppContainer) {
    this.roomRepository = params.roomRepository
    this.loggerService = params.loggerService
    this.hotelRepository = params.hotelRepository
    this.cacheService = params.cacheService
  }

  async execute (input: CreateRoomUseCaseInput): Promise<{ id: string }> {
    try {
      await this.validate(input)

      const room = RoomEntity.build({ status: 'available', ...input })
      await this.roomRepository.save(room)
      await this.cacheService.del(HOTELS_CACHE_KEY)

      return { id: room.id }
    } catch (error) {
      this.loggerService.error('CreateRoomUseCase error', { error })
      throw error
    }
  }

  async validate (input: CreateRoomUseCaseInput): Promise<void> {
    const hotelExisting = await this.hotelRepository.getById(input.hotelId)
    if (!hotelExisting) {
      throw new InvalidParamError('hotelId')
    }

    const roomExisting = await this.roomRepository.getByNumberAndHotelId(input.number, input.hotelId)
    if (roomExisting) {
      throw new ConflictResourceError('A room with this number already exists for this hotel.')
    }
  }
}
