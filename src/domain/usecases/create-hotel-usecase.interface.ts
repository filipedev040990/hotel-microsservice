import { Address } from '../entities/hotel.types'

export type CreateHotelUseCaseInput = {
  name: string
  address: Address
}

export interface CreateHotelUseCaseInterface {
  execute: (input: CreateHotelUseCaseInput) => Promise<void>
}
