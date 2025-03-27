import { CreateHotelController } from '@/controllers/hotel/create-hotel.controller'
import { ControllerInterface } from '@/domain/controller/controller.interface'
import { HotelRepositoryInterface } from '@/domain/repositories/hotel-repository.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { CreateHotelUseCaseInterface } from '@/domain/usecases/create-hotel-usecase.interface'
import { CreateHotelUseCase } from '@/usecases/hotel/create-hotel.usecase'
import { asClass, createContainer } from 'awilix'
import { HotelRepository } from '../database/hotel.repository'
import { LoggerService } from '@/shared/services/logger.service'
import { UpdateHotelUseCaseInterface } from '@/domain/usecases/update-hotel-usecase.interface'
import { UpdateHotelUseCase } from '@/usecases/hotel/update-hotel.usecase'
import { UpdateHotelController } from '@/controllers/hotel/update-hotel.controller'
import { RoomRepositoryInterface } from '@/domain/repositories/room-repository.interface'
import { CreateRoomUseCaseInterface } from '@/domain/usecases/create-room-usecase.interface'

export type AppContainer = {
  hotelRepository: HotelRepositoryInterface
  loggerService: LoggerServiceInterface
  createHotelUseCase: CreateHotelUseCaseInterface
  createHotelController: ControllerInterface
  updateHotelUseCase: UpdateHotelUseCaseInterface
  updateHotelController: ControllerInterface
  roomRepository: RoomRepositoryInterface
  createRoomUseCase: CreateRoomUseCaseInterface
}

const container = createContainer()

container.register({
  // Controllers
  createHotelController: asClass(CreateHotelController).singleton(),
  updateHotelController: asClass(UpdateHotelController).singleton(),

  // UseCases
  createHotelUseCase: asClass(CreateHotelUseCase).singleton(),
  updateHotelUseCase: asClass(UpdateHotelUseCase).singleton(),

  // Repositories
  hotelRepository: asClass(HotelRepository).singleton(),

  // Services
  loggerService: asClass(LoggerService).singleton()
})

export { container }
