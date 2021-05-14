import store from './store'
import App from './App.vue'
import { Quasar } from 'quasar'
import { createApp } from 'vue'
import TonClient from './utils/ton'
import extension from 'extensionizer'
import { router } from './utils/router'
import iconSet from 'quasar/icon-set/line-awesome'
import { i18n, loadLocaleMessages, setI18nLanguage } from './utils/i18n'

if (extension.runtime) {
  import('./utils/extension')
}

const app = createApp(App)

app.use(TonClient.plugin)

// Quasar components
app.use(Quasar, {
  iconSet
})

app.use(i18n)
app.use(store)
app.use(router)

loadLocaleMessages(i18n, 'en')
  .then(async () => {
    // Select current network to set TonClient endpoints url
    store.commit('network/select', store.state.network.selectedId)

    app.mount('#app')

    await loadLocaleMessages(i18n, store.state.settings.locale)

    setI18nLanguage(i18n, store.state.settings.locale)
  })
