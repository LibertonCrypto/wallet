<template>
  <div v-show="visible" :class="rootClasses">
    <div v-if="icon" class="it-alert-iconbox">
      <it-icon :box="iconbox" class="it-alert-icon" :name="icon" />
    </div>
    <div>
      <p class="it-alert-title">{{ title }}</p>
      <p v-if="!defaultSlot && body" class="it-alert-slot">{{ body }}</p>
      <p v-if="defaultSlot" class="it-alert-slot">
        <slot />
      </p>
    </div>
    <it-icon
      v-if="closable"
      name="clear"
      class="it-alert-close"
      @click="clickCross"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useCheckSlot } from 'equal-vue/src/hooks'

export default defineComponent({
  // eslint-disable-next-line
  name: 'it-alert',
  props: {
    type: {
      type: String,
      default: 'primary',
    },
    icon: { type: String, default: null },
    closable: { type: Boolean, default: false },
    iconbox: { type: Boolean, default: false },
    visible: { type: Boolean, default: true },
    title: { type: String, default: null },
    body: { type: String, default: null },
  },
  emits: ['on-close'],
  setup(props, { emit, slots }) {
    const defaultSlot = 'default' in slots ? ref(slots['default']) : null

    const clickCross = () => emit('on-close')
    const rootClasses = computed(() => [
      'it-alert',
      `it-alert--${props.type}`,
      !props.body && !defaultSlot?.value && 'it-alert--small',
    ])

    return {
      defaultSlot,
      clickCross,
      rootClasses,
    }
  },
})
</script>
