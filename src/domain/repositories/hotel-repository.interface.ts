import { ListHotelsUseCaseOutput } from '../usecases/list-hotels-usecase.interface'

export type HotelRepositoryData = {
  id: string
  externalCode: string
  name: string
  country: string
  state: string
  city: string
  district: string
  street: string
  number: number
  complement?: string
  createdAt: Date
  updatedAt: Date
}

export interface HotelRepositoryInterface {
  save: (input: HotelRepositoryData) => Promise<void>
  update: (input: HotelRepositoryData) => Promise<void>
  getById: (id: string) => Promise<HotelRepositoryData | null>
  find: (hotelId?: string) => Promise<ListHotelsUseCaseOutput[]>
}
