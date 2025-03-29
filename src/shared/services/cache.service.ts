import { CacheServiceInterface } from '@/domain/services/cache-service.interface'
import { LoggerServiceInterface } from '@/domain/services/logger-service.interface'
import { AppContainer } from '@/infra/container/register'
import Redis from 'ioredis'

export class CacheService implements CacheServiceInterface {
  private readonly redis: Redis
  private readonly loggerService: LoggerServiceInterface

  constructor (params: AppContainer) {
    this.loggerService = params.loggerService
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10)
    })
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key)
    if (!value) {
      return null
    }
    try {
      return JSON.parse(value) as T
    } catch (error) {
      this.loggerService.error(`Error parsing cache value for key ${key}`, { error })
      return null
    }
  }

  async set<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
    const stringValue = JSON.stringify(value)
    await this.redis.set(key, stringValue, 'EX', ttl)
  }

  async del (key: string): Promise<void> {
    await this.redis.del(key)
  }

  async exists (key: string): Promise<boolean> {
    const result = await this.redis.exists(key)
    return result === 1
  }
}
