export type ListHotelsUseCaseOutput = {
  name: string
  address: {
    country: string
    state: string
    city: string
    district: string
    street: string
    number: number
    complement: string
  }
  rooms: Room []
} | []

export type Room = {
  externalCode: string
  number: number
  type: string
  capacity: number
  description: string
  price: number
  status: string
  amenities: string
  floor: number
}

export interface ListHotelsUseCaseInterface {
  execute: (hotelId?: string) => Promise<ListHotelsUseCaseOutput []>
}
