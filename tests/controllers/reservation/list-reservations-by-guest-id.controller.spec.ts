import { ListReservationsByGuestIdController } from '@/controllers/reservation/list-reservations-by-guest-id.controller'
import { HttpRequest } from '@/domain/controller/controller.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { ListReservationsOutput, ListReservationsByGuestIdUseCaseInterface } from '@/domain/usecases/reservation/list-reservations-by-guest-id-usecase.interface'
import { mock } from 'jest-mock-extended'

const params: any = {
  listReservationsByGuestIdUseCase: mock<ListReservationsByGuestIdUseCaseInterface>(),
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
  let sut: ListReservationsByGuestIdController
  let input: HttpRequest

  beforeEach(() => {
    sut = new ListReservationsByGuestIdController(params)
    input = {
      body: {
        guestId: 'anyGuestId'
      }
    }

    jest.spyOn(params.listReservationsByGuestIdUseCase, 'execute').mockResolvedValue(useCaseOutput)
  })

  test('should call ListReservationsByGuestIdUseCase.execute once and with correct values', async () => {
    await sut.execute(input)

    expect(params.listReservationsByGuestIdUseCase.execute).toBeCalledTimes(1)
    expect(params.listReservationsByGuestIdUseCase.execute).toBeCalledWith(input.body.guestId)
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)

    expect(output).toEqual({ statusCode: 200, body: useCaseOutput })
  })
})
