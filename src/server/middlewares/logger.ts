import type { Logger } from '#root/modules/services/logger/index.js'
import type { MiddlewareHandler } from 'hono'

export function setLogger(logger: Logger): MiddlewareHandler {
  return async (c, next) => {
    c.set(
      'logger',
      logger.child({
        requestId: c.get('requestId'),
      }),
    )

    await next()
  }
}
