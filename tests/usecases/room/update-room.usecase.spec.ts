import { RoomEntity } from '@/domain/entities/room/room.entity'
import { HotelRepositoryInterface } from '@/domain/repositories/hotel-repository.interface'
import { RoomRepositoryInterface } from '@/domain/repositories/room-repository.interface'
import { CacheServiceInterface } from '@/domain/services/cache-service.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { UpdateRoomUseCaseInput } from '@/domain/usecases/room/update-room-usecase.interface'
import { ConflictResourceError, InvalidParamError, MissingParamError } from '@/shared/errors'
import { UpdateRoomUseCase } from '@/usecases/room/update-room.usecase'
import { mock } from 'jest-mock-extended'
import MockDate from 'mockdate'

const fakeEntity: RoomEntity = {
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
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01')
}

const fakeHotelRepositoryData = {
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
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01')
}

const params: any = {
  roomRepository: mock<RoomRepositoryInterface>(),
  loggerService: mock<LoggerServiceInterface>(),
  hotelRepository: mock<HotelRepositoryInterface>(),
  cacheService: mock<CacheServiceInterface>()
}

describe('UpdateRoomUseCase', () => {
  let sut: UpdateRoomUseCase
  let input: UpdateRoomUseCaseInput

  beforeAll(() => {
    MockDate.set(new Date('2025-01-01'))
  })

  beforeEach(() => {
    sut = new UpdateRoomUseCase(params)
    input = {
      id: 'anyRoomId',
      number: 123,
      description: 'Suite Presidencial',
      type: 'suite',
      capacity: 2,
      amenities: 'Wi-fi, TV a cabo, Ar condicionado',
      floor: 2,
      price: 80000

    }
    jest.spyOn(RoomEntity, 'build').mockReturnValue(fakeEntity)
    jest.spyOn(params.roomRepository, 'getByNumberAndHotelId').mockResolvedValue(null)
    jest.spyOn(params.roomRepository, 'getById').mockResolvedValue(fakeEntity)
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should throw if id is not provided', async () => {
    input.id = undefined as any

    const promise = sut.execute(input)

    await expect(promise).rejects.toThrowError(new MissingParamError('id'))
  })

  test('should throw if input is empty', async () => {
    input = {
      id: 'anyRoomId'
    }

    const promise = sut.execute(input)

    await expect(promise).rejects.toThrowError(new InvalidParamError('Provide at least one field to update'))
  })

  test('should call RoomRepository.getById once and with correct values', async () => {
    await sut.execute(input)

    expect(params.roomRepository.getById).toHaveBeenCalledTimes(1)
    expect(params.roomRepository.getById).toHaveBeenCalledWith('anyRoomId')
  })

  test('should throw if RoomRepository.getById returns a result', async () => {
    jest.spyOn(params.roomRepository, 'getById').mockResolvedValueOnce(null)

    const promise = sut.execute(input)

    await expect(promise).rejects.toThrowError(new InvalidParamError('id'))
  })

  test('should call RommEntity.build once and with correct values', async () => {
    const spy = jest.spyOn(RoomEntity, 'build')

    await sut.execute(input)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({
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
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01')
    })
  })

  test('should call RoomRepository.getByNumberAndHotelId if number updated', async () => {
    input.number = 789456
    await sut.execute(input)

    expect(params.roomRepository.getByNumberAndHotelId).toHaveBeenCalledTimes(1)
    expect(params.roomRepository.getByNumberAndHotelId).toHaveBeenCalledWith(789456, 'anyHotelId')
  })

  test('should throw if RoomRepository.getByNumberAndHotelId returns a result', async () => {
    input.number = 789456

    jest.spyOn(params.roomRepository, 'getByNumberAndHotelId').mockResolvedValueOnce({
      id: 'anotherId',
      externalCode: 'anyExternalCode',
      number: 789456,
      description: 'Suite Presidencial',
      type: 'suite',
      capacity: 2,
      amenities: 'Wi-fi, TV a cabo, Ar condicionado',
      floor: 2,
      price: 80000,
      status: 'available',
      hotelId: 'anyHotelId',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01')
    })

    const promise = sut.execute(input)

    await expect(promise).rejects.toThrowError(new ConflictResourceError('A room with this number already exists for this hotel.'))
  })

  test('should call RoomRepository.update once and with correct values', async () => {
    await sut.execute(input)

    expect(params.roomRepository.update).toHaveBeenCalledTimes(1)
    expect(params.roomRepository.update).toHaveBeenCalledWith(fakeEntity)
  })

  test('shohuld return a correct output', async () => {
    const output = await sut.execute(input)

    expect(output).toEqual(fakeHotelRepositoryData)
  })
})
