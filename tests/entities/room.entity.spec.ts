import { RoomEntity } from '@/domain/entities/room.entity'
import { BuildRoomEntityInput } from '@/domain/entities/room.types'
import { InvalidParamError, MissingParamError } from '@/shared/errors'
import MockDate from 'mockdate'

describe('RoomEntity', () => {
  let sut: any
  let input: any

  beforeAll(() => {
    MockDate.set(new Date())
  })

  beforeEach(() => {
    sut = RoomEntity
    input = {
      number: 123,
      description: 'Suite Presidencial',
      type: 'suite',
      capacity: 2,
      amenities: 'Wi-fi, TV a cabo, Ar condicionado',
      floor: 2,
      price: 80000,
      status: 'available',
      hotelId: 'anyHotelId'
    }
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should throw if room number is not provided', () => {
    const requiredFields: Array<keyof BuildRoomEntityInput> = ['number', 'description', 'type', 'capacity', 'amenities', 'floor', 'price', 'status', 'hotelId']

    for (const field of requiredFields) {
      const fieldBackup = input[field]

      input[field] = undefined

      expect(() => {
        sut.build(input)
      }).toThrowError(new MissingParamError(field))

      input[field] = fieldBackup
    }
  })

  test('should throw if a invalid type is provided', () => {
    input.type = 'any'
    expect(() => {
      sut.build(input)
    }).toThrowError(new InvalidParamError('type'))
  })

  test('should throw if a invalid price is provided', () => {
    input.price = -1
    expect(() => {
      sut.build(input)
    }).toThrowError(new InvalidParamError('price'))
  })

  test('should return a correct Entity', () => {
    const entity = sut.build(input)

    expect(entity.id).toBeDefined()
    expect(entity.number).toBe(123)
    expect(entity.description).toBe('Suite Presidencial')
    expect(entity.type).toBe('suite')
    expect(entity.capacity).toBe(2)
    expect(entity.amenities).toBe('Wi-fi, TV a cabo, Ar condicionado')
    expect(entity.floor).toBe(2)
    expect(entity.price).toBe(80000)
    expect(entity.status).toBe('available')
    expect(entity.hotelId).toBe('anyHotelId')
  })
})
