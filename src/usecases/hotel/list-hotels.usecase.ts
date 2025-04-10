import { HotelRepositoryInterface } from '@/domain/repositories/hotel-repository.interface'
import { CacheServiceInterface } from '@/domain/services/cache-service.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { ListHotelsUseCaseInterface, ListHotelsUseCaseOutput } from '@/domain/usecases/hotel/list-hotels-usecase.interface'
import { AppContainer } from '@/infra/container/register'
import { HOTELS_CACHE_KEY } from '@/shared/constants'

export class ListHotelsUseCase implements ListHotelsUseCaseInterface {
  private readonly hotelRepository: HotelRepositoryInterface
  private readonly loggerService: LoggerServiceInterface
  private readonly cacheService: CacheServiceInterface

  constructor (params: AppContainer) {
    this.hotelRepository = params.hotelRepository
    this.loggerService = params.loggerService
    this.cacheService = params.cacheService
  }

  async execute (hotelId?: string): Promise<ListHotelsUseCaseOutput[]> {
    try {
      if (hotelId) {
        return await this.hotelRepository.find(hotelId)
      }

      const cachedHotels = await this.cacheService.get<ListHotelsUseCaseOutput[]>(HOTELS_CACHE_KEY)

      if (cachedHotels?.length) {
        return cachedHotels
      }

      const hotels = await this.hotelRepository.find()

      await this.cacheService.set(HOTELS_CACHE_KEY, hotels, 3600)

      return hotels
    } catch (error) {
      this.loggerService.error('ListHotelsUseCase error', { error })
      throw error
    }
  }
}
