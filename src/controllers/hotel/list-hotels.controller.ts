import { ControllerInterface, HttpRequest, HttpResponse } from '@/domain/controller/controller.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { ListHotelsUseCaseInterface } from '@/domain/usecases/list-hotels-usecase.interface'
import { AppContainer } from '@/infra/container/register'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'

export class ListHotelsController implements ControllerInterface {
  private readonly listHotelsUseCase: ListHotelsUseCaseInterface
  private readonly loggerService: LoggerServiceInterface

  constructor (params: AppContainer) {
    this.listHotelsUseCase = params.listHotelsUseCase
    this.loggerService = params.loggerService
  }

  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      const output = await this.listHotelsUseCase.execute(input?.params?.id)
      return success(200, output)
    } catch (error) {
      const formattedError = handleError(error)
      this.loggerService.error('ListHotelsController.execute error', { error: formattedError })
      return formattedError
    }
  }
}
