import { computed } from 'vue'
import { useStore } from 'vuex'
import { useTon } from '@/features/ton';
import { useRouter } from 'vue-router';

const SUB_HANDLE = '__liberton_balance_subscription'

export const useNetworking = () => {
  const ton = useTon()
  const r = useRouter()
  const store = useStore()
  const list = computed(() => store.getters['network/withIds'])
  const wallet = computed(() => store.getters['wallets/current'])
  const current = computed(() => store.getters['network/current'])
  const token = computed(() => store.getters['network/defaultToken'])
  const deployment = computed(() => store.getters['deployments/forWallet'](wallet.value.id))

  const select = async (id) => {
    if (current.value.id === id) {
      return false
    }

    if (window[SUB_HANDLE]) {
      await ton.unsubscribe(window[SUB_HANDLE])
    }

    store.commit('network/select', id)

    ton.switchNetwork(current.value.endpoints)

    runWatcher()

    if (!deployment.value || !deployment.value.address) {
      return r.push(`/deploy/${wallet.value.id}`)
    }

    r.push('/')
  }

  const runWatcher = async (s = null) => {
    const realStore = s || store

    window[SUB_HANDLE] = await ton.watchBalance(realStore.getters['deployments/addressList'], ({ result }) => {
      realStore.commit('deployments/update', result)
    })
  }

  return {
    list,
    token,
    select,
    current,
    runWatcher,
  }
}
