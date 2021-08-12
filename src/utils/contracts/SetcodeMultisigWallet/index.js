import tvc from './SetcodeMultisigWallet.tvc'
import abi from './SetcodeMultisigWallet.abi.json'
import {
  defaultMultisigDeployParams,
  defaultMultisigTransferParams,
} from '../defaultParams'

export default {
  abi,
  tvc,
  slug: 'SetcodeMultisigWallet',
  hash: 'e2b60b6b602c10ced7ea8ede4bdf96342c97570a3798066f3fb50a4b2b27a208',
  getDeployParams: (keys) => defaultMultisigDeployParams({ abi, tvc }, keys),
  getTransferParams: ({ data, wallet }) =>
    defaultMultisigTransferParams({
      data,
      wallet,
      contract: { abi, tvc },
    }),
}
