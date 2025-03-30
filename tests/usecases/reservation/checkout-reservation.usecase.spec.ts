import { ReservartionRepositoryInterface } from '@/domain/repositories/reservation-repository.interface'
import { RoomRepositoryInterface } from '@/domain/repositories/room-repository.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { CheckoutReservationUseCase } from '@/usecases/reservation/checkout-reservation.usecase'
import { mock } from 'jest-mock-extended'

const params: any = {
  reservationRepository: mock<ReservartionRepositoryInterface>(),
  roomRepository: mock<RoomRepositoryInterface>(),
  loggerService: mock<LoggerServiceInterface>()
}

const reservationData = {
  id: 'anyReservationId',
  externalCode: 'anyCode',
  roomId: 'anyRoomId',
  checkIn: '2025-01-01',
  checkOut: '2025-01-15',
  guestEmail: 'ze@email.com',
  paymentTotal: 25000,
  paymentMethod: 'credit_card',
  paymentCardToken: 'sa489789e47r654sd4a4s65assa',
  paymentStatus: 'confirmed',
  status: 'confirmed',
  createdAt: new Date(),
  updatedAt: new Date()
}

describe('CheckoutReservationUseCase', () => {
  let sut: CheckoutReservationUseCase
  let reservationId: string

  beforeEach(() => {
    sut = new CheckoutReservationUseCase(params)
    reservationId = 'anyReservationId'

    jest.spyOn(params.reservationRepository, 'getById').mockResolvedValue(reservationData)
  })

  test('should throw if id is not provided', async () => {
    const promise = sut.execute(undefined as any)
    await expect(promise).rejects.toThrowError(new MissingParamError('id'))
  })

  test('should call ReservationRepository.getById once and with correct id', async () => {
    await sut.execute(reservationId)

    expect(params.reservationRepository.getById).toHaveBeenCalledTimes(1)
    expect(params.reservationRepository.getById).toHaveBeenCalledWith(reservationId)
  })

  test('should throw if ReservationRepository.getById returns null', async () => {
    jest.spyOn(params.reservationRepository, 'getById').mockResolvedValueOnce(null)
    const promise = sut.execute(reservationId)
    await expect(promise).rejects.toThrowError(new InvalidParamError('id'))
  })

  test('should call ReservationRepository.updateStatus once and with correct id', async () => {
    await sut.execute(reservationId)

    expect(params.reservationRepository.updateStatus).toHaveBeenCalledTimes(1)
    expect(params.reservationRepository.updateStatus).toHaveBeenCalledWith(reservationId, 'finished')
  })

  test('should call RoomRepository.updateStatus once and with correct id', async () => {
    await sut.execute(reservationId)

    expect(params.roomRepository.updateStatus).toHaveBeenCalledTimes(1)
    expect(params.roomRepository.updateStatus).toHaveBeenCalledWith('anyRoomId', 'available')
  })
})
