import { toNano } from '@/utils/convert'

export function getSigner(keys) {
  if (!keys.public) {
    return {
      type: 'None',
    }
  }

  if (!keys.secret) {
    return {
      type: 'External',
      public_key: keys.public,
    }
  }

  return {
    keys: {
      public: keys.public,
      secret: keys.secret,
    },
    type: 'Keys',
  }
}

export function defaultMultisigDeployParams(contract, keys) {
  return {
    abi: {
      type: 'Contract',
      value: contract.abi,
    },
    deploy_set: {
      tvc: contract.tvc,
      initial_data: {},
    },
    call_set: {
      function_name: 'constructor',
      input: {
        owners: [`0x${keys.public}`],
        reqConfirms: 1,
      },
    },
    signer: getSigner(keys),
    processing_try_index: 1,
  }
}

const FLAG_IGNORE_ERRORS = 1
const FLAG_PAY_FWD_FEE_FROM_BALANCE = 2
const FLAG_SEND_ALL_REMAINING = 128

export function defaultMultisigTransferParams({ contract, wallet, data }) {
  return {
    address: wallet.address,

    abi: {
      type: 'Contract',
      value: contract.abi,
    },

    call_set: {
      function_name: 'sendTransaction',
      input: {
        bounce: false,
        dest: data.recipient,
        payload: data.payload,
        value: data.allBalance ? '0' : toNano(data.amount),
        flags:
          FLAG_IGNORE_ERRORS |
          (data.allBalance
            ? FLAG_SEND_ALL_REMAINING
            : FLAG_PAY_FWD_FEE_FROM_BALANCE),
      },
    },

    signer: getSigner(wallet),
  }
}
