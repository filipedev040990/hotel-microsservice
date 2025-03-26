import { z } from 'zod'

export const updateHotelSchema = z.object({
  name: z.string().optional(),
  address: z.object({
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    district: z.string().optional(),
    street: z.string().optional(),
    number: z.number().optional(),
    complement: z.string().optional()
  }).optional()
})
