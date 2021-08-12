<template>
  <i
    class="las it-icon"
    :class="[
      outlined && 'material-icons-outlined',
      box && 'it-icon--box',
      'la-' + name,
    ]"
    :style="{
      color,
      'background-color': box && boxColor ? boxColor : '',
    }"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  // eslint-disable-next-line
  name: 'it-icon',
  props: {
    name: { type: String, required: true },
    color: { type: String, default: null },
    outlined: { type: Boolean, default: false },
    box: { type: Boolean, default: false },
    boxColor: { type: String, default: null },
  },
})
</script>
