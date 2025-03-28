import { HotelRepositoryInterface } from '@/domain/repositories/hotel-repository.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { ListHotelsUseCaseInterface, ListHotelsUseCaseOutput } from '@/domain/usecases/list-hotels-usecase.interface'
import { AppContainer } from '@/infra/container/register'

export class ListHotelsUseCase implements ListHotelsUseCaseInterface {
  private readonly hotelRepository: HotelRepositoryInterface
  private readonly loggerService: LoggerServiceInterface

  constructor (params: AppContainer) {
    this.hotelRepository = params.hotelRepository
    this.loggerService = params.loggerService
  }

  async execute (hotelId?: string): Promise<ListHotelsUseCaseOutput[]> {
    try {
      const hotels = await this.hotelRepository.find(hotelId)
      return hotels
    } catch (error) {
      this.loggerService.error('ListHotelsUseCase error', { error })
      throw error
    }
  }
}
