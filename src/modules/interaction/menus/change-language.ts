import type { Context } from '#root/bot/context.js'
import { changeLanguageData } from '#root/modules/interaction/menus/callback-data/change-language.js'
import { chunk } from '#root/modules/interaction/menus/helpers/keyboard.js'
import { i18n } from '#root/modules/services/i18n-extended/i18n.js'
import { InlineKeyboard } from 'grammy'
import ISO6391 from 'iso-639-1'

export async function createChangeLanguageKeyboard(ctx: Context) {
  const currentLocaleCode = await ctx.i18n.getLocale()

  const getLabel = (code: string) => {
    const isActive = code === currentLocaleCode

    return `${isActive ? '✅ ' : ''}${ISO6391.getNativeName(code)}`
  }

  return InlineKeyboard.from(
    chunk(
      i18n.locales.map(localeCode => ({
        text: getLabel(localeCode),
        callback_data: changeLanguageData.pack({
          code: localeCode,
        }),
      })),
      2,
    ),
  )
}
