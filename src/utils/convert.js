import { sha256 } from 'js-sha256'

export function strToHex (hex) {
  return hex.split('')
    .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('')
}

export function toHex (buffer) {
  return [...buffer].map(x => x.toString(16).padStart(2, '0')).join('')
}

export async function toSHA256 (string) {
  return sha256(string)
}

export function fromNano (val, precision = 3, round = 'down') {
  const s = 10 ** precision

  const add = round === 'up' ? 10 ** (9 - precision) : 0
  const total = (BigInt(val) + BigInt(add)) * BigInt(s) / BigInt(1e9)

  return Number(total) / s
}

export function toNano (amount) {
  const [int, dec] = amount.split('.')

  return (BigInt(int) * BigInt(1e9) + BigInt(dec ? dec.padEnd(9, '0') : '0')).toString()
}
