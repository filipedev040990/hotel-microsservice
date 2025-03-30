import { ControllerInterface, HttpRequest, HttpResponse } from '@/domain/controller/controller.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { CheckoutReservationUseCaseInterface } from '@/domain/usecases/reservation/checkout-reservation-usecase.interface'
import { AppContainer } from '@/infra/container/register'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'

export class CheckoutReservationController implements ControllerInterface {
  private readonly checkoutReservationUseCase: CheckoutReservationUseCaseInterface
  private readonly loggerService: LoggerServiceInterface

  constructor (params: AppContainer) {
    this.checkoutReservationUseCase = params.checkoutReservationUseCase
    this.loggerService = params.loggerService
  }

  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      await this.checkoutReservationUseCase.execute(input?.params?.id)
      return success(200, null)
    } catch (error) {
      const formattedError = handleError(error)
      this.loggerService.error('CheckoutReservationController.execute error', { error: formattedError })
      return formattedError
    }
  }
}
