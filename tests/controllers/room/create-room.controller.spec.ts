import { CreateRoomController } from '@/controllers/room/create-room.controller'
import { HttpRequest } from '@/domain/controller/controller.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { CreateRoomUseCaseInterface } from '@/domain/usecases/create-room-usecase.interface'
import { mock } from 'jest-mock-extended'

const params: any = {
  createRoomUseCase: mock<CreateRoomUseCaseInterface>(),
  loggerService: mock<LoggerServiceInterface>()
}

describe('CreateRoomController', () => {
  let sut: CreateRoomController
  let input: HttpRequest

  beforeEach(() => {
    sut = new CreateRoomController(params)
    input = {
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

    jest.spyOn(params.createRoomUseCase, 'execute').mockResolvedValue({ id: 'anyRoomId' })
  })

  test('should call CreateHotelUseCase.execute once and with correct values', async () => {
    await sut.execute(input)

    expect(params.createRoomUseCase.execute).toBeCalledTimes(1)
    expect(params.createRoomUseCase.execute).toBeCalledWith(input.body)
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)

    expect(output).toEqual({ statusCode: 201, body: { id: 'anyRoomId' } })
  })
})
