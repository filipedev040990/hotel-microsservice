import { ReservationEntity } from '@/domain/entities/reservation/reservation.entity'
import { ReservartionRepositoryInterface } from '@/domain/repositories/reservation-repository.interface'
import { RoomRepositoryInterface } from '@/domain/repositories/room-repository.interface'
import { PubSubServiceInterface } from '@/domain/services/pub-sub-service.interface'
import { CreateReservationUseCaseInput } from '@/domain/usecases/hotel/create-reservation-usecase.interface'
import { InvalidParamError } from '@/shared/errors'
import { CreateReservationUseCase } from '@/usecases/hotel/create-reservartion.usecase'
import { mock } from 'jest-mock-extended'
import MockDate from 'mockdate'

const params: any = {
  reservationRepository: mock<ReservartionRepositoryInterface>(),
  roomRepository: mock<RoomRepositoryInterface>(),
  pubSubService: mock<PubSubServiceInterface>()
}

const fakeHotelWithRoom = {
  hotelId: 'anyHotelId',
  roomId: 'anyRoomId',
  status: 'available'
}

const fakeReservationEntity: ReservationEntity = {
  id: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8',
  externalCode: 'EXT123456',
  hotelId: 'anyHotelId',
  roomId: 'anyRoomId',
  checkIn: '2050-12-31',
  checkOut: '2051-01-07',
  guestName: 'Ze das Couves',
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
      hotelId: 'anyHotelId',
      roomId: 'anyRoomId',
      guestName: 'Ze das Couves',
      checkIn: '2050-12-31',
      checkOut: '2051-01-07',
      guestEmail: 'ze@email.com',
      paymentDetails: {
        paymentMethod: 'credit_card',
        cardToken: 's13as132ad564w87ef465d4s654d65as465dsfgfmkljpefkffr',
        total: 250000
      }
    }
    jest.spyOn(params.reservationRepository, 'getByHotelIdAndRoomId').mockResolvedValue(fakeHotelWithRoom)
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
      hotelId: 'anyHotelId',
      roomId: 'anyRoomId',
      guestName: 'Ze das Couves',
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

  test('should call ReservationRepository.getByHotelIdAndRoomId once and with correct values', async () => {
    await sut.execute(input)

    expect(params.reservationRepository.getByHotelIdAndRoomId).toHaveBeenCalledTimes(1)
    expect(params.reservationRepository.getByHotelIdAndRoomId).toHaveBeenCalledWith('anyHotelId', 'anyRoomId')
  })

  test('should throws if ReservationRepository.getByHotelIdAndRoomId returns null', async () => {
    jest.spyOn(params.reservationRepository, 'getByHotelIdAndRoomId').mockResolvedValueOnce(null)

    const promise = sut.execute(input)

    await expect(promise).rejects.toThrowError(new InvalidParamError('roomId'))
  })

  test('should throws if room is not available', async () => {
    jest.spyOn(params.reservationRepository, 'getByHotelIdAndRoomId').mockResolvedValueOnce({
      hotelId: 'anyHotelId',
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
      hotelId: 'anyHotelId',
      roomId: 'anyRoomId',
      checkIn: '2050-12-31',
      checkOut: '2051-01-07',
      guestName: 'Ze das Couves',
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
      hotelId: 'anyHotelId',
      roomId: 'anyRoomId',
      checkIn: '2050-12-31',
      checkOut: '2051-01-07',
      guestName: 'Ze das Couves',
      status: 'in_process_booking',
      paymentStatus: 'processing',
      createdAt: new Date('2025-03-01')
    })
  })
})
