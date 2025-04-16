import { ReservartionRepositoryInterface } from '@/domain/repositories/reservation-repository.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { ListReservationsOutput } from '@/domain/usecases/reservation/list-reservations-by-guest-id-usecase.interface'
import { ListReservationsUseCaseInterface } from '@/domain/usecases/reservation/list-reservations-usecase.interface'
import { AppContainer } from '@/infra/container/register'

export class ListReservationsUseCase implements ListReservationsUseCaseInterface {
  private readonly reservationRepository: ReservartionRepositoryInterface
  private readonly loggerService: LoggerServiceInterface

  constructor (params: AppContainer) {
    this.reservationRepository = params.reservationRepository
    this.loggerService = params.loggerService
  }

  async execute (): Promise<ListReservationsOutput [] | null> {
    try {
      const reservations = await this.reservationRepository.get()
      return reservations ?? null
    } catch (error) {
      this.loggerService.error('ListReservationsUseCase error', { error })
      throw error
    }
  }
}
