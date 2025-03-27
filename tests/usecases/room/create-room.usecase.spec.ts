import { RoomEntity } from '@/domain/entities/room.entity'
import { RoomRepositoryInterface } from '@/domain/repositories/room-repository.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { CreateRoomUseCaseInput } from '@/domain/usecases/create-room-usecase.interface'
import { ConflictResourceError } from '@/shared/errors'
import { CreateRoomUseCase } from '@/usecases/room/create-room.usecase'
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
  createdAt: new Date(),
  updatedAt: new Date()
}

const params: any = {
  roomRepository: mock<RoomRepositoryInterface>(),
  loggerService: mock<LoggerServiceInterface>()
}

describe('CreateRoomUseCase', () => {
  let sut: CreateRoomUseCase
  let input: CreateRoomUseCaseInput

  beforeAll(() => {
    MockDate.set(new Date())
  })

  beforeEach(() => {
    sut = new CreateRoomUseCase(params)
    input = {
      number: 123,
      description: 'Suite Presidencial',
      type: 'suite',
      capacity: 2,
      amenities: 'Wi-fi, TV a cabo, Ar condicionado',
      floor: 2,
      price: 80000,
      hotelId: 'anyHotelId'

    }
    jest.spyOn(RoomEntity, 'build').mockReturnValue(fakeEntity)
    jest.spyOn(params.roomRepository, 'getByNumberAndHotelId').mockResolvedValue(null)
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call RommEntity.build once and with correct values', async () => {
    const spy = jest.spyOn(RoomEntity, 'build')

    await sut.execute(input)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({
      number: 123,
      description: 'Suite Presidencial',
      type: 'suite',
      capacity: 2,
      amenities: 'Wi-fi, TV a cabo, Ar condicionado',
      floor: 2,
      price: 80000,
      status: 'available',
      hotelId: 'anyHotelId'

    })
  })

  test('should call RoomRepository.getByNumberAndHotelId once and with correct values', async () => {
    await sut.execute(input)

    expect(params.roomRepository.getByNumberAndHotelId).toHaveBeenCalledTimes(1)
    expect(params.roomRepository.getByNumberAndHotelId).toHaveBeenCalledWith(123, 'anyHotelId')
  })

  test('should throw if RoomRepository.getByNumberAndHotelId throws', async () => {
    jest.spyOn(params.roomRepository, 'getByNumberAndHotelId').mockResolvedValueOnce(fakeEntity)

    const promise = sut.execute(input)

    await expect(promise).rejects.toThrowError(new ConflictResourceError('A room with this number already exists for this hotel.'))
  })

  test('should call RoomRepository.save once and with correct values', async () => {
    await sut.execute(input)

    expect(params.roomRepository.save).toHaveBeenCalledTimes(1)
    expect(params.roomRepository.save).toHaveBeenCalledWith(fakeEntity)
  })

  test('should throw if RoomRepository.save throws', async () => {
    const error = new Error('Test error')

    jest.spyOn(params.roomRepository, 'save').mockImplementationOnce(() => {
      throw error
    })

    const promise = sut.execute(input)

    await expect(promise).rejects.toThrowError(error)
  })

  test('should return a correct response', async () => {
    const output = await sut.execute(input)

    expect(output).toEqual({ id: 'anyId' })
  })
})
