import { computed } from 'vue'
import { useStore } from 'vuex'
import { useTon } from './ton'
import { only } from '../store/helpers'
import {
  wallets as contracts,
  getContractByHash,
  getContractBySlug,
} from '@/utils/contracts'

export const useDeployments = () => {
  const ton = useTon()
  const store = useStore()

  const current = computed(() => get())
  const currentWallet = computed(() => store.getters['wallets/current'])
  const currentNetwork = computed(() => store.getters['network/current'])
  const addressList = computed(() => store.getters['deployments/addressList'])

  const get = (wallet = null) => {
    const walletId = wallet ? wallet.id : currentWallet.value.id

    return store.getters['deployments/forWallet'](walletId)
  }

  const exists = (wallet) => {
    return !!get(wallet)
  }

  const activity = async ({ deployment, ...params }) => {
    const [transactions, count] = await ton.fetchActivity({
      ...params,
      address: deployment.address,
    })

    const lastTx = transactions.slice(-1)

    return {
      transactions,
      count: parseInt(count[0]),
      lastTxTime: lastTx.length ? lastTx[0].now : 0,
    }
  }

  const predictAddress = async (contract, wallet) => {
    const { address } = await ton.unsignedDeployMessage({
      contract,
      public: wallet.public,
    })

    return address
  }

  const deploy = async ({ wallet, password, contract: slug }) => {
    const contract = getContractBySlug(slug)
    const secret = await store.getters['wallets/getDecrypted']({
      password,
      id: wallet.id,
      field: 'secret',
    })

    const { transaction } = await ton.deploy(contract, {
      secret,
      public: wallet.public,
    })

    store.commit('deployments/upsert', {
      walletId: wallet.id,
      contract: contract.slug,
      acc_type: transaction.end_status,
      address: transaction.account_addr,
      networkId: currentNetwork.value.id,
    })

    return true
  }

  const findDeployment = async (wallet) => {
    const accounts = {}

    for (const contract of contracts) {
      const address = await predictAddress(contract, wallet)

      accounts[address] = {
        balance: null,
        slug: contract.slug,
      }
    }

    const data = await ton.fetchAccounts(Object.keys(accounts))

    data.map((i) => {
      accounts[i.id].balance = i.balance
    })

    if (!data.length) {
      return { accounts }
    }

    const deployment = data[0]
    const contract = getContractByHash(deployment.code_hash)

    if (!contract) {
      return { accounts }
    }

    store.commit('deployments/upsert', {
      walletId: wallet.id,
      address: deployment.id,
      contract: contract.slug,
      networkId: currentNetwork.value.id,

      ...only(deployment, ['acc_type', 'balance', 'boc']),
    })

    return { accounts, deployment }
  }

  return {
    get,
    deploy,
    exists,
    current,
    activity,
    contracts,
    addressList,
    predictAddress,
    findDeployment,
  }
}
