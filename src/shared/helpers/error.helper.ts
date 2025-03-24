import { HttpResponse } from '@/domain/adapter/controllers/controller.interface'
import { ConflictResourceError, ForbiddenError, InvalidJwtError, InvalidParamError, JwtMissingError, MissingParamError, UnauthorizedError } from '../errors'
import { badRequest, conflict, forbidden, serverError, unauthorized } from './http.helper'

export const handleError = (error: any): HttpResponse => {
  if (error instanceof InvalidParamError || error instanceof MissingParamError) {
    return badRequest(error)
  }

  if (error instanceof UnauthorizedError) {
    return unauthorized(error)
  }

  if (error instanceof ForbiddenError || error instanceof JwtMissingError || error instanceof InvalidJwtError) {
    return forbidden(error)
  }

  if (error instanceof ConflictResourceError) {
    return conflict(error)
  }

  return serverError(error)
}
