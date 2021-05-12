import SafeMultisig from './SafeMultisigWallet'
import InternalTransferContract from './InternalTransfer'

export const wallets = [SafeMultisig]
export const InternalTransfer = InternalTransferContract

export const getContractByHash = hash => {
  return wallets.find(w => w.hash === hash)
}

export const getContractBySlug = slug => {
  return wallets.find(w => w.slug === slug)
}
