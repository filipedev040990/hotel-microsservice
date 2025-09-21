export type ConfirmReservationPaymentUseCaseInput = {
  reservationId: string
  roomId: string
  status: string
}

export interface ConfirmReservationPaymentUseCaseInterface {
  execute: (input: ConfirmReservationPaymentUseCaseInput) => Promise<void>
}
