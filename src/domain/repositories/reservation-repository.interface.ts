export type ReservationRepositoryData = {
  id: string
  externalCode: string
  roomId: string
  checkIn: string
  checkOut: string
  guestEmail: string
  paymentTotal: number
  paymentMethod: string
  paymentCardToken: string
  paymentStatus: string
  status: string
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
  updateStatus: (reservationId: string, status: string) => Promise<void>
}
