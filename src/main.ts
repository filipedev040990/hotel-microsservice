import 'module-alias/register'
import { container } from './infra/container/register'
import { router } from './infra/http/routes'
import express from 'express'
import cors from 'cors'

const main = async (): Promise<void> => {
  const loggerService = container.resolve('loggerService')
  const consumeQueues = container.resolve('consumeQueueMessages')
  const app = express()

  app.use(cors())
  app.use(express.json())
  app.use('/v1', router)

  const port = process.env.PORT ?? 3002

  app.listen(port, () => loggerService.info(`Server running at port ${port}`))

  await consumeQueues.execute()
}

void main()
