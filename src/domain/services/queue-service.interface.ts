export interface QueueServiceInterface {
  start: () => Promise<void>
  consume: (queue: string, callback: Function) => Promise<any>
  publish: (exchange: string, routingKey: string, message: string) => Promise<boolean>
  close: () => Promise<void>
}
