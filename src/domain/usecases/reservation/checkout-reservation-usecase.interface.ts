export interface CheckoutReservationUseCaseInterface {
  execute: (reservationId: string) => Promise<void>
}
