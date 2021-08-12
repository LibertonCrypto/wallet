import { useTon } from '@/features/ton'
import { getContractBySlug } from '@/utils/contracts'
import { useStore } from 'vuex'

export function useTransfers() {
  const ton = useTon()
  const store = useStore()

  const transfer = async ({ data, password, deploymentId }) => {
    const deployment = store.state.deployments.items[deploymentId]
    const contract = getContractBySlug(deployment.contract)

    const walletData = store.state.wallets.items[deployment.walletId]

    const secret = await store.getters['wallets/getDecrypted']({
      password,
      field: 'secret',
      id: deployment.walletId,
    })

    return ton.transfer({
      data,
      contract,
      wallet: {
        secret,
        public: walletData.public,
        address: deployment.address,
      },
    })
  }

  return {
    transfer,
  }
}
