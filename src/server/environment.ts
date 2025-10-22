import type { Logger } from '#root/modules/services/logger/index.js'

export interface Env {
  Variables: {
    requestId: string
    logger: Logger
  }
}
