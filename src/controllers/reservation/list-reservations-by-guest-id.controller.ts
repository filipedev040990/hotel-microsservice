import { ControllerInterface, HttpRequest, HttpResponse } from '@/domain/controller/controller.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { ListReservationsByGuestIdUseCaseInterface } from '@/domain/usecases/reservation/list-reservations-by-guest-id-usecase.interface'
import { AppContainer } from '@/infra/container/register'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'

export class ListReservationsByGuestIdController implements ControllerInterface {
  private readonly listReservationsByGuestIdUseCase: ListReservationsByGuestIdUseCaseInterface
  private readonly loggerService: LoggerServiceInterface

  constructor (params: AppContainer) {
    this.listReservationsByGuestIdUseCase = params.listReservationsByGuestIdUseCase
    this.loggerService = params.loggerService
  }

  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      const output = await this.listReservationsByGuestIdUseCase.execute(input?.body?.guestId)
      return success(200, output)
    } catch (error) {
      const formattedError = handleError(error)
      this.loggerService.error('ListReservationsByGuestIdController.execute error', { error: formattedError })
      return formattedError
    }
  }
}
