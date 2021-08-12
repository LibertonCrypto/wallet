<template>
  <it-modal v-model="show">
    <template #header>
      <h3 style="margin: 0">{{ $t('dialogs.network.create.heading') }}</h3>
    </template>

    <template #body>
      <div class="form-input">
        <it-input
          v-model="newWallet.name"
          :label-top="$t('dialogs.network.create.name')"
        ></it-input>
      </div>

      <it-input
        v-model="newWallet.name"
        :label-top="$t('dialogs.network.create.endpoint')"
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
import { useStore } from 'vuex'
import { useModals } from '@/features/modals'
import { computed, reactive, toRefs } from 'vue'
import { wallets as walletContracts } from '../../../utils/contracts'
import WrongPasswordException from '@/utils/exceptions/WrongPasswordException'

const { hide, getModel, currentProps } = useModals()
const { state, commit, dispatch, getters } = useStore()

const show = getModel('new-network')
const newWallet = reactive({
  name: '',
  error: false,
  password: '',
  contract: null,
  predictedAddress: null,
})

const create = async () => {
  const passwordCheck = await getters['accounts/passwordCheck']({
    password: newWallet.password,
  })

  if (!passwordCheck) {
    newWallet.error = true

    return false
  }

  await dispatch('wallets/create', {
    name: newWallet.name,
    password: newWallet.password,
  })

  newWallet.name = ''
  newWallet.password = ''

  hide()
}
</script>
