import { ControllerInterface, HttpResponse } from '@/domain/controller/controller.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { ListReservationsUseCaseInterface } from '@/domain/usecases/reservation/list-reservations-usecase.interface'
import { AppContainer } from '@/infra/container/register'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'

export class ListReservationsController implements ControllerInterface {
  private readonly listReservationsUseCase: ListReservationsUseCaseInterface
  private readonly loggerService: LoggerServiceInterface

  constructor (params: AppContainer) {
    this.listReservationsUseCase = params.listReservationsUseCase
    this.loggerService = params.loggerService
  }

  async execute (): Promise<HttpResponse> {
    try {
      const output = await this.listReservationsUseCase.execute()
      return success(200, output)
    } catch (error) {
      const formattedError = handleError(error)
      this.loggerService.error('ListReservationsController.execute error', { error: formattedError })
      return formattedError
    }
  }
}
