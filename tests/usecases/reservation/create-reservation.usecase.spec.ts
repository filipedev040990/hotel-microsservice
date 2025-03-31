import { ReservationEntity } from '@/domain/entities/reservation/reservation.entity'
import { ReservartionRepositoryInterface } from '@/domain/repositories/reservation-repository.interface'
import { RoomRepositoryInterface } from '@/domain/repositories/room-repository.interface'
import { CacheServiceInterface } from '@/domain/services/cache-service.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { PubSubServiceInterface } from '@/domain/services/pub-sub-service.interface'
import { CreateReservationUseCaseInput } from '@/domain/usecases/reservation/create-reservation-usecase.interface'
import { InvalidParamError } from '@/shared/errors'
import { CreateReservationUseCase } from '@/usecases/reservation/create-reservation.usecase'
import { mock } from 'jest-mock-extended'
import MockDate from 'mockdate'

const params: any = {
  reservationRepository: mock<ReservartionRepositoryInterface>(),
  roomRepository: mock<RoomRepositoryInterface>(),
  pubSubService: mock<PubSubServiceInterface>(),
  loggerService: mock<LoggerServiceInterface>(),
  cacheService: mock<CacheServiceInterface>()
}

const fakeHotelWithRoom = {
  roomId: 'anyRoomId',
  status: 'available'
}

const fakeReservationEntity: ReservationEntity = {
  id: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8',
  externalCode: 'EXT123456',
  roomId: 'anyRoomId',
  checkIn: '2050-12-31',
  checkOut: '2051-01-07',
  guestEmail: 'ze@email.com',
  paymentDetails: {
    paymentMethod: 'credit_card',
    cardToken: 's13as132ad564w87ef465d4s654d65as465dsfgfmkljpefkffr',
    total: 250000
  },
  status: 'in_process_booking',
  createdAt: new Date('2025-03-01'),
  updatedAt: new Date('2025-03-01')
}

describe('CreateReservationUseCase', () => {
  let sut: CreateReservationUseCase
  let input: CreateReservationUseCaseInput

  beforeAll(() => {
    MockDate.set(new Date('2025-03-01'))
  })

  beforeEach(() => {
    sut = new CreateReservationUseCase(params)
    input = {
      roomId: 'anyRoomId',
      checkIn: '2050-12-31',
      checkOut: '2051-01-07',
      guestEmail: 'ze@email.com',
      paymentDetails: {
        paymentMethod: 'credit_card',
        cardToken: 's13as132ad564w87ef465d4s654d65as465dsfgfmkljpefkffr',
        total: 250000
      }
    }
    jest.spyOn(params.reservationRepository, 'getRoomById').mockResolvedValue(fakeHotelWithRoom)
    jest.spyOn(ReservationEntity, 'build').mockReturnValue(fakeReservationEntity)
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call ReservationEntity.build once and with correct values', async () => {
    const spy = jest.spyOn(ReservationEntity, 'build')

    await sut.execute(input)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({
      roomId: 'anyRoomId',
      checkIn: '2050-12-31',
      checkOut: '2051-01-07',
      guestEmail: 'ze@email.com',
      paymentDetails: {
        paymentMethod: 'credit_card',
        cardToken: 's13as132ad564w87ef465d4s654d65as465dsfgfmkljpefkffr',
        total: 250000
      }
    })
  })

  test('should call ReservationRepository.getRoomById once and with correct values', async () => {
    await sut.execute(input)

    expect(params.reservationRepository.getRoomById).toHaveBeenCalledTimes(1)
    expect(params.reservationRepository.getRoomById).toHaveBeenCalledWith('anyRoomId')
  })

  test('should throws if ReservationRepository.getRoomById returns null', async () => {
    jest.spyOn(params.reservationRepository, 'getRoomById').mockResolvedValueOnce(null)

    const promise = sut.execute(input)

    await expect(promise).rejects.toThrowError(new InvalidParamError('roomId'))
  })

  test('should throws if room is not available', async () => {
    jest.spyOn(params.reservationRepository, 'getRoomById').mockResolvedValueOnce({
      roomId: 'anyRoomId',
      status: 'reserved'
    })

    const promise = sut.execute(input)

    await expect(promise).rejects.toThrowError(new InvalidParamError('This room already reserved'))
  })

  test('should call RoomRepository.updateStatus once and with correct values', async () => {
    await sut.execute(input)

    expect(params.roomRepository.updateStatus).toHaveBeenCalledTimes(1)
    expect(params.roomRepository.updateStatus).toHaveBeenCalledWith('anyRoomId', 'in_process_booking')
  })

  test('should call pubSubService.publish once and with correct values', async () => {
    await sut.execute(input)

    expect(params.pubSubService.publish).toHaveBeenCalledTimes(1)
    expect(params.pubSubService.publish).toHaveBeenCalledWith('reservation_request', JSON.stringify({
      id: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8',
      externalCode: 'EXT123456',
      roomId: 'anyRoomId',
      checkIn: '2050-12-31',
      checkOut: '2051-01-07',
      guestEmail: 'ze@email.com',
      paymentDetails: {
        paymentMethod: 'credit_card',
        cardToken: 's13as132ad564w87ef465d4s654d65as465dsfgfmkljpefkffr',
        total: 250000
      }
    }))
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)

    expect(output).toEqual({
      id: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8',
      roomId: 'anyRoomId',
      checkIn: '2050-12-31',
      checkOut: '2051-01-07',
      status: 'in_process_booking',
      paymentStatus: 'processing',
      createdAt: new Date('2025-03-01')
    })
  })

  test('should call ReservationRepository.save once and with correct values', async () => {
    await sut.execute(input)

    expect(params.reservationRepository.save).toHaveBeenCalledTimes(1)
    expect(params.reservationRepository.save).toHaveBeenCalledWith({
      id: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8',
      externalCode: 'EXT123456',
      roomId: 'anyRoomId',
      checkIn: '2050-12-31',
      checkOut: '2051-01-07',
      guestEmail: 'ze@email.com',
      paymentCardToken: 's13as132ad564w87ef465d4s654d65as465dsfgfmkljpefkffr',
      paymentMethod: 'credit_card',
      paymentStatus: 'processing',
      paymentTotal: 250000,
      status: 'in_process_booking',
      createdAt: new Date('2025-03-01'),
      updatedAt: new Date('2025-03-01')
    })
  })

  test('should call CacheService.del', async () => {
    await sut.execute(input)

    expect(params.cacheService.del).toHaveBeenCalledTimes(1)
    expect(params.cacheService.del).toHaveBeenCalledWith('hotels_list')
  })
})
