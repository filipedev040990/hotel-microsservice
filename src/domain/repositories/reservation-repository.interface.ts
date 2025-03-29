export type ReservationRepositoryData = {
  id: string
  externalCode: string
  hotelId: string
  roomId: string
  checkIn: string
  checkOut: string
  guestName: string
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
  hotelId: string
  roomId: string
  status: string
}

export interface ReservartionRepositoryInterface {
  save: (input: ReservationRepositoryData) => Promise<void>
  getByHotelIdAndRoomId: (hotelId: string, roomId: string) => Promise<HotelWithRoomData | null>
}
