import { UpdateRoomController } from '@/controllers/room/update-room.controller'
import { HttpRequest } from '@/domain/controller/controller.interface'
import { RoomRepositoryData } from '@/domain/repositories/room-repository.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { UpdateRoomUseCaseInterface } from '@/domain/usecases/room/update-room-usecase.interface'
import { mock } from 'jest-mock-extended'

const params: any = {
  updateRoomUseCase: mock<UpdateRoomUseCaseInterface>(),
  loggerService: mock<LoggerServiceInterface>()
}
const usecaseOutput: RoomRepositoryData = {
  id: 'anyId',
  externalCode: 'anyExternalCode',
  number: 123,
  description: 'Suite Presidencial',
  type: 'suite',
  capacity: 2,
  amenities: 'Wi-fi, TV a cabo, Ar condicionado',
  floor: 2,
  price: 80000,
  status: 'available',
  hotelId: 'anyHotelId',
  createdAt: new Date(),
  updatedAt: new Date()
}
describe('UpdateRoomController', () => {
  let sut: UpdateRoomController
  let input: HttpRequest

  beforeEach(() => {
    sut = new UpdateRoomController(params)
    input = {
      params: {
        id: 'anyRoomId'
      },
      body: {
        number: 123,
        description: 'Suite Presidencial',
        type: 'suite',
        capacity: 2,
        amenities: 'Wi-fi, TV a cabo, Ar condicionado',
        floor: 2,
        price: 80000,
        hotelId: 'anyHotelId'
      }
    }

    jest.spyOn(params.updateRoomUseCase, 'execute').mockResolvedValue(usecaseOutput)
  })

  test('should call UpdateHotelUseCase.execute once and with correct values', async () => {
    await sut.execute(input)

    expect(params.updateRoomUseCase.execute).toBeCalledTimes(1)
    expect(params.updateRoomUseCase.execute).toBeCalledWith({ id: input.params.id, ...input.body })
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)

    expect(output).toEqual({ statusCode: 200, body: usecaseOutput })
  })
})
