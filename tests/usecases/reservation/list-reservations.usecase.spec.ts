import { ReservartionRepositoryInterface } from '@/domain/repositories/reservation-repository.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { ListReservationsOutput } from '@/domain/usecases/reservation/list-reservations-by-guest-id-usecase.interface'
import { ListReservationsUseCase } from '@/usecases/reservation/list-reservations.usecase'
import { mock } from 'jest-mock-extended'

const params: any = {
  reservationRepository: mock<ReservartionRepositoryInterface>(),
  loggerService: mock<LoggerServiceInterface>()
}

const repositoryResponse: ListReservationsOutput [] = [
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
      id: 'anyReservationId',
      checkIn: '2025-06-15',
      checkOut: '2025-06-20',
      status: 'confirmed',
      reason: null
    }
  }
]

describe('ListReservationsUseCase', () => {
  let sut: ListReservationsUseCase

  beforeEach(() => {
    sut = new ListReservationsUseCase(params)
    jest.spyOn(params.reservationRepository, 'get').mockResolvedValue(repositoryResponse)
  })

  test('should call reservationRepository.get', async () => {
    await sut.execute()
    expect(params.reservationRepository.get).toHaveBeenCalledTimes(1)
  })

  test('should return a correct output', async () => {
    const output = await sut.execute()

    expect(output).toEqual(repositoryResponse)
  })
})
