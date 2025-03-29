import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { BuildRoomEntityInput } from './room.types'
import { randomUUID } from 'crypto'
import { generateExternalCode } from '@/shared/helpers/string.helper'

export class RoomEntity {
  constructor (
    public id: string,
    public externalCode: string,
    public number: number,
    public type: string,
    public capacity: number,
    public description: string,
    public price: number,
    public status: string,
    public amenities: string,
    public floor: number,
    public hotelId: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  public static build (input: BuildRoomEntityInput): RoomEntity {
    this.validateRequiredFields(input)
    this.validateType(input.type)
    this.validatePrice(input.price)

    return this.create(input)
  }

  private static validateRequiredFields (input: BuildRoomEntityInput): void {
    const requiredFields: Array<keyof BuildRoomEntityInput> = ['number', 'description', 'type', 'capacity', 'amenities', 'floor', 'price', 'status', 'hotelId']

    for (const field of requiredFields) {
      if (!input[field]) {
        throw new MissingParamError(field)
      }
    }
  }

  private static validateType (type: string): void {
    if (!['simple', 'suite'].includes(type)) {
      throw new InvalidParamError('type')
    }
  }

  private static validatePrice (price: number): void {
    if (price < 0) {
      throw new InvalidParamError('price')
    }
  }

  private static create (input: BuildRoomEntityInput): RoomEntity {
    const { number, type, capacity, description, price, amenities, floor, hotelId, status } = input
    const id = input.id ?? randomUUID()
    const externalCode = input.externalCode ?? generateExternalCode()
    const now = new Date()
    const createdAt = input.createdAt ?? now
    const updatedAt = input.updatedAt ?? now

    return new RoomEntity(id, externalCode, number, type, capacity, description, price, status, amenities, floor, hotelId, createdAt, updatedAt)
  }
}
