import { z } from 'zod'

export const createHotelSchema = z.object({
  name: z.string(),
  address: z.object({
    country: z.string(),
    state: z.string(),
    city: z.string(),
    district: z.string(),
    street: z.string(),
    number: z.number(),
    complement: z.string().optional()
  })
})
