<template>
  <transition name="fade-bottom" @after-leave="destroy">
    <div
        v-show="show"
        :style="{ top: `${top}px` }"
        class="it-message"
        :class="[`it-message--${type}`]"
        @mouseleave="startTimer"
        @mouseenter="clearTimer"
    >
      <it-icon class="it-message-icon" :name="icon || computedIcon" />
      <span class="it-message-text">{{ text }}</span>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ItIconOverride from './it-icon.vue'

enum Colors {
  NEUTRAL = 'neutral',
  PRIMARY = 'primary',
  SUCCESS = 'success',
  DANGER = 'danger',
  WARNING = 'warning',
  BLACK = 'black',
}

const typeIcon: { [key in Colors]?: string } = {
  [Colors.PRIMARY]: 'info-circle',
  [Colors.SUCCESS]: 'check',
  [Colors.WARNING]: 'exclamation-circle',
  [Colors.DANGER]: 'exclamation-circle',
}

export default defineComponent({
  name: 'it-message',
  components: {
    'it-icon': ItIconOverride,
  },
  data() {
    return {
      id: null,
      show: false,
      text: '',
      icon: '',
      duration: 4000,
      onClose: () => {},
      top: 6,
      type: Colors.PRIMARY,
      timer: null as unknown as NodeJS.Timeout,
    }
  },
  computed: {
    computedIcon(): Colors {
      return typeIcon[this.type] as Colors
    },
  },
  mounted() {
    this.startTimer()
  },
  methods: {
    destroy() {
      this.$el.parentNode!.removeChild(this.$el)
    },

    startTimer() {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          this.show = false
          if (this.onClose) {
            this.onClose()
          }
        }, this.duration)
      }
    },

    clearTimer() {
      clearTimeout(this.timer!)
    },
  },
})
</script>
