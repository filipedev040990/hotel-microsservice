import { CreateHotelController } from '@/controllers/hotel/create-hotel.controller'
import { ControllerInterface } from '@/domain/controller/controller.interface'
import { HotelRepositoryInterface } from '@/domain/repositories/hotel-repository.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { CreateHotelUseCaseInterface } from '@/domain/usecases/create-hotel-usecase.interface'
import { CreateHotelUseCase } from '@/usecases/hotel/create-hotel.usecase'
import { asClass, createContainer } from 'awilix'
import { HotelRepository } from '../database/hotel.repository'
import { LoggerService } from '@/shared/services/logger.service'

export type AppContainer = {
  hotelRepository: HotelRepositoryInterface
  loggerService: LoggerServiceInterface
  createHotelUseCase: CreateHotelUseCaseInterface
  createHotelController: ControllerInterface
}

const container = createContainer()

container.register({
  // Controllers
  createHotelController: asClass(CreateHotelController).singleton(),

  // UseCases
  createHotelUseCase: asClass(CreateHotelUseCase).singleton(),

  // Repositories
  hotelRepository: asClass(HotelRepository).singleton(),

  // Services
  loggerService: asClass(LoggerService).singleton()
})

export { container }
