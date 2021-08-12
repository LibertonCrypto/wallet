<template>
  <div class="copy">
    <it-tooltip :content="$t('global.buttons.copy')" placement="top">
      <a href="#" @click.prevent="copy">
        <slot name="trigger">
          <i class="las la-clipboard copy__icon" />
        </slot>
      </a>
    </it-tooltip>

    <slot />
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue'

const props = defineProps({
  content: [String, Array],
})

const message = getCurrentInstance().appContext.config.globalProperties.$Message

const copy = () => {
  const method = Array.isArray(props.content) ? 'write' : 'writeText'

  navigator.clipboard[method](props.content).then(() => {
    message({
      duration: 2e3,
      type: 'success',
      text: 'Copied to clipboard!',
    })
  })
}
</script>
