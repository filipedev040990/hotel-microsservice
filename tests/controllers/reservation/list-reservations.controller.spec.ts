import { ListReservationsController } from '@/controllers/reservation/list-reservations.controller'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { ListReservationsOutput } from '@/domain/usecases/reservation/list-reservations-by-guest-id-usecase.interface'
import { ListReservationsUseCaseInterface } from '@/domain/usecases/reservation/list-reservations-usecase.interface'
import { mock } from 'jest-mock-extended'

const params: any = {
  listReservationsUseCase: mock<ListReservationsUseCaseInterface>(),
  loggerService: mock<LoggerServiceInterface>()
}

const useCaseOutput: ListReservationsOutput [] = [
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
      externalCode: 'anyExternalCode',
      checkIn: '2025-06-15',
      checkOut: '2025-06-20',
      status: 'confirmed',
      reason: null,
      guestId: 'anyGuestId'
    }
  }
]

describe('ListReservationsByGuestIdController', () => {
  let sut: ListReservationsController

  beforeEach(() => {
    sut = new ListReservationsController(params)

    jest.spyOn(params.listReservationsUseCase, 'execute').mockResolvedValue(useCaseOutput)
  })

  test('should call ListReservationsUseCase.execute once and with correct values', async () => {
    await sut.execute()

    expect(params.listReservationsUseCase.execute).toBeCalledTimes(1)
  })

  test('should return a correct output', async () => {
    const output = await sut.execute()

    expect(output).toEqual({ statusCode: 200, body: useCaseOutput })
  })
})
