import { ReservationEntity } from '@/domain/entities/reservation/reservation.entity'
import { BuildReservationEntityInput } from '@/domain/entities/reservation/reservation.types'
import { InvalidParamError, MissingParamError } from '@/shared/errors'
import MockDate from 'mockdate'

describe('ReservationEntity', () => {
  let sut: any
  let input: BuildReservationEntityInput

  beforeAll(() => {
    MockDate.set(new Date('2025-01-01'))
  })

  beforeEach(() => {
    sut = ReservationEntity
    input = {
      hotelId: 'f6105aab-1133-41bd-bf17-1be81a9bb865',
      roomId: '2c1d4d45-91b8-4a2e-94b8-b3f52b9b3f49',
      checkIn: '2025-04-01',
      checkOut: '2025-04-05',
      guestName: 'Filipe Silva',
      guestEmail: 'filipe@email.com',
      paymentDetails: {
        total: 15000,
        paymentMethod: 'credit_card',
        cardToken: '2c1d4d45-91b8-4a2e-94b8-b3f52b9b3f4f6105aab-1133-41bd-bf17-1be81a9bb8659'
      }
    }
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should throw if any required field is empty', () => {
    const requiredFields: Array<keyof BuildReservationEntityInput> = ['hotelId', 'roomId', 'checkIn', 'checkOut', 'guestName', 'guestEmail', 'paymentDetails']

    for (const field of requiredFields) {
      const fieldBackup = input[field]

      input[field] = undefined as any

      expect(() => {
        sut.build(input)
      }).toThrowError(new MissingParamError(field))

      input[field] = fieldBackup as any
    }
  })

  test('should throw if a invalid checkIn is provided', () => {
    input.checkIn = '1990-01-01'

    expect(() => {
      sut.build(input)
    }).toThrowError(new InvalidParamError('checkIn'))
  })

  test('should throw if a invalid checkOut is provided', () => {
    input.checkOut = '1990-01-01'

    expect(() => {
      sut.build(input)
    }).toThrowError(new InvalidParamError('checkOut'))

    input.checkOut = input.checkIn

    expect(() => {
      sut.build(input)
    }).toThrowError(new InvalidParamError('checkOut'))
  })

  test('should throw id a invalid email is provided', () => {
    input.guestEmail = 'invalid Email'

    expect(() => {
      sut.build(input)
    }).toThrowError(new InvalidParamError('guestEmail'))
  })

  test('should throw if a invalid paymentDetails is provided', () => {
    input.paymentDetails.total = -50

    expect(() => {
      sut.build(input)
    }).toThrowError(new InvalidParamError('paymentDetails.total'))

    input.paymentDetails.total = 15000
    input.paymentDetails.paymentMethod = 'invalid payment method'

    expect(() => {
      sut.build(input)
    }).toThrowError(new InvalidParamError('paymentDetails.paymentMethod'))

    input.paymentDetails.total = 15000
    input.paymentDetails.paymentMethod = 'credit_card'
    input.paymentDetails.cardToken = undefined as any

    expect(() => {
      sut.build(input)
    }).toThrowError(new InvalidParamError('paymentDetails.cardToken'))
  })

  test('should return a correct Entity', () => {
    const entity = sut.build(input)

    expect(entity.id).toBeDefined()
    expect(entity.hotelId).toBe('f6105aab-1133-41bd-bf17-1be81a9bb865')
    expect(entity.roomId).toBe('2c1d4d45-91b8-4a2e-94b8-b3f52b9b3f49')
    expect(entity.checkIn).toBe('2025-04-01')
    expect(entity.checkOut).toBe('2025-04-05')
    expect(entity.guestName).toBe('Filipe Silva')
    expect(entity.guestEmail).toBe('filipe@email.com')
    expect(entity.paymentDetails).toEqual({
      total: 15000,
      paymentMethod: 'credit_card',
      cardToken: '2c1d4d45-91b8-4a2e-94b8-b3f52b9b3f4f6105aab-1133-41bd-bf17-1be81a9bb8659'
    })
    expect(entity.createdAt).toBeDefined()
    expect(entity.updatedAt).toBeDefined()
    expect(entity.status).toBe('processing')
  })
})
