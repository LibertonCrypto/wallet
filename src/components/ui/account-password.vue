<template>
  <q-input dense
           bottom-slots
           type="password"
           :error="error"
           :model-value="modelValue"
           @update:model-value="onUpdate"
           :label="$t('global.password')"
           :error-message="errorMessage"></q-input>
</template>

<script setup>
  import { useI18n } from 'vue-i18n'
  import {defineProps, defineEmit, useContext, computed, toRefs} from 'vue'

  defineEmit(['update:modelValue', 'update:error'])

  const { t } = useI18n()
  const { emit } = useContext()
  const props = defineProps({
    error: Boolean,
    modelValue: String,
  })

  const { error, modelValue } = toRefs(props)

  const errorMessage = computed(() => {
    return props.modelValue.length ? t('global.validation.wrong_password') : t('global.validation.password_required')
  })

  const onUpdate = ($e) => {
    emit('update:modelValue', $e)
    emit('update:error', false)
  }
</script>
