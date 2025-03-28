import { randomUUID } from 'crypto'
import { container } from '../container/register'
import { Request, Response } from 'express'
import { obfuscateValue } from '@/shared/helpers/string.helper'
import { getRequestId } from '@/shared/helpers/get-request-id.helper'
import { prismaClient } from '../database/prisma-client'
import { ControllerInterface, HttpRequest } from '@/domain/controller/controller.interface'

export const expressRouteAdapter = (controller: ControllerInterface) => {
  return async (req: Request, res: Response) => {
    const input: HttpRequest = {
      body: req?.body,
      params: req?.params,
      query: req?.query,
      headers: req?.headers
    }

    const loggerService = container.resolve('loggerService')

    const obfuscatedBody = obfuscateValue(JSON.parse(JSON.stringify(input.body)))

    loggerService.info('Started request', {
      method: req.method,
      route: req.url,
      input: JSON.stringify(obfuscatedBody)
    })

    const { statusCode, body } = await controller.execute(input)

    const output = (statusCode >= 200 && statusCode <= 499) ? body : { error: body.message }
    let outputToLog = null

    if (canLogRequest(req)) {
      await logRequest(req, input, statusCode, output)
      outputToLog = JSON.stringify(output)
    }

    loggerService.info('Finished request', {
      output: outputToLog
    })

    res.status(statusCode).json(output)
  }
}

const canLogRequest = (req: Request): boolean => {
  return req.method !== 'GET' && req.url !== '/hotel'
}

const logRequest = async (req: Request, input: any, statusCode: number, output: any): Promise<void> => {
  await prismaClient.request.create({
    data: {
      id: randomUUID(),
      method: req.method,
      requestId: getRequestId(),
      input: JSON.stringify(input.body),
      route: req.url,
      createdAt: new Date(),
      status: statusCode,
      output: JSON.stringify(output),
      updatedAt: new Date()
    }
  })
}
