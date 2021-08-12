import { ton } from '@/utils/ton'
import { toSHA256 } from '../utils/convert'
import WrongPasswordException from '../utils/exceptions/WrongPasswordException'

/*
 * Methods
 */
export function only(obj, keys) {
  const res = {}

  for (const k of keys) {
    res[k] = obj[k]
  }

  return res
}

/*
 * Mutations
 */
export function update(state, payload) {
  Object.assign(state.items[payload.id], payload.data)
}

export function remove(state, id) {
  if (!id in state.ids) {
    return false
  }

  state.ids = state.ids.filter((i) => i !== id)

  delete state.items[id]

  return id
}

export function removeBy(state, rule) {
  const items = withIds(state)
  const [k, v] = Object.entries(rule)[0]

  const result = []
  const toRemove = items
    .filter((i) => i[k] === v)
    .forEach((i) => {
      remove(state, i.id)

      result.push(i.id)
    })

  return result
}

export function push(state, { id, data }) {
  state.ids.push(id)
  state.items[id] = data
}

export function select(state, payload) {
  state.selectedId = payload
}

/*
 * Getters
 */
export function count(state) {
  return state.ids.length
}

export function passwordCheck(state) {
  return async ({ id, password }) => {
    const itemId = id || state.selectedId

    return state.items[itemId].passwordHash === (await toSHA256(password))
  }
}

export function current(state) {
  if (state.selectedId && state.items[state.selectedId]) {
    return {
      id: state.selectedId,
      ...state.items[state.selectedId],
    }
  }

  return null
}

export function withIds(state) {
  return Object.entries(state.items).map(([id, data]) => ({ id, ...data }))
}

export function getDecrypted(state) {
  return async ({ id, password, field = 'xprv' }) => {
    const item = state.items[id]

    const result = await ton.decrypt({
      password,
      ...item[field],
    })

    if (!ton.isASCII(result)) {
      throw new WrongPasswordException()
    }

    return result
  }
}
