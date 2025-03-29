import { HotelEntity } from '@/domain/entities/hotel/hotel.entity'
import { HotelRepositoryInterface } from '@/domain/repositories/hotel-repository.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { UpdateHotelUseCaseInput } from '@/domain/usecases/hotel/update-hotel-usecase.interface'
import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { UpdateHotelUseCase } from '@/usecases/hotel/update-hotel.usecase'
import { mock } from 'jest-mock-extended'
import MockDate from 'mockdate'

const fakeHotelEntity: HotelEntity = {
  id: 'anyHotelId',
  name: 'New Hotel Name',
  externalCode: 'ABC-123',
  address: {
    country: 'Brasil',
    city: 'Barbacena',
    state: 'MG',
    district: 'Santa Luzia',
    street: 'XV de Novembro',
    number: 789,
    complement: 'Ao lado da Av. Brasil'
  },
  createdAt: new Date('2025-03-01'),
  updatedAt: new Date('2025-03-01')
}

const fakeHotelRepositoryData = {
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
}

const params: any = {
  hotelRepository: mock<HotelRepositoryInterface>(),
  loggerService: mock<LoggerServiceInterface>()
}

describe('UpdateHotelUseCase', () => {
  let sut: UpdateHotelUseCase
  let input: UpdateHotelUseCaseInput

  beforeAll(() => {
    MockDate.set(new Date())
  })

  beforeEach(() => {
    sut = new UpdateHotelUseCase(params)
    input = {
      id: 'anyHotelId',
      name: 'New Hotel Name',
      address: {
        country: 'Brasil',
        city: 'Barbacena',
        state: 'MG',
        district: 'Santa Luzia',
        street: 'XV de Novembro',
        number: 789,
        complement: 'Ao lado da Av. Brasil'
      }
    }
    jest.spyOn(HotelEntity, 'build').mockReturnValue(fakeHotelEntity)
    jest.spyOn(params.hotelRepository, 'getById').mockResolvedValue(fakeHotelRepositoryData)
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should throw if id is not provided', async () => {
    input.id = undefined as any

    const promise = sut.execute(input)

    await expect(promise).rejects.toThrowError(new MissingParamError('id'))
  })

  test('should throw if all fields are empty', async () => {
    input.name = undefined as any
    input.address = undefined as any

    const promise = sut.execute(input)

    await expect(promise).rejects.toThrowError(new InvalidParamError('Provide at least one field to update'))
  })

  test('should call HotelRepository.getById once and with correct id', async () => {
    await sut.execute(input)

    expect(params.hotelRepository.getById).toHaveBeenCalledTimes(1)
    expect(params.hotelRepository.getById).toHaveBeenCalledWith('anyHotelId')
  })

  test('should throw if HotelRepository.getById returns null', async () => {
    jest.spyOn(params.hotelRepository, 'getById').mockResolvedValueOnce(null)

    const promise = sut.execute(input)

    await expect(promise).rejects.toThrowError(new InvalidParamError('id'))
  })

  test('should call HotelEntity.build once and with correct values', async () => {
    const spy = jest.spyOn(HotelEntity, 'build')

    await sut.execute(input)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({
      id: 'anyHotelId',
      name: 'New Hotel Name',
      externalCode: 'ABC-123',
      address: {
        country: 'Brasil',
        city: 'Barbacena',
        state: 'MG',
        district: 'Santa Luzia',
        street: 'XV de Novembro',
        number: 789,
        complement: 'Ao lado da Av. Brasil'
      },
      createdAt: new Date('2025-03-01'),
      updatedAt: new Date()
    })
  })

  test('should call HotelRepository.update once and with correct values', async () => {
    await sut.execute(input)

    expect(params.hotelRepository.update).toHaveBeenCalledTimes(1)
    expect(params.hotelRepository.update).toHaveBeenCalledWith({
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
    })
  })
})
