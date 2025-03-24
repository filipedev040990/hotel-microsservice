import 'module-alias/register'
import { router } from './routes'
import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from '@/infra/tools/swagger.json'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/v1', router)

const port = process.env.PORT ?? 3000

app.listen(port, () => console.log(`Server running at port ${port}`))
