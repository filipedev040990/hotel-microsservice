export type BuildRoomEntityInput = {
  id?: string
  externalCode?: string
  number: number
  type: string
  capacity: number
  description: string
  price: number
  status: string
  amenities: string
  floor: number
  hotelId: string
  createdAt?: Date
  updatedAt?: Date
}
