import { useModals } from './modals'

export const useConfirmation = () => {
  const { show } = useModals()

  const confirm = (action) => {
    return new Promise((resolve, reject) => {
      show('confirmation', { action, callback: resolve })
    })
  }

  return {
    confirm,
  }
}
