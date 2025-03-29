import { CreateHotelController } from '@/controllers/hotel/create-hotel.controller'
import { ControllerInterface } from '@/domain/controller/controller.interface'
import { HotelRepositoryInterface } from '@/domain/repositories/hotel-repository.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { CreateHotelUseCaseInterface } from '@/domain/usecases/hotel/create-hotel-usecase.interface'
import { CreateHotelUseCase } from '@/usecases/hotel/create-hotel.usecase'
import { asClass, createContainer } from 'awilix'
import { HotelRepository } from '../database/hotel.repository'
import { LoggerService } from '@/shared/services/logger.service'
import { UpdateHotelUseCaseInterface } from '@/domain/usecases/hotel/update-hotel-usecase.interface'
import { UpdateHotelUseCase } from '@/usecases/hotel/update-hotel.usecase'
import { UpdateHotelController } from '@/controllers/hotel/update-hotel.controller'
import { RoomRepositoryInterface } from '@/domain/repositories/room-repository.interface'
import { CreateRoomUseCaseInterface } from '@/domain/usecases/room/create-room-usecase.interface'
import { CreateRoomController } from '@/controllers/room/create-room.controller'
import { CreateRoomUseCase } from '@/usecases/room/create-room.usecase'
import { RoomRepository } from '../database/room.repository'
import { UpdateRoomUseCaseInterface } from '@/domain/usecases/room/update-room-usecase.interface'
import { UpdateRoomUseCase } from '@/usecases/room/update-room.usecase'
import { UpdateRoomController } from '@/controllers/room/update-room.controller'
import { ListHotelsUseCaseInterface } from '@/domain/usecases/hotel/list-hotels-usecase.interface'
import { ListHotelsUseCase } from '@/usecases/hotel/list-hotels.usecase'
import { ListHotelsController } from '@/controllers/hotel/list-hotels.controller'

export type AppContainer = {
  loggerService: LoggerServiceInterface
  createHotelController: ControllerInterface
  updateHotelController: ControllerInterface
  createHotelUseCase: CreateHotelUseCaseInterface
  updateHotelUseCase: UpdateHotelUseCaseInterface
  hotelRepository: HotelRepositoryInterface
  createRoomUseCase: CreateRoomUseCaseInterface
  createRoomController: ControllerInterface
  roomRepository: RoomRepositoryInterface
  updateRoomUseCase: UpdateRoomUseCaseInterface
  updateRoomController: ControllerInterface
  listHotelsUseCase: ListHotelsUseCaseInterface
  listHotelsController: ControllerInterface
}

const container = createContainer()

container.register({
  // Controllers
  createHotelController: asClass(CreateHotelController).singleton(),
  updateHotelController: asClass(UpdateHotelController).singleton(),
  createRoomController: asClass(CreateRoomController).singleton(),
  updateRoomController: asClass(UpdateRoomController).singleton(),
  listHotelsController: asClass(ListHotelsController).singleton(),

  // UseCases
  createHotelUseCase: asClass(CreateHotelUseCase).singleton(),
  updateHotelUseCase: asClass(UpdateHotelUseCase).singleton(),
  createRoomUseCase: asClass(CreateRoomUseCase).singleton(),
  updateRoomUseCase: asClass(UpdateRoomUseCase).singleton(),
  listHotelsUseCase: asClass(ListHotelsUseCase).singleton(),

  // Repositories
  hotelRepository: asClass(HotelRepository).singleton(),
  roomRepository: asClass(RoomRepository).singleton(),

  // Services
  loggerService: asClass(LoggerService).singleton()
})

export { container }
