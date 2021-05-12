import tvc from './SafeMultisigWallet.tvc'
import abi from './SafeMultisigWallet.abi.json'
import { defaultMultisigDeployParams, defaultMultisigTransferParams } from '../defaultParams'

export default {
  abi,
  tvc,
  slug: 'SafeMultisigWallet',
  hash: '80d6c47c4a25543c9b397b71716f3fae1e2c5d247174c52e2c19bd896442b105',
  getDeployParams: (keys) => defaultMultisigDeployParams({ abi, tvc }, keys),
  getTransferParams: ({ data, wallet }) => defaultMultisigTransferParams({
    data,
    wallet,
    contract: { abi, tvc }
  })
}
