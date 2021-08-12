<template>
  <it-modal v-model="show">
    <template #header>
      <h3 style="margin: 0">{{ $t('dialogs.account.settings.heading') }}</h3>
    </template>

    <template #body>
      <it-input
        v-model="editData.name"
        :label-top="$t('dialogs.account.settings.name')"
        class="q-mb-md"
      ></it-input>
    </template>

    <template #actions>
      <it-button type="danger" class="mr-auto" @click="onRemove">
        {{ $t('global.buttons.delete') }}
      </it-button>

      <it-button @click="show = false">{{
        $t('global.buttons.cancel')
      }}</it-button>
      <it-button type="primary" @click="onSave">{{
        $t('global.buttons.save')
      }}</it-button>
    </template>
  </it-modal>
</template>

<script setup>
import { onMounted, reactive, watch } from 'vue'
import { useModals, useAccounts, useConfirmation } from '@/features'

const { confirm } = useConfirmation()
const { hide, getModel } = useModals()
const { current: account, remove, select, update } = useAccounts()

const show = getModel('account-settings')
const editData = reactive({
  name: null,
})

watch(
  () => show.value,
  () => reset()
)

onMounted(() => reset())

const reset = () => {
  if (!account.value) {
    return false
  }

  for (const k of Object.keys(editData)) {
    editData[k] = account.value[k]
  }
}

const onRemove = async () => {
  const password = await confirm('delete')

  if (!password || !account.value) {
    return false
  }

  setTimeout(async () => {
    hide()
    select()

    await remove(account.value.id)
  }, 100)
}

const onSave = () => {
  if (!account.value) {
    return false
  }

  update(account.value.id, editData)
  hide()
}
</script>
