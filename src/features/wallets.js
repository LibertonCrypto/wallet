import { computed } from 'vue'
import { useStore } from 'vuex'
import { useAccounts } from '@/features'

export const useWallets = () => {
  const store = useStore()
  const current = computed(() => store.getters['wallets/current'])
  const currentAccount = computed(() => store.getters['accounts/current'])

  const list = computed(() => {
    if (!currentAccount.value) {
      return []
    }

    return forAccount(currentAccount.value.id)
  })

  const create = (data) => {
    return store.dispatch('wallets/create', data)
  }

  const forAccount = (id) => {
    return store.getters['wallets/forAccount'](id)
  }

  const update = (id, data) => {
    store.commit('wallets/update', {
      id,
      data,
    })

    return true
  }

  const getById = (id) => {
    const wallet = store.state.wallets.items[id]

    if (!wallet) {
      return null
    }

    return {
      id,
      ...wallet,
    }
  }

  /**
   * id = 0; selects first wallet for account
   * id = null; reset select
   * @param id
   */
  const select = (id = null) => {
    if (id === 0) {
      return store.commit('wallets/select', null)
    }

    const realId = id || list.value[0].id

    return store.commit('wallets/select', realId)
  }

  return {
    list,
    update,
    create,
    select,
    current,
    getById,
    forAccount,
  }
}
