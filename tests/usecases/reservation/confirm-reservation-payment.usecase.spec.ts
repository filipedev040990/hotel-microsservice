import { ReservartionRepositoryInterface } from '@/domain/repositories/reservation-repository.interface'
import { RoomRepositoryInterface } from '@/domain/repositories/room-repository.interface'
import { ConfirmReservationPaymentUseCaseInput } from '@/domain/usecases/reservation/confirm-reservation-payment-usecase.interface'
import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { LoggerService } from '@/shared/services/logger.service'
import { ConfirmReservationPaymentUseCase } from '@/usecases/reservation/confirm-reservation-payment.usecase'
import { mock } from 'jest-mock-extended'

const params: any = {
  reservationRepository: mock<ReservartionRepositoryInterface>(),
  roomRepository: mock<RoomRepositoryInterface>(),
  loggerService: mock<LoggerService>()
}

const fakeRoom = {
  id: 'anyRoomId',
  externalCode: '123-ABC',
  number: 123,
  type: 'suite',
  capacity: 1,
  description: 'Test',
  price: 5000,
  amenities: 'test',
  floor: 1,
  status: 'reserved',
  hotelId: 'anyHotelId',
  createdAt: new Date(),
  updatedAt: new Date()
}

const fakeReservationEntity = {
  id: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8',
  externalCode: 'EXT123456',
  roomId: 'anyRoomId',
  checkIn: '2050-12-31',
  checkOut: '2051-01-07',
  guestEmail: 'ze@email.com',
  guestId: 'anyGuestId',
  paymentDetails: {
    paymentMethod: 'credit_card',
    cardToken: 's13as132ad564w87ef465d4s654d65as465dsfgfmkljpefkffr',
    total: 250000
  },
  status: 'in_process_booking',
  createdAt: new Date('2025-03-01'),
  updatedAt: new Date('2025-03-01')
}

describe('ConfirmReservationPaymentUseCase', () => {
  let sut: ConfirmReservationPaymentUseCase
  let input: ConfirmReservationPaymentUseCaseInput

  beforeEach(() => {
    sut = new ConfirmReservationPaymentUseCase(params)
    input = {
      reservationId: 'anyReservationId',
      roomId: 'anyRoomId',
      status: 'confirmed',
      requestId: 'any'
    }
    jest.spyOn(params.roomRepository, 'getById').mockResolvedValue(fakeRoom)
    jest.spyOn(params.reservationRepository, 'getById').mockResolvedValue(fakeReservationEntity)
  })

  test('should throw if reservationId is not provided', async () => {
    input.reservationId = undefined as any
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new MissingParamError('reservationId'))
  })

  test('should throw if roomId is not provided', async () => {
    input.roomId = undefined as any
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new MissingParamError('roomId'))
  })

  test('should throw if status is not provided', async () => {
    input.status = undefined as any
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new MissingParamError('status'))
  })

  test('should throw if RoomRepository.getById returns null', async () => {
    jest.spyOn(params.roomRepository, 'getById').mockResolvedValueOnce(null)
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new InvalidParamError('roomId'))
  })

  test('should throw if ReservationRepository.getById returns null', async () => {
    jest.spyOn(params.reservationRepository, 'getById').mockResolvedValueOnce(null)
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new InvalidParamError('reservationId'))
  })

  test('should throw if a invalid statis is provided', async () => {
    input.status = 'invalid'
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new InvalidParamError('status'))
  })

  test('should update Room status when payment is confirmed', async () => {
    await sut.execute(input)
    expect(params.roomRepository.updateStatus).toHaveBeenCalledTimes(1)
    expect(params.roomRepository.updateStatus).toHaveBeenCalledWith('anyRoomId', 'reserved')
  })

  test('should update Room status when payment fails', async () => {
    input.status = 'canceled'
    await sut.execute(input)
    expect(params.roomRepository.updateStatus).toHaveBeenCalledTimes(1)
    expect(params.roomRepository.updateStatus).toHaveBeenCalledWith('anyRoomId', 'available')
  })

  test('should update reservation with correct values when payment is confirmed', async () => {
    await sut.execute(input)
    expect(params.reservationRepository.updateStatus).toHaveBeenCalledTimes(1)
    expect(params.reservationRepository.updateStatus).toHaveBeenCalledWith('anyReservationId', 'confirmed', 'confirmed')
  })

  test('should update reservation with correct values when payment fails', async () => {
    input.status = 'canceled'
    await sut.execute(input)
    expect(params.reservationRepository.updateStatus).toHaveBeenCalledTimes(1)
    expect(params.reservationRepository.updateStatus).toHaveBeenCalledWith('anyReservationId', 'canceled', 'canceled')
  })
})
