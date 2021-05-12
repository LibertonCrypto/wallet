<template>
  <h6 class="q-mt-none">{{ $t('transfer.heading') }}</h6>
  <q-input dense :label="$t('transfer.recipient')" class="q-mb-md"
           v-model="transferData.recipient"></q-input>

  <q-input dense :label="$t('transfer.amount')" class="q-mb-md"
           v-model="transferData.amount"></q-input>

  <q-input dense :label="`${$t('transfer.message')} (${$t('global.optional')})`" class="q-mb-md"
           v-model="transferData.comment"></q-input>

  <account-password v-model="transferData.password" v-model:error="transferData.passwordError" />

  <span class="text-grey q-mb-md" v-if="fee > 0">
    {{ $t('transfer.fee') }} ≈ {{ fromNano(fee, 4) }}
  </span>

  <div>
    <q-btn class="bg-primary text-white on-left" @click="transfer" :loading="transferData.isActive"
           :disable="! transferAvailable">
      {{ $t('transfer.buttons.transfer') }}
    </q-btn>

    <q-btn flat @click="$router.push('/')">
      {{ $t('global.buttons.back') }}
    </q-btn>
  </div>
</template>

<script setup>
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  import { toNano, fromNano } from '@utils/convert'
  import { reactive, watchEffect, ref, defineProps, useContext, defineEmit, computed } from 'vue'

  import AccountPassword from '../components/ui/account-password.vue'
  import WrongPasswordException from "@utils/exceptions/WrongPasswordException";

  const fee = ref(0)
  const router = useRouter()
  const { dispatch, getters } = useStore()

  const transferData = reactive({
    amount: '',
    comment: '',
    recipient: '',
    password: '',
    passwordError: false,

    isActive: false,
  })

  const wallet = computed(() => getters['wallets/current'])
  const deployment = computed(() => wallet.value.id ? getters['deployments/forWallet'](wallet.value.id) : false)

  const transferAvailable = computed(() => {
    return fee.value > 0 && BigInt(deployment.value.balance) >= BigInt(fee.value) + BigInt(toNano(transferData.amount))
  })

  const transferPayload = computed(() => ({
    estimation: false,
    deploymentId: deployment.value.id,
    password: transferData.password,
    data: {
      amount: transferData.amount,
      comment: transferData.comment,
      recipient: transferData.recipient,
    }
  }))

  watchEffect(async () => {
    const value = transferPayload.value

    try {
      fee.value = await dispatch('deployments/transfer', { ...value, estimation: true })
    } catch (e) {}
  })

  const transfer = async () => {
    transferData.isActive = true

    try {
      await dispatch('deployments/transfer', transferPayload.value)
      await dispatch('deployments/fetch', deployment.value.id)

      router.push({ name: 'home' })
    } catch (e) {
      if (e instanceof WrongPasswordException) {
        transferData.passwordError = true
      }
    }

    transferData.isActive = false
  }

  /*
   * Validation rules
   */
  const recipientRules = [val => val.length > 3 || t('send.rules.recipient')]
  const amountRules = [val => val === password.value || t('welcome.passwords_do_not_match')]
</script>
