<template>
  <q-select dense :options="availableLocales" v-model="locale" dropdown-icon="las la-angle-down">
    <template v-slot:prepend>
      <q-icon name="las la-globe" />
    </template>
    <template v-slot:selected-item="scope">
      {{ currentLocale.name }}
    </template>
  </q-select>
</template>

<script setup>
  import { computed } from 'vue'
  import { useStore } from 'vuex'
  import { LOCALES, i18n, setI18nLanguage, loadLocaleMessages } from '@utils/i18n'

  const { state, getters, commit } = useStore()

  const locale = computed({
    get: () => state.settings.locale,
    set: async (sel) => {
      const locale = sel.value

      commit('settings/set', { locale })

      if (!i18n.global.availableLocales.includes(locale)) {
        await loadLocaleMessages(i18n, locale)
      }

      setI18nLanguage(i18n, locale)
    }
  })

  const currentLocale = computed(() => LOCALES[state.settings.locale])

  const availableLocales = Object.entries(LOCALES)
      .map(([key, locale]) => ({ value: key, label: locale.name }))
</script>
