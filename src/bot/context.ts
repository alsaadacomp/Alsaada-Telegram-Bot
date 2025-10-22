import type { Config } from '#root/config.js'
import type { UserPermissionContext } from '#root/modules/permissions/index.js'
import type { Logger } from '#root/modules/services/logger/index.js'
import type { AutoChatActionFlavor } from '@grammyjs/auto-chat-action'
import type { ConversationFlavor } from '@grammyjs/conversations'
import type { HydrateFlavor } from '@grammyjs/hydrate'
import type { I18nFlavor } from '@grammyjs/i18n'
import type { ParseModeFlavor } from '@grammyjs/parse-mode'
import type { Context as DefaultContext, SessionFlavor } from 'grammy'

export interface SessionData {
  awaitingInput?: {
    type: string
    messageId?: number
    data?: any
  }
  notificationData?: {
    type: string
    priority: string
    targetAudience: string
    targetRole?: string
    targetUserIds?: number[]
    message?: string
  }
  templateData?: {
    templateId: string
    variables: Record<string, string>
  }
  profileEditField?: string
  qrGenerationMode?: boolean
  // Template management
  conversationState?: string
  templateCreationMode?: string
  templateCreationData?: any
  templateEditMode?: boolean
  templateEditData?: {
    templateId: string
    originalTemplate: any
    currentTemplate?: any
  }
  templateVariableEdit?: {
    templateId: string
    variables: any[]
    selectedVariableIndex?: number
  }
}

interface ExtendedContextFlavor {
  logger: Logger
  config: Config
  dbUser?: UserPermissionContext
}

export type Context = ConversationFlavor<
  ParseModeFlavor<
    HydrateFlavor<
      DefaultContext &
      ExtendedContextFlavor &
      SessionFlavor<SessionData> &
      I18nFlavor &
      AutoChatActionFlavor
    >
  >
>
