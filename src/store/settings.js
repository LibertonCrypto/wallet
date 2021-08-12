export default {
  namespaced: true,

  state: {
    modals: [],
    locale: 'en',
    theme: 'light',
  },

  getters: {
    isDark(state) {
      return state.theme === 'dark'
    },

    isOpen(state) {
      return (name) =>
        Boolean(state.modals.length && state.modals[0].name === name)
    },

    currentModal(state) {
      return state.modals.length ? state.modals[0] : false
    },
  },

  mutations: {
    set(state, payload) {
      Object.assign(state, payload)
    },

    showModal(state, payload) {
      state.modals.unshift(payload)
    },

    hideModal(state) {
      state.modals.shift()
    },

    toggleTheme(state, theme) {
      window.document.body.classList.remove('body--' + state.theme)

      state.theme = theme || (state.theme === 'dark' ? 'light' : 'dark')

      window.document.body.classList.add('body--' + state.theme)
    },
  },
}
