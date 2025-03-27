import { z } from 'zod'

export const createRoomSchema = z.object({
  number: z.number().positive(),
  type: z.string(),
  capacity: z.number(),
  description: z.string(),
  price: z.number().positive(),
  amenities: z.string(),
  floor: z.number().positive(),
  hotelId: z.string()
})
