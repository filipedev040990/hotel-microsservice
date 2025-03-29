import { ControllerInterface, HttpRequest, HttpResponse } from '@/domain/controller/controller.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { UpdateRoomUseCaseInterface } from '@/domain/usecases/room/update-room-usecase.interface'
import { AppContainer } from '@/infra/container/register'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'

export class UpdateRoomController implements ControllerInterface {
  private readonly updateRoomUseCase: UpdateRoomUseCaseInterface
  private readonly loggerService: LoggerServiceInterface

  constructor (params: AppContainer) {
    this.updateRoomUseCase = params.updateRoomUseCase
    this.loggerService = params.loggerService
  }

  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      const output = await this.updateRoomUseCase.execute({ id: input?.params?.id, ...input.body })
      return success(200, output)
    } catch (error) {
      const formattedError = handleError(error)
      this.loggerService.error('UpdateRoomController.execute error', { error: formattedError })
      return formattedError
    }
  }
}
