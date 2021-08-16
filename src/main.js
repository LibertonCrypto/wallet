/*
 * Styles (libs first)
 */
import 'equal-vue/dist/style.css'
import './assets/scss/app.scss'

/*
 * Libs
 */
import Equal from 'equal-vue'
import { createApp } from 'vue'

/*
 * Override components
 */
import IconOverride from './components/overrides/it-icon.vue'
import AlertOverride from './components/overrides/it-alert.vue'
import ButtonOverride from './components/overrides/it-button.vue'

/*
 * Global components
 */
import App from './App.vue'
import Copy from './components/ui/copy.vue'
import Amount from './components/ui/amount.vue'

/*
 * App parts
 */
import store from './store'
import TonClient from './utils/ton'
import { router } from './utils/router'
import { i18n, loadLocaleMessages, setI18nLanguage } from './utils/i18n'

/*
 * Features for startup
 */
import { useNetworking } from '@/features'

/*
 * Vue app
 */
const app = createApp(App)
  .use(TonClient.plugin)
  .use(i18n)
  .use(Equal)
  .use(store)
  .use(router)

app.component('Copy', Copy)
app.component('Amount', Amount)
app.component(IconOverride.name, IconOverride)
app.component(AlertOverride.name, AlertOverride)
app.component(ButtonOverride.name, ButtonOverride)

/*
 * App start & mount
 * Always load en messages as fallback locale
 */
loadLocaleMessages(i18n, 'en').then(async () => {
  const { runWatcher } = useNetworking()

  store.commit('settings/toggleTheme', 'light') // store.state.settings.theme
  // Select current network to set TonClient endpoints url
  store.commit('network/select', store.state.network.selectedId)

  app.mount('#app')

  await loadLocaleMessages(i18n, store.state.settings.locale)

  setI18nLanguage(i18n, store.state.settings.locale)

  return runWatcher(store)
})
