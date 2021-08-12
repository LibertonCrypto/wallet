export default {
  async updateTonRate() {
    return {
      TON: 0.59,
    }
    return new Promise((resolve) => {
      fetch(
        'https://api.exchange.bitcoin.com/api/2/public/ticker?symbols=TONUSD'
      ).then((res) => resolve(res.json()))
    })
  },

  async updateFiatRates() {
    return new Promise((resolve) => {
      fetch(
        'https://api.exchangerate.host/latest?base=USD&symbols=BTC,EUR,RUB'
      ).then(async (res) => {
        if (res.ok) {
          return resolve((await res.json()).rates)
        }

        resolve({})
      })
    })
  },
}
