export class InvalidParamError extends Error {
  constructor (param: string) {
    super(`Invalid param: ${param}`)
    this.name = 'InvalidParamError'
  }
}

export class MissingParamError extends Error {
  constructor (param: string) {
    super(`Missing param: ${param}`)
    this.name = 'MissingParamError'
  }
}

export class ServerError extends Error {
  constructor (error?: Error) {
    super('Internal server error')
    this.name = 'ServerError'
    this.stack = error?.stack
  }
}

export class ForbiddenError extends Error {
  constructor () {
    super('Forbidden')
    this.name = 'ForbiddenError'
  }
}

export class UnauthorizedError extends Error {
  constructor () {
    super('Unauthorized')
    this.name = 'UnauthorizedError'
  }
}
export class JwtMissingError extends Error {
  constructor () {
    super('JWT token is missing')
    this.name = 'JwtMissingError'
  }
}
export class InvalidJwtError extends Error {
  constructor () {
    super('JWT token is invalid')
    this.name = 'InvalidJwtError'
  }
}
