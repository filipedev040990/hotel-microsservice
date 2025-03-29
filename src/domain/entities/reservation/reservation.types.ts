export type PaymentDetails = {
  total: number
  paymentMethod: string
  cardToken: string
}

export type BuildReservationEntityInput = {
  id?: string
  externalCode?: string
  roomId: string
  checkIn: string
  checkOut: string
  guestEmail: string
  paymentDetails: PaymentDetails
  status?: string
  createdAt?: Date
  updatedAt?: Date
}
