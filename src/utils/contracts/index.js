import SurfWallet from './SurfWallet'
import SafeMultisig from './SafeMultisigWallet'
import SetcodeMultisigWallet from './SetcodeMultisigWallet'
import InternalTransferContract from './InternalTransfer'

export const InternalTransfer = InternalTransferContract
export const wallets = [SafeMultisig, SetcodeMultisigWallet, SurfWallet]

export const getContractByHash = hash => {
  return wallets.find(w => w.hash === hash)
}

export const getContractBySlug = slug => {
  return wallets.find(w => w.slug === slug)
}
