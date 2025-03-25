import { ControllerInterface, HttpRequest, HttpResponse } from '@/domain/controller/controller.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { CreateHotelUseCaseInterface } from '@/domain/usecases/create-hotel-usecase.interface'
import { AppContainer } from '@/infra/container/register'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'

export class CreateHotelController implements ControllerInterface {
  private readonly createHotelUseCase: CreateHotelUseCaseInterface
  private readonly loggerService: LoggerServiceInterface

  constructor (params: AppContainer) {
    this.createHotelUseCase = params.createHotelUseCase
    this.loggerService = params.loggerService
  }

  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      const output = await this.createHotelUseCase.execute(input.body)
      return success(201, output)
    } catch (error) {
      const formattedError = handleError(error)
      this.loggerService.error('CreateHotelController.execute error', { error: formattedError })
      return formattedError
    }
  }
}
