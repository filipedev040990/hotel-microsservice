import { ReservartionRepositoryInterface } from '@/domain/repositories/reservation-repository.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { ListReservationsOutput, ListReservationsByGuestIdUseCaseInterface } from '@/domain/usecases/reservation/list-reservations-by-guest-id-usecase.interface'
import { AppContainer } from '@/infra/container/register'
import { MissingParamError } from '@/shared/errors'

export class ListReservationsByGuestIdUseCase implements ListReservationsByGuestIdUseCaseInterface {
  private readonly reservationRepository: ReservartionRepositoryInterface
  private readonly loggerService: LoggerServiceInterface

  constructor (params: AppContainer) {
    this.reservationRepository = params.reservationRepository
    this.loggerService = params.loggerService
  }

  async execute (guestId: string): Promise<ListReservationsOutput[] | null> {
    try {
      if (!guestId) {
        throw new MissingParamError('guestId')
      }

      const reservations = await this.reservationRepository.get(guestId)

      return reservations
    } catch (error) {
      this.loggerService.error('ListReservationsByGuestIdUseCase error', { error })
      throw error
    }
  }
}
