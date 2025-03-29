import { Address } from '../../entities/hotel/hotel.types'
import { HotelRepositoryData } from '../../repositories/hotel-repository.interface'

export type UpdateHotelUseCaseInput = {
  id: string
  name: string
  address: Address
}

export interface UpdateHotelUseCaseInterface {
  execute: (input: UpdateHotelUseCaseInput) => Promise<HotelRepositoryData>
}
