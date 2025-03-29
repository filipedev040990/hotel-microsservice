export type CreateRoomUseCaseInput = {
  number: number
  type: string
  capacity: number
  description: string
  price: number
  amenities: string
  floor: number
  hotelId: string
}

export interface CreateRoomUseCaseInterface {
  execute: (input: CreateRoomUseCaseInput) => Promise<{ id: string }>
}
