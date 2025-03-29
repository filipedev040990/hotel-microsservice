import { UpdateHotelController } from '@/controllers/hotel/update-hotel.controller'
import { HttpRequest } from '@/domain/controller/controller.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { UpdateHotelUseCaseInterface } from '@/domain/usecases/hotel/update-hotel-usecase.interface'
import { mock } from 'jest-mock-extended'

const params: any = {
  updateHotelUseCase: mock<UpdateHotelUseCaseInterface>(),
  loggerService: mock<LoggerServiceInterface>()
}

const useCaseOutput = {
  id: 'anyHotelId',
  name: 'New Hotel Name',
  externalCode: 'ABC-123',
  country: 'Brasil',
  city: 'Barbacena',
  state: 'MG',
  district: 'Santa Luzia',
  street: 'XV de Novembro',
  number: 789,
  complement: 'Ao lado da Av. Brasil',
  createdAt: new Date('2025-03-01'),
  updatedAt: new Date('2025-03-01')
}

describe('UpdateHotelController', () => {
  let sut: UpdateHotelController
  let input: HttpRequest

  beforeEach(() => {
    sut = new UpdateHotelController(params)
    input = {
      params: {
        id: 'anyHotelId'
      },
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

    jest.spyOn(params.updateHotelUseCase, 'execute').mockResolvedValue(useCaseOutput)
  })

  test('should call CreateHotelUseCase.execute once and with correct values', async () => {
    await sut.execute(input)

    expect(params.updateHotelUseCase.execute).toBeCalledTimes(1)
    expect(params.updateHotelUseCase.execute).toBeCalledWith({
      id: 'anyHotelId',
      name: 'Hotel Top',
      address: {
        country: 'Brazil',
        city: 'Barbacena',
        state: 'MG',
        district: 'Centro',
        street: 'Rua Teste',
        number: 123
      }
    })
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)

    expect(output).toEqual({ statusCode: 200, body: useCaseOutput })
  })
})
