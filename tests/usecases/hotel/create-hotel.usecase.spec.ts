import { HotelEntity } from '@/domain/entities/hotel/hotel.entity'
import { HotelRepositoryInterface } from '@/domain/repositories/hotel-repository.interface'
import { CacheServiceInterface } from '@/domain/services/cache-service.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { CreateHotelUseCaseInput } from '@/domain/usecases/hotel/create-hotel-usecase.interface'
import { CreateHotelUseCase } from '@/usecases/hotel/create-hotel.usecase'
import { mock } from 'jest-mock-extended'
import MockDate from 'mockdate'

const fakeHotelEntity: HotelEntity = {
  id: 'anyHotelId',
  name: 'Hotel Top',
  externalCode: 'ABC-123',
  address: {
    country: 'Brazil',
    city: 'Barbacena',
    state: 'MG',
    district: 'Centro',
    street: 'Rua Teste',
    number: 123
  },
  createdAt: new Date('2025-03-01'),
  updatedAt: new Date('2025-03-01')
}

const params: any = {
  hotelRepository: mock<HotelRepositoryInterface>(),
  loggerService: mock<LoggerServiceInterface>(),
  cacheService: mock<CacheServiceInterface>()
}

describe('CreateHotelUseCase', () => {
  let sut: CreateHotelUseCase
  let input: CreateHotelUseCaseInput

  beforeAll(() => {
    MockDate.set(new Date('2025-03-01'))
  })

  beforeEach(() => {
    sut = new CreateHotelUseCase(params)
    input = {
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

    jest.spyOn(HotelEntity, 'build').mockReturnValue(fakeHotelEntity)
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call HotelEntity.build once and with correct values', async () => {
    const spy = jest.spyOn(HotelEntity, 'build')

    await sut.execute(input)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(input)
  })

  test('should call HotelRepository.save once and with correct values', async () => {
    await sut.execute(input)

    expect(params.hotelRepository.save).toHaveBeenCalledTimes(1)
    expect(params.hotelRepository.save).toHaveBeenCalledWith({
      id: 'anyHotelId',
      name: 'Hotel Top',
      externalCode: 'ABC-123',
      country: 'Brazil',
      city: 'Barbacena',
      state: 'MG',
      district: 'Centro',
      street: 'Rua Teste',
      number: 123,
      createdAt: new Date('2025-03-01'),
      updatedAt: new Date('2025-03-01')
    })
  })

  test('should throw if HotelRepository.save throws', async () => {
    const error = new Error('Test error')

    jest.spyOn(params.hotelRepository, 'save').mockImplementationOnce(() => {
      throw error
    })

    const promise = sut.execute(input)

    await expect(promise).rejects.toThrowError(error)
  })

  test('should return a correct response', async () => {
    const output = await sut.execute(input)

    expect(output).toEqual({ id: 'anyHotelId' })
  })

  test('should call CacheService.del', async () => {
    await sut.execute(input)

    expect(params.cacheService.del).toHaveBeenCalledTimes(1)
    expect(params.cacheService.del).toHaveBeenCalledWith('hotels_list')
  })
})
