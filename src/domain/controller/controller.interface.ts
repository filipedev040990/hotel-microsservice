export type HttpRequest = {
  body?: any
  params?: any
  query?: any
  headers?: any
}

export type HttpResponse = {
  statusCode: number
  body: any
}

export interface ControllerInterface {
  execute: (input: HttpRequest) => Promise<HttpResponse>
}
