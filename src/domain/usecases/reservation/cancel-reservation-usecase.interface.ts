export type CancelReservationUseCaseInput = {
  reservationId: string
  guestId: string
}

export interface CancelReservationUseCaseInterface {
  execute: (input: CancelReservationUseCaseInput) => Promise<void>
}
