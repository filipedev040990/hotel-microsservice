import { MissingParamError } from '@/shared/errors'
import { Address, BuildHotelEntityInput } from './hotel.types'
import { randomUUID } from 'crypto'
import { generateExternalCode } from '@/shared/helpers/string.helper'

export class HotelEntity {
  constructor (
    public id: string,
    public externalCode: string,
    public name: string,
    public address: Address,
    public createdAt: Date,
    public updatedAt?: Date
  ) {}

  public static build (input: BuildHotelEntityInput): HotelEntity {
    this.validate(input)
    return this.create(input)
  }

  private static validate (input: BuildHotelEntityInput): void {
    if (!input.name) {
      throw new MissingParamError('name')
    }

    if (!input.address) {
      throw new MissingParamError('address')
    }

    const addressRequiredFields: Array<keyof Address> = ['country', 'city', 'state', 'district', 'street', 'number']

    for (const field of addressRequiredFields) {
      if (!input.address[field]) {
        throw new MissingParamError(field)
      }
    }
  }

  private static create (input: BuildHotelEntityInput): HotelEntity {
    const { name, address } = input
    const id = input.id ?? randomUUID()
    const externalCode = input.externalCode ?? generateExternalCode()
    const now = new Date()
    const createdAt = input.createdAt ?? now
    const updatedAt = input.updatedAt ?? now

    return new HotelEntity(id, externalCode, name, address, createdAt, updatedAt)
  }
}
