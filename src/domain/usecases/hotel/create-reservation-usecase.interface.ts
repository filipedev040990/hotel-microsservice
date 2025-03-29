import { PaymentDetails } from '@/domain/entities/reservation/reservation.types'

export type CreateReservationUseCaseInput = {
  hotelId: string
  roomId: string
  checkIn: string
  checkOut: string
  guestName: string
  guestEmail: string
  paymentDetails: PaymentDetails
}

export type CreateReservationUseCaseOutput = {
  id: string
  hotelId: string
  roomId: string
  checkIn: string
  checkOut: string
  guestName: string
  status: string
  paymentStatus: string
  createdAt: Date
}

export interface CreateReservationUseCaseInterface {
  execute: (input: CreateReservationUseCaseInput) => Promise<CreateReservationUseCaseOutput>
}
