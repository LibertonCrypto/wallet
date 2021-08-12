<template>
  <div class="locale-select">
    <it-dropdown placement="top">
      <img :src="currentLocale.image" /> {{ currentLocale.name }}

      <template #menu>
        <it-dropdown-menu>
          <it-dropdown-item
            v-for="l of availableLocales"
            :key="l.value"
            @click="locale = l.value"
            >{{ l.name }}</it-dropdown-item
          >
        </it-dropdown-menu>
      </template>
    </it-dropdown>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import {
  LOCALES,
  i18n,
  setI18nLanguage,
  loadLocaleMessages,
} from '@/utils/i18n'

const { state, getters, commit } = useStore()

const locale = computed({
  get: () => state.settings.locale,
  set: async (locale) => {
    commit('settings/set', { locale })

    if (!i18n.global.availableLocales.includes(locale)) {
      await loadLocaleMessages(i18n, locale)
    }

    setI18nLanguage(i18n, locale)
  },
})

const currentLocale = computed(() => LOCALES[state.settings.locale])

const availableLocales = Object.entries(LOCALES).map(([key, locale]) => ({
  value: key,
  name: locale.name,
}))
</script>
