import { ton } from '@/utils/ton'
import { toRaw, unref } from 'vue'
import { current, withIds } from './helpers'

const defaultNetworks = {
  0: {
    isDefault: true,
    name: 'Main TON Network',
    endpoints: ['main2.ton.dev', 'main3.ton.dev', 'main4.ton.dev'],
  },
  1: {
    isDefault: true,
    name: 'Dev TON Network',
    endpoints: ['net1.ton.dev', 'net5.ton.dev'],
  },
  2: {
    isDefault: true,
    name: 'Local Network',
    endpoints: ['localhost'],
  },
}

const defaultTokens = [
  {
    id: 0,
    name: 'TON Crystal',
    image: '/img/tokens/crystal.png',
  },
  {
    id: 1,
    name: 'TON Ruby',
    image: '/img/tokens/ruby.png',
  },
  {
    id: 2,
    name: 'TON Ruby',
    image: '/img/tokens/ruby.png',
  },
]

export default {
  namespaced: true,

  state: {
    selectedId: '0',
    ids: ['0', '1', '2'],
    items: Object.assign({}, defaultNetworks),
  },

  getters: {
    current,
    withIds,
    defaultToken: (state) =>
      state.selectedId === '0' ? defaultTokens[0] : defaultTokens[1],
  },

  mutations: {
    select(state, id) {
      state.selectedId = id

      ton.switchNetwork(toRaw(state.items[id].endpoints))
    },
  },
}
