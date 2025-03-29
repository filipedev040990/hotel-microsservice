import { ControllerInterface, HttpRequest, HttpResponse } from '@/domain/controller/controller.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { UpdateHotelUseCaseInterface } from '@/domain/usecases/hotel/update-hotel-usecase.interface'
import { AppContainer } from '@/infra/container/register'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'

export class UpdateHotelController implements ControllerInterface {
  private readonly updateHotelUseCase: UpdateHotelUseCaseInterface
  private readonly loggerService: LoggerServiceInterface

  constructor (params: AppContainer) {
    this.updateHotelUseCase = params.updateHotelUseCase
    this.loggerService = params.loggerService
  }

  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      const output = await this.updateHotelUseCase.execute({ id: input?.params?.id, ...input.body })
      return success(200, output)
    } catch (error) {
      const formattedError = handleError(error)
      this.loggerService.error('UpdateHotelController.execute error', { error: formattedError })
      return formattedError
    }
  }
}
