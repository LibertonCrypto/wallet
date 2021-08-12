<template>
  <it-modal v-model="show">
    <template #header>
      <h3 class="modal__heading">{{ $t('dialogs.wallet.create.heading') }}</h3>
    </template>

    <template #body>
      <it-input
        v-model="name"
        :label-top="`${$t('dialogs.wallet.create.name')} (${$t(
          'global.optional'
        )})`"
      ></it-input>
    </template>

    <template #actions>
      <it-button @click="hide">{{ $t('global.buttons.cancel') }}</it-button>
      <it-button type="primary" @click="create">{{
        $t('global.buttons.create')
      }}</it-button>
    </template>
  </it-modal>
</template>

<script setup>
import { ref } from 'vue'
import { useModals, useConfirmation, useWallets } from '@/features'

const { confirm } = useConfirmation()
const { create: createWallet } = useWallets()
const { hide: hideModal, getModel } = useModals()

const name = ref('')
const show = getModel('new-wallet')

/*
 * Methods
 */
const hide = () => {
  hideModal()
  name.value = ''
}

const create = async () => {
  const password = await confirm({
    action: 'new-wallet',
    data: {
      key: 'value',
    },
  })

  if (!password) {
    return hide()
  }

  await createWallet({
    password,
    name: name.value,
  })

  hide()
}
</script>
