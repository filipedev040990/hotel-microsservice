import { ReservationEntity } from '../entities/reservation/reservation.entity'

export interface ReservationMessagePublisherInterface {
  publishNewReservation: (reservation: ReservationEntity) => Promise<void>
}
