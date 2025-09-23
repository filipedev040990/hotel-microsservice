import { createNamespace, getNamespace, Namespace } from 'cls-hooked'
import { randomUUID } from 'crypto'

const NAMESPACE_NAME = 'requestContext'

function getOrCreateNamespace(): Namespace {
  return getNamespace(NAMESPACE_NAME) ?? createNamespace(NAMESPACE_NAME)
}

export const requestContext = getOrCreateNamespace()

export function runWithRequestContext<T>(fn: () => T | Promise<T>, requestId?: string): T | Promise<T> {
  return requestContext.runAndReturn(() => {
    requestContext.set('requestId', requestId ?? randomUUID())
    return fn()
  })
}

export function getRequestId(): string {
  return requestContext.get('requestId')
}
