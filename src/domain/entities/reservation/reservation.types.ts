export type PaymentDetails = {
  total: number
  paymentMethod: string
  cardToken: string
}

export type BuildReservationEntityInput = {
  id?: string
  externalCode?: string
  hotelId: string
  roomId: string
  checkIn: string
  checkOut: string
  guestName: string
  guestEmail: string
  paymentDetails: PaymentDetails
  createdAt?: Date
  updatedAt?: Date
}
