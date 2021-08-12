<template>
  <button class="it-btn" :class="rootClasses" :disabled="disabled">
    <it-icon v-if="icon" class="it-btn-icon" :name="icon" />
    <span v-if="$slots.default" class="it-btn-text">
      <slot />
    </span>
    <span class="it-btn-wrap-loading">
      <it-loading v-if="loading" color="#fff" :radius="10" :stroke="3" />
    </span>
  </button>
</template>

<script lang="ts">
enum Sizes {
  BIG = 'big',
  NORMAL = 'normal',
  SMALL = 'small',
}

export enum Colors {
  NEUTRAL = 'neutral',
  PRIMARY = 'primary',
  SUCCESS = 'success',
  DANGER = 'danger',
  WARNING = 'warning',
  BLACK = 'black',
}

import { defineComponent, computed } from 'vue'

export default defineComponent({
  // eslint-disable-next-line
  name: 'it-button',
  props: {
    type: {
      type: String,
      default: Colors.NEUTRAL,
      validator: (value: Colors) => Object.values(Colors).includes(value),
    },
    size: {
      type: String,
      default: Sizes.NORMAL,
      validator: (value: Sizes) => Object.values(Sizes).includes(value),
    },
    iconAfter: { type: Boolean },
    disabled: { type: Boolean },
    outlined: { type: Boolean },
    round: { type: Boolean },
    pulse: { type: Boolean },
    loading: { type: Boolean },
    block: { type: Boolean },
    text: { type: Boolean },
    icon: { type: String, default: null },
  },
  setup(props, { slots }) {
    const rootClasses = computed(() => [
      {
        pulse: props.pulse,
        'it-btn--empty': !slots.default,
        'it-btn--outlined': props.outlined,
        'it-btn--round': props.round,
        'it-btn--block': props.block,
        'it-btn--text': props.text,
        'it-btn--loading': props.loading,
        [`it-btn--${props.size}`]: props.size,
        ...(props.type
            ? { [`it-btn--${props.type}`]: true }
            : { 'it-btn--neutral': true }),
        ...(props.icon
            ? {
              [props.iconAfter ? 'it-btn--icon-right' : 'it-btn--icon-left']:
                  true,
            }
            : null),
      },
    ])
    return { rootClasses }
  },
})
</script>
