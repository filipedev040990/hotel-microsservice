import { CancelReservationController } from '@/controllers/reservation/cancel-reservation.controller'
import { HttpRequest } from '@/domain/controller/controller.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { CancelReservationUseCaseInterface } from '@/domain/usecases/reservation/cancel-reservation-usecase.interface'
import { mock } from 'jest-mock-extended'

const params: any = {
  cancelReservationUseCase: mock<CancelReservationUseCaseInterface>(),
  loggerService: mock<LoggerServiceInterface>()
}

describe('CancelReservationController', () => {
  let sut: CancelReservationController
  let input: HttpRequest

  beforeEach(() => {
    sut = new CancelReservationController(params)
    input = {
      params: { id: 'anyID' },
      body: { guestId: 'anyGuestId' }
    }
  })

  test('should call CheckoutReservationUseCase.execute once and with correct values', async () => {
    await sut.execute(input)

    expect(params.cancelReservationUseCase.execute).toBeCalledTimes(1)
    expect(params.cancelReservationUseCase.execute).toBeCalledWith({ reservationId: 'anyID', guestId: 'anyGuestId' })
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)

    expect(output).toEqual({ statusCode: 201, body: null })
  })
})
