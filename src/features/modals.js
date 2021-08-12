import { computed } from 'vue'
import { useStore } from 'vuex'

export const useModals = () => {
  const store = useStore()

  const hide = () => store.commit('settings/hideModal')
  const hideAll = () => store.commit('settings/hideAllModals')
  const show = (name, props = {}) => {
    store.commit('settings/showModal', { name, props })
  }

  const getModel = (name) =>
    computed({
      set: () => store.commit('settings/hideModal'),
      get: () => store.getters['settings/isOpen'](name),
    })

  const currentModal = computed(() => store.getters['settings/currentModal'])
  const currentProps = computed(() =>
    currentModal.value ? currentModal.value.props : {}
  )

  const getProp = (key) =>
    computed(() => (currentModal.value ? currentModal.value.props[key] : null))

  return {
    hide,
    show,
    hideAll,
    getModel,
    getProp,
    currentModal,
    currentProps,
  }
}
