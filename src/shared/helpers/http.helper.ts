import { HttpResponse } from '@/domain/controller/controller.interface'

export const success = (statusCode: number, body: any): HttpResponse => ({
  statusCode,
  body
})

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: {
    error: error.name,
    message: error.message
  }
})

export const unauthorized = (error: Error): HttpResponse => ({
  statusCode: 401,
  body: {
    error: error.name,
    message: error.message
  }
})

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: {
    error: error.name,
    message: error.message
  }
})

export const serverError = (error: Error): HttpResponse => {
  return {
    statusCode: 500,
    body: {
      error: error.name,
      message: error.message
    }
  }
}

export const conflict = (error: Error): HttpResponse => ({
  statusCode: 409,
  body: {
    error: error.name,
    message: error.message
  }
})
