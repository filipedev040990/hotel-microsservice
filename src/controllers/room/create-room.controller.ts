import { ControllerInterface, HttpRequest, HttpResponse } from '@/domain/controller/controller.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { CreateRoomUseCaseInterface } from '@/domain/usecases/room/create-room-usecase.interface'
import { AppContainer } from '@/infra/container/register'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'

export class CreateRoomController implements ControllerInterface {
  private readonly createRoomUseCase: CreateRoomUseCaseInterface
  private readonly loggerService: LoggerServiceInterface

  constructor (params: AppContainer) {
    this.createRoomUseCase = params.createRoomUseCase
    this.loggerService = params.loggerService
  }

  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      const output = await this.createRoomUseCase.execute(input.body)
      return success(201, output)
    } catch (error) {
      const formattedError = handleError(error)
      this.loggerService.error('CreateRoomController.execute error', { error: formattedError })
      return formattedError
    }
  }
}
