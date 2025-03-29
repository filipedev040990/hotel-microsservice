import { RoomRepositoryData } from '../../repositories/room-repository.interface'

export type UpdateRoomUseCaseInput = {
  id: string
  number?: number
  type?: string
  capacity?: number
  description?: string
  price?: number
  status?: string
  amenities?: string
  floor?: number
}

export interface UpdateRoomUseCaseInterface {
  execute: (input: UpdateRoomUseCaseInput) => Promise<RoomRepositoryData>
}
