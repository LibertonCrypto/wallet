import { v4 } from 'uuid'
import { ton } from '@utils/ton'
import { toNano } from '@utils/convert'
import { getContractByHash, getContractBySlug } from '@utils/contracts'

const withIds = state => Object.entries(state.items)
  .map(([id, data]) => ({ id, ...data }))

const only = (obj, keys) => {
  const res = {}

  for (const k of keys) {
    res[k] = obj[k]
  }

  return res
}

export default {
  namespaced: true,
  state: {
    ids: [],
    items: {}
  },

  mutations: {
    upsert (state, payload) {
      const list = withIds(state)
      const exists = list.find(d => d.address === payload.address && d.networkId === payload.networkId)

      if (exists) {
        return Object.assign(state.items[exists.id], payload)
      }

      const id = v4()

      state.ids.push(id)
      state.items[id] = payload
    }
  },

  getters: {
    withIds,

    forWallet: (state, getters, rootState) => walletId => {
      const networkId = rootState.network.selectedId

      return getters.withIds
        .find(d => d.walletId === walletId && d.networkId === networkId)
    }
  },

  actions: {
    async preview ({ commit, rootState, rootGetters }, { contract, wallet, password }) {
      const { address } = await ton.unsignedDeployMessage({
        contract,
        public: wallet.public
      })

      let fee = 0
      const networkId = rootState.network.selectedId
      const account = await ton.accountShort(address)

      if (account) {
        if (account.acc_type === 1) {
          const foundContract = getContractByHash(account.code_hash)

          console.log(foundContract, account.code_hash, getContractByHash(account.code_hash))

          commit('upsert', {
            address,
            networkId,
            walletId: wallet.id,
            contract: foundContract ? foundContract.slug : 'unknown',
            ...only(account, ['acc_type', 'balance', 'boc'])
          })
        } else if (password) {
          // Fee estimation
          const message = await ton.createDeployMessage(contract, {
            public: wallet.public,
            secret: await rootGetters['wallets/getDecrypted']({
              password,
              id: wallet.id,
              field: 'secret'
            })
          })

          fee = await ton.estimateTransactionFee({
            message,
            contract,
            account: account.boc
          })
        }
      }

      return {
        address,
        fee: BigInt(fee),
        balance: BigInt(account ? account.balance : 0)
      }
    },

    async run ({ commit, rootGetters, rootState }, { contract, wallet, password }) {
      const networkId = rootState.network.selectedId

      const secret = await rootGetters['wallets/getDecrypted']({
        password,
        id: wallet.id,
        field: 'secret'
      })

      const { transaction } = await ton.deploy(contract, {
        secret,
        public: wallet.public
      })

      commit('upsert', {
        networkId,
        walletId: wallet.id,
        contract: contract.slug,
        acc_type: transaction.end_status,
        address: transaction.account_addr
      })
    },

    async activity ({ state }, { id }) {
      const deployment = state.items[id]

      return ton.activityHistory({
        address: deployment.address
      })
    },

    async fetch ({ commit, state }, id) {
      const deployment = state.items[id]
      const data = await ton.accountShort(deployment.address)

      let insertContract = {}

      if (deployment.contract === 'unknown') {
        const foundContract = getContractByHash(data.code_hash)

        if (foundContract) {
          insertContract = {
            contract: foundContract.slug
          }
        }
      }

      commit('upsert', {
        address: deployment.address,
        networkId: deployment.networkId,

        ...insertContract,
        ...only(data, ['balance', 'boc'])
      })
    },

    async transfer ({ state, rootState, rootGetters }, { deploymentId, data, password, estimation = true }) {
      const deployment = state.items[deploymentId]
      const contract = getContractBySlug(deployment.contract)
      const walletData = rootState.wallets.items[deployment.walletId]

      const secret = await rootGetters['wallets/getDecrypted']({
        password,
        field: 'secret',
        id: deployment.walletId
      })

      const wallet = {
        secret,
        public: walletData.public,
        address: deployment.address
      }

      const params = {
        data,
        wallet,
        contract
      }

      if (estimation) {
        const message = await ton.createTransferMessage(params)

        return ton.estimateTransactionFee({
          message,
          contract,
          account: deployment.boc
        })
      }

      return ton.transfer(params)
    }
  }
}
