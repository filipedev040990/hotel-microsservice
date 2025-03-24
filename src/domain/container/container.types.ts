import { HotelRepositoryInterface } from '../repositories/hotel-repository.interface'
import { LoggerServiceInterface } from '../services/logger-service.interface'
import { CreateHotelUseCaseInterface } from '../usecases/create-hotel-usecase.interface'

export type AppContainer = {
  hotelRepository: HotelRepositoryInterface
  loggerService: LoggerServiceInterface
  createHotelUseCase: CreateHotelUseCaseInterface
}
