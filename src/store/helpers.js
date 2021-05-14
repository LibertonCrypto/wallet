import { ton } from '@utils/ton'
import { toSHA256 } from '../utils/convert'
import WrongPasswordException from '../utils/exceptions/WrongPasswordException'

export function passwordCheck (state) {
  return async ({ id, password }) => {
    const itemId = id || state.selectedId

    return state.items[itemId].passwordHash === await toSHA256(password)
  }
}

export function current (state) {
  if (state.selectedId && state.items[state.selectedId]) {
    return {
      id: state.selectedId,
      ...state.items[state.selectedId]
    }
  }

  return null
}

export function withIds (state) {
  return Object.entries(state.items)
    .map(([id, data]) => ({ id, ...data }))
}

export function getDecrypted (state) {
  return async ({ id, password, field = 'xprv' }) => {
    const item = state.items[id]

    const result = await ton.decrypt({
      password,
      ...item[field]
    })

    if (!ton.isASCII(result)) {
      throw new WrongPasswordException()
    }

    return result
  }
}
