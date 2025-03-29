import { z } from 'zod'

export const createReservationSchema = z.object({
  roomId: z.string(),
  checkIn: z.string(),
  checkOut: z.string(),
  paymentDetails: z.object({
    total: z.number(),
    paymentMethod: z.string(),
    cardToken: z.string()
  })
})
