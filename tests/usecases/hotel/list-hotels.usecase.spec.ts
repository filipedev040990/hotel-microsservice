import { HotelRepositoryInterface } from '@/domain/repositories/hotel-repository.interface'
import { CacheServiceInterface } from '@/domain/services/cache-service.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { ListHotelsUseCaseOutput } from '@/domain/usecases/hotel/list-hotels-usecase.interface'
import { ListHotelsUseCase } from '@/usecases/hotel/list-hotels.usecase'
import { mock } from 'jest-mock-extended'

const params: any = {
  hotelRepository: mock<HotelRepositoryInterface>(),
  loggerService: mock<LoggerServiceInterface>(),
  cacheService: mock<CacheServiceInterface>()
}

const hotelRepositoryOutput: ListHotelsUseCaseOutput [] = [{
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
      id: 'anyID',
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

describe('ListHotelsUseCase', () => {
  let sut: ListHotelsUseCase
  let hotelId: string

  beforeEach(() => {
    sut = new ListHotelsUseCase(params)
    hotelId = 'anyHotelId'
    jest.spyOn(params.hotelRepository, 'find').mockResolvedValue(hotelRepositoryOutput)
  })

  test('should call HotelRepository.list', async () => {
    await sut.execute(hotelId)

    expect(params.hotelRepository.find).toHaveBeenCalledTimes(1)
    expect(params.hotelRepository.find).toHaveBeenCalledWith(hotelId)
  })

  test('should call HotelRepository.list', async () => {
    hotelId = undefined as any
    await sut.execute(hotelId)

    expect(params.hotelRepository.find).toHaveBeenCalledTimes(1)
    expect(params.hotelRepository.find).toHaveBeenCalledWith(undefined)
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(hotelId)

    expect(output).toEqual(hotelRepositoryOutput)
  })
})
