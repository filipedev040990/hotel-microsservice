import { ListHotelsController } from '@/controllers/hotel/list-hotels.controller'
import { HttpRequest } from '@/domain/controller/controller.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { ListHotelsUseCaseInterface, ListHotelsUseCaseOutput } from '@/domain/usecases/hotel/list-hotels-usecase.interface'
import { mock } from 'jest-mock-extended'

const params: any = {
  listHotelsUseCase: mock<ListHotelsUseCaseInterface>(),
  loggerService: mock<LoggerServiceInterface>()
}

const useCaseOutput: ListHotelsUseCaseOutput [] = [{
  id: 'anyId',
  name: 'Grand Plaza Hotel',
  address: {
    country: 'USA',
    state: 'California',
    city: 'Los Angeles',
    district: 'Downtown',
    street: 'Main Street',
    number: 123,
    complement: 'Near Central Park'
  },
  rooms: [
    {
      id: 'anyId',
      externalCode: 'RM101',
      number: 101,
      type: 'Suite',
      capacity: 2,
      description: 'Luxury suite with sea view',
      price: 25000,
      status: 'available',
      amenities: 'Wi-Fi, TV, Air Conditioning, Mini Bar',
      floor: 10
    },
    {
      id: 'anotherId',
      externalCode: 'RM102',
      number: 102,
      type: 'Standard',
      capacity: 2,
      description: 'Comfortable room with a city view',
      price: 15000,
      status: 'occupied',
      amenities: 'Wi-Fi, TV, Air Conditioning',
      floor: 10
    }
  ]
}]

describe('ListHotelsController', () => {
  let sut: ListHotelsController
  let input: HttpRequest

  beforeEach(() => {
    sut = new ListHotelsController(params)
    input = {
      params: {
        id: 'anyHotelId'
      }
    }

    jest.spyOn(params.listHotelsUseCase, 'execute').mockResolvedValue(useCaseOutput)
  })

  test('should call ListHotelsUseCase.execute once and with correct values', async () => {
    await sut.execute(input)

    expect(params.listHotelsUseCase.execute).toBeCalledTimes(1)
    expect(params.listHotelsUseCase.execute).toBeCalledWith('anyHotelId')
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)

    expect(output).toEqual({ statusCode: 200, body: useCaseOutput })
  })
})
