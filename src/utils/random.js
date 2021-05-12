import { toHex } from './convert'

const MAX_BYTES = 65536
const crypto = window.crypto || window.msCrypto

export function randomBytes (size) {
  const bytes = new Uint8Array(size)

  if (size > MAX_BYTES) {
    for (let generated = 0; generated < size; generated += MAX_BYTES) {
      crypto.getRandomValues(bytes.slice(generated, generated + MAX_BYTES))
    }
  } else {
    crypto.getRandomValues(bytes)
  }

  return toHex(bytes)
}
