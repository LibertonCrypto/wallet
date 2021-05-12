import abi from './transfer.abi.json'
import { getSigner } from '../defaultParams'
import { strToHex } from '../../convert'

export default {
  abi,
  slug: 'InternalTransfer',

  getBodyParams: comment => {
    return {
      abi: {
        value: abi,
        type: 'Contract'
      },
      call_set: {
        function_name: 'transfer',
        input: {
          comment: strToHex(comment)
        }
      },
      is_internal: true,
      signer: getSigner({})
    }
  }
}
