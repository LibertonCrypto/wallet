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
import { useI18n } from 'vue-i18n'
import { useNotifications } from '@/features'

const { t } = useI18n()
const { notify } = useNotifications()
const props = defineProps({
  content: [String, Array],
})

const copy = () => {
  const method = Array.isArray(props.content) ? 'write' : 'writeText'

  navigator.clipboard[method](props.content).then(() => {
    notify({
      duration: 2e3,
      type: 'success',
      text: t('global.notifications.copied'),
    })
  })
}
</script>
