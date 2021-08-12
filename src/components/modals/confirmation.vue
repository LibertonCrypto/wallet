<template>
  <it-modal v-model="show">
    <template #header>
      <h3 class="modal__heading">{{ $t('dialogs.confirmation.heading') }}</h3>
    </template>

    <template #body>
      <it-input
        v-model="state.password"
        type="password"
        prefix-icon="unlock"
        :status="state.status"
        :message="state.message"
        :label-top="$t('dialogs.confirmation.password')"
        @blur="onBlur"
        @focus="onFocus"
      ></it-input>
    </template>

    <template #actions>
      <it-button @click="onCancel">{{ $t('global.buttons.cancel') }}</it-button>
      <it-button type="primary" :disabled="!state.canConfirm" @click="confirm">
        {{ $t('global.buttons.confirm') }}
      </it-button>
    </template>
  </it-modal>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed, reactive, watch } from 'vue'
import { useModals, useAccounts } from '@/features'

const { t } = useI18n()
const { checkPassword } = useAccounts()
const { hide, getModel, getProp } = useModals()

const show = getModel('confirmation')
const state = reactive({
  status: null,
  password: '',
  canConfirm: false,
  message: computed(() => {
    if (!state.status) {
      return null
    }

    if (state.password.length === 0) {
      return t('global.validation.password_required')
    }

    return t('global.validation.wrong_password')
  }),
})

watch(
  () => state.password,
  async () => {
    state.canConfirm = await checkPassword(state.password)
  }
)

/*
 * Methods
 */
const onFocus = () => (state.status = null)

const onBlur = () => {
  if (!state.canConfirm) {
    state.status = 'danger'
  }
}

const callback = (result = false) => {
  const callback = getProp('callback')

  if (callback.value) {
    callback.value(result)
  }
}

const onCancel = () => {
  callback()
  hide()

  state.status = ''
  state.password = ''
}

const confirm = () => {
  callback(state.password)
  hide()

  state.status = ''
  state.password = ''
}
</script>
