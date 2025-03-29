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

router.post(
  '/room/reservation',
  validateTokenMiddleware,
  validateSchema('createReservationSchema'),
  expressRouteAdapter(container.resolve('createReservationController'))
)

export { router }
