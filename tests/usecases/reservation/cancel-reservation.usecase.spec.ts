import { ReservartionRepositoryInterface } from '@/domain/repositories/reservation-repository.interface'
import { RoomRepositoryInterface } from '@/domain/repositories/room-repository.interface'
import { CacheServiceInterface } from '@/domain/services/cache-service.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { CancelReservationUseCaseInput } from '@/domain/usecases/reservation/cancel-reservation-usecase.interface'
import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { CancelReservationUseCase } from '@/usecases/reservation/cancel-reservation.usecase'
import { mock } from 'jest-mock-extended'

const params: any = {
  reservationRepository: mock<ReservartionRepositoryInterface>(),
  loggerService: mock<LoggerServiceInterface>(),
  cacheService: mock<CacheServiceInterface>(),
  roomRepository: mock<RoomRepositoryInterface>()
}

const reservationRepositoryData = {
  id: 'anyReservationId',
  externalCode: 'externalCode',
  roomId: 'roomId',
  checkIn: '2025-12-20',
  checkOut: '2026-01-01',
  guestEmail: 'anyEmail@email.com',
  guestId: 'anyGuestId',
  paymentTotal: 123456,
  paymentMethod: 'any',
  paymentCardToken: 'any',
  paymentStatus: 'any',
  status: 'confirmed',
  createdAt: new Date(),
  updatedAt: new Date()
}

describe('CancelReservationUseCase', () => {
  let sut: CancelReservationUseCase
  let input: CancelReservationUseCaseInput

  beforeEach(() => {
    sut = new CancelReservationUseCase(params)
    input = {
      reservationId: 'anyReservationId',
      guestId: 'anyGuestId'
    }
    jest.spyOn(params.reservationRepository, 'getById').mockResolvedValue(reservationRepositoryData)
  })

  test('should throw if reservationId is not provided', async () => {
    input.reservationId = undefined as any
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new MissingParamError('reservationId'))
  })

  test('should throw if guestId is not provided', async () => {
    input.guestId = undefined as any
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new MissingParamError('guestId'))
  })

  test('should throw if a invalid reservationId is provided', async () => {
    jest.spyOn(params.reservationRepository, 'getById').mockResolvedValueOnce(null)
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new InvalidParamError('reservationId'))
  })

  test('should throw if reservation is not from the logged in user', async () => {
    jest.spyOn(params.reservationRepository, 'getById').mockResolvedValueOnce({
      id: 'anyReservationId',
      externalCode: 'externalCode',
      roomId: 'roomId',
      checkIn: '2025-12-20',
      checkOut: '2026-01-01',
      guestEmail: 'anyEmail@email.com',
      guestId: 'anotherGuestId',
      paymentTotal: 123456,
      paymentMethod: 'any',
      paymentCardToken: 'any',
      paymentStatus: 'any',
      status: 'reserved',
      createdAt: new Date(),
      updatedAt: new Date()
    })
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new InvalidParamError('This reservation cannot be cancelled'))
  })

  test('should throw if reservation status is not confirmed', async () => {
    jest.spyOn(params.reservationRepository, 'getById').mockResolvedValueOnce({
      id: 'anyReservationId',
      externalCode: 'externalCode',
      roomId: 'roomId',
      checkIn: '2025-12-20',
      checkOut: '2026-01-01',
      guestEmail: 'anyEmail@email.com',
      guestId: 'anyGuestId',
      paymentTotal: 123456,
      paymentMethod: 'any',
      paymentCardToken: 'any',
      paymentStatus: 'any',
      status: 'processing',
      createdAt: new Date(),
      updatedAt: new Date()
    })
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new InvalidParamError('This reservation cannot be cancelled'))
  })

  test('should call ReservationRepository.updateStatus once and with correct values', async () => {
    await sut.execute(input)

    expect(params.reservationRepository.updateStatus).toBeCalledTimes(1)
    expect(params.reservationRepository.updateStatus).toBeCalledWith('anyReservationId', 'canceled', 'refunded', 'Reservation canceled by client')
  })
})
