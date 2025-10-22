import type { Context } from '#root/bot/context.js'
import { logHandle } from '#root/bot/helpers/logging.js'
import { changeLanguageData } from '#root/modules/interaction/menus/callback-data/change-language.js'
import { createChangeLanguageKeyboard } from '#root/modules/interaction/menus/change-language.js'
import { i18n } from '#root/modules/services/i18n-extended/i18n.js'
import { Composer } from 'grammy'

const composer = new Composer<Context>()

const feature = composer.chatType('private')

feature.command('language', logHandle('command-language'), async (ctx) => {
  return ctx.reply(ctx.t('language-select'), {
    reply_markup: await createChangeLanguageKeyboard(ctx),
  })
})

feature.callbackQuery(
  changeLanguageData.filter(),
  logHandle('keyboard-language-select'),
  async (ctx) => {
    const { code: languageCode } = changeLanguageData.unpack(
      ctx.callbackQuery.data,
    )

    if (i18n.locales.includes(languageCode)) {
      await ctx.i18n.setLocale(languageCode)

      return ctx.editMessageText(ctx.t('language-changed'), {
        reply_markup: await createChangeLanguageKeyboard(ctx),
      })
    }
  },
)

export { composer as languageFeature }
