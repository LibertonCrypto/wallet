import { useStore } from 'vuex'
import { fromNano } from '@/utils/convert'

export const useUtils = () => {
  const store = useStore()

  const balance = (wallet) => {
    const d = store.getters['deployments/forWallet'](wallet.id)

    return fromNano(d.balance, 3)
  }

  const displayAmount = (amount) => {
    const parts = new Intl.NumberFormat().formatToParts(amount)

    let int = ''
    let fra = ''

    for (const p of parts) {
      if (p.type === 'fraction' || p.type === 'decimal') {
        fra += String(p.value)
      } else {
        int += String(p.value)
      }
    }

    return { int, fra }
  }

  return {
    balance,
    displayAmount,
  }
}
