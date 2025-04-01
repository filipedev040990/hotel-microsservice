import { ReservartionRepositoryInterface } from '@/domain/repositories/reservation-repository.interface'
import { ListReservationsByGuestIdOutput } from '@/domain/usecases/reservation/list-reservations-by-guest-id-usecase.interface'
import { MissingParamError } from '@/shared/errors'
import { LoggerService } from '@/shared/services/logger.service'
import { ListReservationsByGuestIdUseCase } from '@/usecases/reservation/list-reservations-by-guest-id.usecase'
import { mock } from 'jest-mock-extended'

const params: any = {
  reservationRepository: mock<ReservartionRepositoryInterface>(),
  loggerService: mock<LoggerService>()
}

const repositoryResponse: ListReservationsByGuestIdOutput [] = [
  {
    hotel: {
      name: 'Grand Hotel',
      address: {
        country: 'USA',
        state: 'California',
        city: 'Los Angeles',
        district: 'Downtown',
        street: 'Main Street',
        number: 123,
        complement: 'Near Central Park'
      }
    },
    room: {
      id: 'abc123',
      number: '101',
      type: 'Deluxe',
      capacity: 2,
      description: 'Spacious room with ocean view',
      price: 250.75,
      amenities: 'WiFi, Air Conditioning, Mini Bar',
      floor: 10
    },
    reservation: {
      checkIn: '2025-06-15',
      checkOut: '2025-06-20',
      status: 'confirmed'
    }
  }
]

describe('ListReservationsByGuestIdUseCase', () => {
  let sut: ListReservationsByGuestIdUseCase
  let guestId: string

  beforeEach(() => {
    sut = new ListReservationsByGuestIdUseCase(params)
    guestId = 'anyGuestId'
    jest.spyOn(params.reservationRepository, 'getByGuestId').mockResolvedValue(repositoryResponse)
  })

  test('should throw if id is  not provided', async () => {
    const promise = sut.execute(undefined as any)

    await expect(promise).rejects.toThrowError(new MissingParamError('guestId'))
  })

  test('should call ReservationRepository.getByGuestId once and with correct values', async () => {
    await sut.execute(guestId)

    expect(params.reservationRepository.getByGuestId).toHaveBeenCalledTimes(1)
    expect(params.reservationRepository.getByGuestId).toHaveBeenCalledWith('anyGuestId')
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(guestId)

    expect(output).toEqual(repositoryResponse)
  })
})
