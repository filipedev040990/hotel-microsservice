import { CreateHotelController } from '@/controllers/hotel/create-hotel.controller'
import { HttpRequest } from '@/domain/controller/controller.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { CreateHotelUseCaseInterface } from '@/domain/usecases/create-hotel-usecase.interface'
import { mock } from 'jest-mock-extended'

const params: any = {
  createHotelUseCase: mock<CreateHotelUseCaseInterface>(),
  loggerService: mock<LoggerServiceInterface>()
}

describe('CreateHotelController', () => {
  let sut: CreateHotelController
  let input: HttpRequest

  beforeEach(() => {
    sut = new CreateHotelController(params)
    input = {
      body: {
        name: 'Hotel Top',
        address: {
          country: 'Brazil',
          city: 'Barbacena',
          state: 'MG',
          district: 'Centro',
          street: 'Rua Teste',
          number: 123
        }
      }
    }

    jest.spyOn(params.createHotelUseCase, 'execute').mockResolvedValue({ id: 'anyHotelId' })
  })

  test('should call CreateHotelUseCase.execute once and with correct values', async () => {
    await sut.execute(input)

    expect(params.createHotelUseCase.execute).toBeCalledTimes(1)
    expect(params.createHotelUseCase.execute).toBeCalledWith(input.body)
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)

    expect(output).toEqual({ statusCode: 201, body: { id: 'anyHotelId' } })
  })
})
