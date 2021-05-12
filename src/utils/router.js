import store from '../store'
import { createRouter, createWebHashHistory } from 'vue-router'
import { LOCALES, loadLocaleMessages, setI18nLanguage, i18n } from './i18n'

/*
 * Layouts
 */
import AccountLayout from '../components/layout/account.vue'

/*
 * Views
 */
import Home from '../views/home.vue'
import Transfer from '../views/transfer.vue'
import CreateAccount from '../views/create-account.vue'

const routes = [
  {
    name: 'create',
    path: '/create',
    component: CreateAccount
  },
  {
    path: '/',
    component: AccountLayout,
    meta: {
      accountRequired: true
    },

    children: [
      {
        path: '/',
        name: 'home',
        component: Home
      },
      {
        name: 'transfer',
        path: '/transfer',
        component: Transfer
      }
    ]
  }
]

export const router = createRouter({
  routes,
  history: createWebHashHistory()
})

router.beforeEach(async (to, from, next) => {
  const locale = store.state.settings.locale

  if (!i18n.global.availableLocales.includes(locale)) {
    await loadLocaleMessages(i18n, locale)
  }

  if (to.meta?.accountRequired && store.getters['accounts/count'] === 0) {
    return next('/create')
  }

  return next()
})
