import { ControllerInterface, HttpRequest, HttpResponse } from '@/domain/controller/controller.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { ResendReservationPaymentMessageUseCaseInterface } from '@/domain/usecases/reservation/resend-reservation-payment-message-usecase.interface'
import { AppContainer } from '@/infra/container/register'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'

export class ResendReservationPaymentMessageController implements ControllerInterface {
  private readonly resendReservationMessagePublisherUseCase: ResendReservationPaymentMessageUseCaseInterface
  private readonly loggerService: LoggerServiceInterface

  constructor(params: AppContainer) {
    this.resendReservationMessagePublisherUseCase = params.resendReservationPaymentMessageUseCase
    this.loggerService = params.loggerService
  }

  async execute(input: HttpRequest): Promise<HttpResponse> {
    try {
      await this.resendReservationMessagePublisherUseCase.execute()
      return success(201, null)
    } catch (error) {
      const formattedError = handleError(error)
      this.loggerService.error('ResendReservationPaymentMessageController.execute error', { error: formattedError })
      return formattedError
    }
  }
}
