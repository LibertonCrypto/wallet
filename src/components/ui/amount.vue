<template>
  <span class="amount" :class="{ amount_positive: props.positive }">
    <span class="amount__int">{{ val.int }}</span>
    <span class="amount__fraction">{{ val.fra }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { useUtils } from '@/features'

const props = defineProps({
  value: Number,
  positive: {
    type: Boolean,
    default: false,
  },
})
const { displayAmount } = useUtils()

const val = computed(() => displayAmount(props.value))
</script>
