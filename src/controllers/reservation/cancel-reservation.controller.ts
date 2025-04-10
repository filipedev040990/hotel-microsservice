import { ControllerInterface, HttpRequest, HttpResponse } from '@/domain/controller/controller.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { CancelReservationUseCaseInterface } from '@/domain/usecases/reservation/cancel-reservation-usecase.interface'
import { AppContainer } from '@/infra/container/register'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'

export class CancelReservationController implements ControllerInterface {
  private readonly cancelReservationUseCase: CancelReservationUseCaseInterface
  private readonly loggerService: LoggerServiceInterface

  constructor (params: AppContainer) {
    this.cancelReservationUseCase = params.cancelReservationUseCase
    this.loggerService = params.loggerService
  }

  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      await this.cancelReservationUseCase.execute({ reservationId: input?.params?.id, guestId: input?.body?.guestId })
      return success(201, null)
    } catch (error) {
      const formattedError = handleError(error)
      this.loggerService.error('CancelReservationController.execute error', { error: formattedError })
      return formattedError
    }
  }
}
