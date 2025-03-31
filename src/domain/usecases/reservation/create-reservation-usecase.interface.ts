import { PaymentDetails } from '@/domain/entities/reservation/reservation.types'

export type CreateReservationUseCaseInput = {
  roomId: string
  checkIn: string
  checkOut: string
  guestEmail: string
  guestId: string
  paymentDetails: PaymentDetails
}

export type CreateReservationUseCaseOutput = {
  id: string
  roomId: string
  checkIn: string
  checkOut: string
  status: string
  paymentStatus: string
  createdAt: Date
}

export interface CreateReservationUseCaseInterface {
  execute: (input: CreateReservationUseCaseInput) => Promise<CreateReservationUseCaseOutput>
}
