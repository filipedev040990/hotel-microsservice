import { Router } from 'express'
import { requestIdMiddleware } from '../middlewares/request-id.middleware'
import { validateSchema } from '../middlewares/validate-schema.middleware'
import { expressRouteAdapter } from './express-route-adapter'
import { container } from '../container/register'

const router = Router()

router.use(requestIdMiddleware)

router.post(
  '/hotel',
  validateSchema('createHotelSchema'),
  expressRouteAdapter(container.resolve('createHotelController'))
)

export { router }
