import { ListReservationsOutput } from './list-reservations-by-guest-id-usecase.interface'

export interface ListReservationsUseCaseInterface {
  execute: () => Promise<ListReservationsOutput [] | null>
}
