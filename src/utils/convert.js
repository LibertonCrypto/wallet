import { sha256 } from 'js-sha256'

export function shorten(str) {
  if (str.length >= 64) {
    return str.slice(0, str.indexOf('0:') === 0 ? 6 : 4) + '...' + str.slice(60)
  }

  return str
}

export function hexToStr(hex) {
  let result = ''

  for (let i = 0; i < hex.length; i += 2) {
    result += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
  }

  return result
}

export function strToHex(hex) {
  return hex
    .split('')
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('')
}

export function toHex(buffer) {
  return [...buffer].map((x) => x.toString(16).padStart(2, '0')).join('')
}

export function b64toBlob(base64Image) {
  // Split into two parts
  const parts = base64Image.split(';base64,')

  // Hold the content type
  const imageType = parts[0].split(':')[1]

  // Decode Base64 string
  const decodedData = window.atob(parts[1])

  // Create UNIT8ARRAY of size same as row data length
  const uInt8Array = new Uint8Array(decodedData.length)

  // Insert all character code into uInt8Array
  for (let i = 0; i < decodedData.length; ++i) {
    uInt8Array[i] = decodedData.charCodeAt(i)
  }

  // Return BLOB image after conversion
  return new Blob([uInt8Array], { type: imageType })
}

export async function toSHA256(string) {
  return sha256(string)
}

export function fromNano(val, precision = 3, round = 'down') {
  const s = 10 ** precision

  const add = round === 'up' ? 10 ** (9 - precision) : 0
  const total = ((BigInt(val) + BigInt(add)) * BigInt(s)) / BigInt(1e9)

  return Number(total) / s
}

export function toNano(amount) {
  const [int, dec] = amount.split('.')

  return (
    BigInt(int) * BigInt(1e9) +
    BigInt(dec ? dec.padEnd(9, '0') : '0')
  ).toString()
}
