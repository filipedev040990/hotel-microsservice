export const ALLOWED_PAYMENT_METHODS = ['credit_card', 'pix']

export const RESERVATION_STATUS = {
  PROCESSING: 'processing',
  CONFIRMED: 'confirmed',
  CANCELED: 'canceled',
  FINISHED: 'finished',
  REFUSED: 'refused'
}

export const PAYMENT_STATUS = {
  PROCESSING: 'processing',
  CONFIRMED: 'confirmed',
  CANCELED: 'canceled',
  REFUNDED: 'refunded'
}

export const NEW_RESERVATION_EXCHANGE_NAME = 'new_reservation'
export const NEW_RESERVATION_ROUNTING_KEY_NAME = 'process_payment'

export const ROOM_STATUS = {
  AVAILABLE: 'available',
  RESERVED: 'reserved',
  IN_PROCESS_BOOKING: 'in_process_booking'
}

export const HOTELS_CACHE_KEY = 'hotels_list'

export const REFUSED_PAYMENT = 'Refused payment'

export const RESERVATION_CANCELED_BY_CLINET = 'Reservation canceled by client'
export const RABBIT_MQ_URI = 'amqp://admin:admin@rabbitmq:5672'

export const QUEUES = ['processed_reservation_payment']
