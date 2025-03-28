export type RoomRepositoryData = {
  id: string
  externalCode: string
  number: number
  type: string
  capacity: number
  description: string
  price: number
  amenities: string
  floor: number
  status: string
  hotelId: string
  createdAt: Date
  updatedAt: Date
}

export interface RoomRepositoryInterface {
  save: (input: RoomRepositoryData) => Promise<void>
  update: (input: RoomRepositoryData) => Promise<void>
  getByNumberAndHotelId: (number: number, hotelId: string) => Promise<RoomRepositoryData | null>
  getById: (id: string) => Promise<RoomRepositoryData | null>
}
