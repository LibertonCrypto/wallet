import { createApp } from 'vue'
import ItMessageOverride from '../components/overrides/it-message.vue'

export const useNotifications = () => {
  let idStart = 0
  const messages = []

  const notify = (options) => {
    const onClose = options.onClose
    const id = idStart++

    options.onClose = () => {
      // Message.close(id, onClose)
    }

    const tempDiv = document.createElement('div')
    const instance = createApp(ItMessageOverride).mount(tempDiv)

    const newData = Object.assign(options, { id })
    for (const [key, value] of Object.entries(newData)) {
      instance.$data[key] = value
    }

    document.body.appendChild(instance.$el)
    instance.$data.show = true

    let topDist = 0

    messages.forEach((el) => {
      topDist += el.$el.offsetHeight + 6
    })

    instance.$data.top = topDist + 6

    messages.push(instance)

    return instance
  }

  return {
    notify,
  }
}
