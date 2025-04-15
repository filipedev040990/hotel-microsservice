import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { BuildReservationEntityInput, PaymentDetails } from './reservation.types'
import { generateExternalCode, isValidEmail, isValidString } from '@/shared/helpers/string.helper'
import { ALLOWED_PAYMENT_METHODS, RESERVATION_STATUS } from '@/shared/constants'
import { randomUUID } from 'crypto'

export class ReservationEntity {
  constructor (
    public readonly id: string,
    public readonly externalCode: string,
    public readonly roomId: string,
    public readonly checkIn: string,
    public readonly checkOut: string,
    public readonly guestEmail: string,
    public readonly guestId: string,
    public readonly paymentDetails: PaymentDetails,
    public readonly status: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly reason?: string
  ) {}

  public static build (input: BuildReservationEntityInput): ReservationEntity {
    this.validateFields(input)
    this.validateChekInAndCheckout(input.checkIn, input.checkOut)
    this.validateEmail(input.guestEmail)
    this.validatePaymentDetails(input.paymentDetails)

    return this.create(input)
  }

  private static validateFields (input: BuildReservationEntityInput): void {
    const requiredFields: Array<keyof BuildReservationEntityInput> = ['roomId', 'checkIn', 'checkOut', 'guestEmail', 'guestId', 'paymentDetails']

    for (const field of requiredFields) {
      if (!input[field]) {
        throw new MissingParamError(field)
      }
    }
  }

  private static validateChekInAndCheckout (checkIn: string, checkOut: string): void {
    const checkInMs = new Date(checkIn).getTime()
    const checkOutInMs = new Date(checkOut).getTime()
    const todayInMs = new Date().getTime()

    if (checkInMs < todayInMs) {
      throw new InvalidParamError('checkIn')
    }

    if (checkOutInMs < todayInMs || checkOutInMs === checkInMs) {
      throw new InvalidParamError('checkOut')
    }
  }

  private static validateEmail (email: string): void {
    if (!isValidEmail(email)) {
      throw new InvalidParamError('guestEmail')
    }
  }

  private static validatePaymentDetails (paymentDetails: PaymentDetails): void {
    const { total, cardToken, paymentMethod } = paymentDetails

    if (total < 0) {
      throw new InvalidParamError('paymentDetails.total')
    }

    if (!ALLOWED_PAYMENT_METHODS.includes(paymentMethod)) {
      throw new InvalidParamError('paymentDetails.paymentMethod')
    }

    if (!isValidString(cardToken)) {
      throw new InvalidParamError('paymentDetails.cardToken')
    }
  }

  private static create (input: BuildReservationEntityInput): ReservationEntity {
    const { roomId, checkIn, checkOut, guestEmail, guestId, paymentDetails } = input
    const id = input.id ?? randomUUID()
    const externalCode = input.externalCode ?? generateExternalCode()
    const now = new Date()
    const createdAt = input.createdAt ?? now
    const updatedAt = input.updatedAt ?? now
    const status = input.status ?? RESERVATION_STATUS.PROCESSING

    return new ReservationEntity(id, externalCode, roomId, checkIn, checkOut, guestEmail, guestId, paymentDetails, status, createdAt, updatedAt)
  }
}
