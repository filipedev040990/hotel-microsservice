import { ListReservationsOutput } from '../usecases/reservation/list-reservations-by-guest-id-usecase.interface'

export type ReservationRepositoryData = {
  id: string
  externalCode: string
  roomId: string
  checkIn: string
  checkOut: string
  guestEmail: string
  guestId: string
  paymentTotal: number
  paymentMethod: string
  paymentCardToken: string
  paymentStatus: string
  status: string
  reason?: string
  createdAt: Date
  updatedAt: Date
}

export type HotelWithRoomData = {
  roomId: string
  status: string
}

export interface ReservartionRepositoryInterface {
  save: (input: ReservationRepositoryData) => Promise<void>
  getRoomById: (roomId: string) => Promise<HotelWithRoomData | null>
  updateStatus: (reservationId: string, status: string, paymentStatus?: string, reason?: string) => Promise<void>
  getById: (reservationId: string) => Promise<ReservationRepositoryData | null>
  get: (guestId?: string) => Promise<ListReservationsOutput [] | null>
}
