import { ControllerInterface, HttpRequest, HttpResponse } from '@/domain/controller/controller.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { CreateReservationUseCaseInterface } from '@/domain/usecases/hotel/create-reservation-usecase.interface'
import { AppContainer } from '@/infra/container/register'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'

export class CreateReservationController implements ControllerInterface {
  private readonly createReservationUseCase: CreateReservationUseCaseInterface
  private readonly loggerService: LoggerServiceInterface

  constructor (params: AppContainer) {
    this.createReservationUseCase = params.createReservationUseCase
    this.loggerService = params.loggerService
  }

  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      const output = await this.createReservationUseCase.execute(input.body)
      return success(200, output)
    } catch (error) {
      const formattedError = handleError(error)
      this.loggerService.error('CreateReservationController.execute error', { error: formattedError })
      return formattedError
    }
  }
}
