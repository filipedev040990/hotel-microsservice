import { HotelEntity } from '@/domain/entities/hotel.entity'
import { BuildHotelEntityInput } from '@/domain/entities/hotel.types'
import { MissingParamError } from '@/shared/errors'

describe('HotelEntity', () => {
  let sut: any
  let input: BuildHotelEntityInput

  beforeEach(() => {
    sut = HotelEntity
    input = {
      name: 'Hotel Top',
      address: {
        country: 'Brazil',
        city: 'Barbacena',
        state: 'MG',
        district: 'Centro',
        street: 'Rua Teste',
        number: 123
      }
    }
  })

  test('should throw if name is not provided', () => {
    input.name = undefined as any
    expect(() => {
      sut.build(input)
    }).toThrowError(new MissingParamError('name'))
  })

  test('should throw if any address required field are not provided', () => {
    input = {
      name: 'Hotel Top',
      address: {
        country: undefined as any,
        city: 'Barbacena',
        state: 'MG',
        district: 'Centro',
        street: 'Rua Teste',
        number: 123
      }
    }
    expect(() => {
      sut.build(input)
    }).toThrowError(new MissingParamError('country'))

    input = {
      name: 'Hotel Top',
      address: {
        country: 'Brazil',
        city: undefined as any,
        state: 'MG',
        district: 'Centro',
        street: 'Rua Teste',
        number: 123
      }
    }
    expect(() => {
      sut.build(input)
    }).toThrowError(new MissingParamError('city'))

    input = {
      name: 'Hotel Top',
      address: {
        country: 'Brazil',
        city: 'Barbacena',
        state: undefined as any,
        district: 'Centro',
        street: 'Rua Teste',
        number: 123
      }
    }
    expect(() => {
      sut.build(input)
    }).toThrowError(new MissingParamError('state'))

    input = {
      name: 'Hotel Top',
      address: {
        country: 'Brazil',
        city: 'Barbacena',
        state: 'MG',
        district: undefined as any,
        street: 'Rua Teste',
        number: 123
      }
    }
    expect(() => {
      sut.build(input)
    }).toThrowError(new MissingParamError('district'))

    input = {
      name: 'Hotel Top',
      address: {
        country: 'Brazil',
        city: 'Barbacena',
        state: 'MG',
        district: 'Centro',
        street: undefined as any,
        number: 123
      }
    }
    expect(() => {
      sut.build(input)
    }).toThrowError(new MissingParamError('street'))

    input = {
      name: 'Hotel Top',
      address: {
        country: 'Brazil',
        city: 'Barbacena',
        state: 'MG',
        district: 'Centro',
        street: 'Rua Teste',
        number: undefined as any
      }
    }
    expect(() => {
      sut.build(input)
    }).toThrowError(new MissingParamError('number'))
  })

  test('should return a correct Entity', () => {
    const entity = sut.build(input)

    expect(entity.id).toBeDefined()
    expect(entity.name).toBe('Hotel Top')
    expect(entity.externalCode).toBeDefined()
    expect(entity.address).toBeDefined()
    expect(entity.address.country).toBe('Brazil')
    expect(entity.address.city).toBe('Barbacena')
    expect(entity.address.state).toBe('MG')
    expect(entity.address.district).toBe('Centro')
    expect(entity.address.street).toBe('Rua Teste')
    expect(entity.address.number).toBe(123)
  })
})
