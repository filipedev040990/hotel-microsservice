import { z } from 'zod'

export const updateRoomSchema = z.object({
  number: z.number().positive().optional(),
  type: z.string().optional(),
  capacity: z.number().optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  amenities: z.string().optional(),
  floor: z.number().positive().optional()
})
