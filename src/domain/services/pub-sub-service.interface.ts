export interface PubSubServiceInterface {
  publish: (channel: string, message: string) => Promise<void>
  subscribe: (channel: string, handler: (message: string) => void) => Promise<void>
  unsubscribe: (channel: string) => Promise<void>
  disconnect: () => Promise<void>
}
