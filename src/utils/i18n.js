import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n'

export const LOCALES = {
  en: {
    name: 'English',
    image: '/img/locales/en.png',
  },
  ru: {
    name: 'Русский',
    image: '/img/locales/ru.png',
  },
}

export function setupI18n(options = { locale: 'en' }) {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    pluralizationRules: {
      /**
       * @param choice {number} a choice index given by the input to $tc: `$tc('path.to.rule', choiceIndex)`
       * @param choicesLength {number} an overall amount of available choices
       * @returns a final choice index to select plural word by
       */
      'ru': function (choice, choicesLength) {
        // this === VueI18n instance, so the locale property also exists here

        if (choice === 0) {
          return 0;
        }

        const teen = choice > 10 && choice < 20;
        const endsWithOne = choice % 10 === 1;

        if (choicesLength < 4) {
          return (!teen && endsWithOne) ? 1 : 2;
        }
        if (!teen && endsWithOne) {
          return 1;
        }
        if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
          return 2;
        }

        return (choicesLength < 4) ? 2 : 3;
      }
    },
    ...options,
  })

  setI18nLanguage(i18n, options.locale)

  return i18n
}

export function setI18nLanguage(i18n, locale) {
  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale
  } else {
    i18n.global.locale.value = locale
  }

  document.querySelector('html').setAttribute('lang', locale)
}

export async function loadLocaleMessages(i18n, locale) {
  const messages = await import(
    /* webpackChunkName: "locale-[request]" */ `../locales/${locale}.json`
  )

  i18n.global.setLocaleMessage(locale, messages.default)

  return nextTick()
}

export const i18n = setupI18n()
