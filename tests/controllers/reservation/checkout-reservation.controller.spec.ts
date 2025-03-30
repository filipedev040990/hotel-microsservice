import { CheckoutReservationController } from '@/controllers/reservation/checkout-reservation.controller'
import { HttpRequest } from '@/domain/controller/controller.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { CheckoutReservationUseCaseInterface } from '@/domain/usecases/reservation/checkout-reservation-usecase.interface'
import { mock } from 'jest-mock-extended'

const params: any = {
  checkoutReservationUseCase: mock<CheckoutReservationUseCaseInterface>(),
  loggerService: mock<LoggerServiceInterface>()
}

describe('CheckoutReservationController', () => {
  let sut: CheckoutReservationController
  let input: HttpRequest

  beforeEach(() => {
    sut = new CheckoutReservationController(params)
    input = {
      params: { id: 'anyID' }
    }
  })

  test('should call CheckoutReservationUseCase.execute once and with correct values', async () => {
    await sut.execute(input)

    expect(params.checkoutReservationUseCase.execute).toBeCalledTimes(1)
    expect(params.checkoutReservationUseCase.execute).toBeCalledWith('anyID')
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)

    expect(output).toEqual({ statusCode: 200, body: null })
  })
})
