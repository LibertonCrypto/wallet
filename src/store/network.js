import { ton } from '@utils/ton'
import { toRaw, unref } from 'vue'

const defaultNetworks = {
  0: {
    isDefault: true,
    name: 'Main TON Network',
    endpoints: ['main.ton.dev']
  },
  1: {
    isDefault: true,
    name: 'Dev TON Network',
    endpoints: ['net.ton.dev']
  }
}

const defaultTokens = [
  {
    id: 0,
    name: 'TON Crystal',
    image: '/img/tokens/crystal.png'
  },
  {
    id: 1,
    name: 'TON Ruby',
    image: '/img/tokens/ruby.png'
  }
]

export default {
  namespaced: true,

  state: {
    selectedId: '0',
    ids: ['0', '1'],
    items: Object.assign({}, defaultNetworks)
  },

  getters: {
    current: state => state.items[state.selectedId],
    defaultToken: state => state.selectedId === '0' ? defaultTokens[0] : defaultTokens[1],

    withIds (state) {
      return Object.entries(state.items)
        .map(([id, data]) => ({ id, ...data }))
    }
  },

  mutations: {
    select (state, id) {
      state.selectedId = id

      ton.switchNetwork(toRaw(state.items[id].endpoints))
    }
  }
}
