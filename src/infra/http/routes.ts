import { Router } from 'express'
import { requestIdMiddleware } from '../middlewares/request-id.middleware'
import { validateSchema } from '../middlewares/validate-schema.middleware'
import { expressRouteAdapter } from './express-route-adapter'
import { container } from '../container/register'
import { validateTokenMiddleware } from '../middlewares/validate-token.middleware'

const router = Router()

router.use(requestIdMiddleware)

// Hotel
router.post(
  '/hotel',
  validateSchema('createHotelSchema'),
  expressRouteAdapter(container.resolve('createHotelController'))
)

router.patch(
  '/hotel/:id',
  validateSchema('updateHotelSchema'),
  expressRouteAdapter(container.resolve('updateHotelController'))
)

router.get(
  '/hotel/:id?',
  expressRouteAdapter(container.resolve('listHotelsController'))
)

// Room
router.post(
  '/room',
  validateSchema('createRoomSchema'),
  expressRouteAdapter(container.resolve('createRoomController'))
)

router.patch(
  '/room/:id',
  validateSchema('updateRoomSchema'),
  expressRouteAdapter(container.resolve('updateRoomController'))
)

// Reservations
router.post(
  '/room/reservation',
  validateTokenMiddleware,
  validateSchema('createReservationSchema'),
  expressRouteAdapter(container.resolve('createReservationController'))
)

router.put(
  '/room/reservation/checkout/:id',
  expressRouteAdapter(container.resolve('checkoutReservationController'))
)

router.get(
  '/room/reservation/me',
  validateTokenMiddleware,
  expressRouteAdapter(container.resolve('listReservationsByGuestIController'))
)

router.put(
  '/room/reservation/cancel/:id',
  validateTokenMiddleware,
  expressRouteAdapter(container.resolve('cancelReservationController'))
)

export { router }
