import { Address } from '@/domain/entities/hotel/hotel.types'

export type ListReservationsByGuestIdOutput = {
  hotel: {
    name: string
    address: Address
  }
  room: {
    id: string
    number: string
    type: string
    capacity: number
    description: string
    price: number
    amenities: string
    floor: number
  }
  reservation: {
    id: string
    checkIn: string
    checkOut: string
    status: string
    reason: string | null
  }
}

export interface ListReservationsByGuestIdUseCaseInterface {
  execute: (guestId: string) => Promise<ListReservationsByGuestIdOutput [] | null>
}
