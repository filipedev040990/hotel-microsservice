import { RoomEntity } from '@/domain/entities/room.entity'
import { RoomRepositoryInterface } from '@/domain/repositories/room-repository.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { CreateRoomUseCaseInput, CreateRoomUseCaseInterface } from '@/domain/usecases/create-room-usecase.interface'
import { AppContainer } from '@/infra/container/register'
import { ConflictResourceError } from '@/shared/errors'

export class CreateRoomUseCase implements CreateRoomUseCaseInterface {
  private readonly roomRepository: RoomRepositoryInterface
  private readonly loggerService: LoggerServiceInterface

  constructor (params: AppContainer) {
    this.roomRepository = params.roomRepository
    this.loggerService = params.loggerService
  }

  async execute (input: CreateRoomUseCaseInput): Promise<{ id: string }> {
    try {
      const room = RoomEntity.build({ status: 'available', ...input })

      const roomExisting = await this.roomRepository.getByNumberAndHotelId(room.number, room.hotelId)

      if (roomExisting) {
        throw new ConflictResourceError('A room with this number already exists for this hotel.')
      }

      await this.roomRepository.save(room)
      return { id: room.id }
    } catch (error) {
      this.loggerService.error('CreateRoomUseCase error', { error })
      throw error
    }
  }
}
