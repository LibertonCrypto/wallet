<template>
  <it-modal v-model="show">
    <template #header>
      <h3 style="margin: 0">
        {{ $t('dialogs.wallet.settings.heading') }}
      </h3>
    </template>

    <template #body>
      <it-input
        v-model="editData.name"
        :label-top="$t('dialogs.wallet.settings.name')"
        class="q-mb-md"
      />
    </template>

    <template #actions>
      <it-button @click="show = false">
        {{ $t('global.buttons.cancel') }}
      </it-button>
      <it-button type="primary" @click="onSave">
        {{ $t('global.buttons.save') }}
      </it-button>
    </template>
  </it-modal>
</template>

<script setup>
import { useStore } from 'vuex'
import { reactive, watch, onMounted } from 'vue'
import { useModals, useWallets } from '@/features'

const { commit } = useStore()
const { hide, getModel } = useModals()
const { current: wallet, update } = useWallets()

const show = getModel('wallet-settings')
const editData = reactive({
  name: null,
})

watch(
  () => show.value,
  () => reset()
)

onMounted(() => reset())

const reset = () => {
  if (!wallet.value) {
    return false
  }

  for (const k of Object.keys(editData)) {
    editData[k] = wallet.value[k]
  }
}

const onSave = () => {
  update(wallet.value.id, editData)
  hide()
}
</script>
