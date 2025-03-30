import { CreateReservationController } from '@/controllers/reservation/create-reservation.controller'
import { HttpRequest } from '@/domain/controller/controller.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { CreateReservationUseCaseInterface } from '@/domain/usecases/reservation/create-reservation-usecase.interface'
import { mock } from 'jest-mock-extended'

const params: any = {
  createReservationUseCase: mock<CreateReservationUseCaseInterface>(),
  loggerService: mock<LoggerServiceInterface>()
}

const useCaseOutput = {
  id: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8',
  roomId: 'anyRoomId',
  checkIn: '2050-12-31',
  checkOut: '2051-01-07',
  status: 'in_process_booking',
  paymentStatus: 'processing',
  createdAt: new Date('2025-03-01')
}

describe('CreateReservationController', () => {
  let sut: CreateReservationController
  let input: HttpRequest

  beforeEach(() => {
    sut = new CreateReservationController(params)
    input = {
      body: {
        roomId: 'anyRoomId',
        checkIn: '2050-12-31',
        checkOut: '2051-01-07',
        guestEmail: 'ze@email.com',
        paymentDetails: {
          paymentMethod: 'credit_card',
          cardToken: 's13as132ad564w87ef465d4s654d65as465dsfgfmkljpefkffr',
          total: 250000
        }
      }
    }

    jest.spyOn(params.createReservationUseCase, 'execute').mockResolvedValue(useCaseOutput)
  })

  test('should call CreateHotelUseCase.execute once and with correct values', async () => {
    await sut.execute(input)

    expect(params.createReservationUseCase.execute).toBeCalledTimes(1)
    expect(params.createReservationUseCase.execute).toBeCalledWith(input.body)
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)

    expect(output).toEqual({ statusCode: 200, body: useCaseOutput })
  })
})
