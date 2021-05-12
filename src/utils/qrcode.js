import QRCode from 'qrcode'

export function generateAsURL (data, options = {}) {
  return QRCode.toDataURL(data, options)
}
