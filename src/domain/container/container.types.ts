import { HotelRepositoryInterface } from '../repositories/hotel-repository.interface'
import { LoggerServiceInterface } from '../services/logger-service.interface'

export type AppContainer = {
  hotelRepository: HotelRepositoryInterface
  loggerService: LoggerServiceInterface
}
