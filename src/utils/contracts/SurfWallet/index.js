import tvc from './SurfWallet.tvc'
import abi from './SurfWallet.abi.json'
import {
  defaultMultisigDeployParams,
  defaultMultisigTransferParams,
} from '../defaultParams'

export default {
  abi,
  tvc,
  slug: 'SurfWallet',
  hash: '207dc560c5956de1a2c1479356f8f3ee70a59767db2bf4788b1d61ad42cdad82',
  getDeployParams: (keys) => defaultMultisigDeployParams({ abi, tvc }, keys),
  getTransferParams: ({ data, wallet }) =>
    defaultMultisigTransferParams({
      data,
      wallet,
      contract: { abi, tvc },
    }),
}
