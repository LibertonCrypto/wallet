export function getSigner (keys) {
  if (!keys.public) {
    return {
      type: 'None'
    }
  }

  if (!keys.secret) {
    return {
      type: 'External',
      public_key: keys.public
    }
  }

  return {
    keys: {
      public: keys.public,
      secret: keys.secret
    },
    type: 'Keys'
  }
}

export function defaultMultisigDeployParams (contract, keys) {
  return {
    abi: {
      type: 'Contract',
      value: contract.abi
    },
    deploy_set: {
      tvc: contract.tvc,
      initial_data: {}
    },
    call_set: {
      function_name: 'constructor',
      input: {
        owners: [`0x${keys.public}`],
        reqConfirms: 1
      }
    },
    signer: getSigner(keys),
    processing_try_index: 1
  }
}

export function defaultMultisigTransferParams ({ contract, wallet, data }) {
  return {
    address: wallet.address,

    abi: {
      type: 'Contract',
      value: contract.abi
    },

    call_set: {
      function_name: 'submitTransaction',
      input: {
        bounce: false,
        allBalance: false,
        value: data.amount,
        dest: data.recipient,
        payload: data.payload
      }
    },

    signer: getSigner(wallet)
  }
}
