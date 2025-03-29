import { handleError } from '@/shared/helpers/error.helper'
import { Request, Response, NextFunction } from 'express'
import { container } from '../container/register'
import { getRequestId } from '@/shared/helpers/get-request-id.helper'

export const validateTokenMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const loggerService = container.resolve('loggerService')

  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    loggerService.error('Token is missing')
    res.status(401).json('Unauthorized')
    return
  }

  try {
    loggerService.info('Sending request to auth MS to validate access token')

    const url = `${process.env.AUTH_MS_URL!}/validate-token`
    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
        'X-App-Id': process.env.APP_ID!,
        'X-Request-Id': getRequestId()
      }
    }

    const response = await fetch(url, options)

    if (!response.ok) {
      loggerService.error('Unauthorized')
      res.status(401).json('Unauthorized')
      return
    }

    const data = await response.json()

    req.body.guestId = data?.data?.guestId
    req.body.guestEmail = data?.data?.guestEmail
    next()
  } catch (error) {
    const formattedError = handleError(error)
    loggerService.error('Error in validateTokenMiddleware', { error: formattedError })
    res.status(500).json(formattedError)
  }
}
