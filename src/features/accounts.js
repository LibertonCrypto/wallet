import { useTon } from './ton'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useWallets } from './wallets'
import { useRouter } from 'vue-router'

export const useAccounts = () => {
  const ton = useTon()
  const store = useStore()
  const { push } = useRouter()
  const { select: selectWallet } = useWallets()

  const count = computed(() => store.getters['accounts/count'])
  const list = computed(() => store.getters['accounts/withIds'])
  const current = computed(() => store.getters['accounts/current'])

  const select = (id = null) => {
    const realId = id || store.state.accounts.ids[0]

    if (!realId) {
      return push('/create')
    }

    store.commit('accounts/select', realId)
    selectWallet()

    return push('/')
  }

  const create = async (options) => {
    const xprv = await ton.getMasterKey(options)

    await store.dispatch('accounts/create', {
      xprv,
      ...options,
    })
  }

  const remove = async (id) => {
    store.commit('accounts/remove', id)
    store.commit('wallets/removeBy', {
      accountId: id,
    })
  }

  const update = async (id, data) => {
    store.commit('accounts/update', { id, data })
  }

  const checkPassword = (password, accountId = null) => {
    return store.getters['accounts/passwordCheck']({
      password,
      id: accountId,
    })
  }

  return {
    list,
    count,
    remove,
    create,
    select,
    update,
    current,
    checkPassword,
  }
}
