<template>
  <h6 class="q-mt-none">{{ $t('transfer.heading') }}</h6>
  <q-input dense :label="$t('transfer.recipient')" class="q-mb-md"
           v-model="transferInput.recipient"></q-input>

  <q-input dense :label="$t('transfer.amount')" class="q-mb-md"
           v-model="transferInput.amount"></q-input>

  <q-input dense :label="`${$t('transfer.message')} (${$t('global.optional')})`" class="q-mb-md"
           v-model="transferInput.comment"></q-input>

  <account-password v-model="transferInput.password" v-model:error="transferState.passwordError" />

  <span class="text-grey q-mb-md" v-if="transferState.fee > 0">
    {{ $t('transfer.fee') }} ≈ {{ fromNano(transferState.fee, 4) }}
  </span>

  <div>
    <q-btn class="bg-primary text-white on-left" @click="transfer" :loading="transferState.isActive"
           :disable="! transferState.available">
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
  import { reactive, watch, toRefs, computed } from 'vue'

  import AccountPassword from '../components/ui/account-password.vue'
  import WrongPasswordException from "@utils/exceptions/WrongPasswordException";

  const router = useRouter()
  const { dispatch, getters } = useStore()
  const wallet = computed(() => getters['wallets/current'])
  const deployment = computed(() => wallet.value ? getters['deployments/forWallet'](wallet.value.id) : false)

  const transferInput = reactive({
    amount: '',
    comment: '',
    recipient: '',
    password: '',
  })

  const transferState = reactive({
    isActive: false,
    fee: BigInt(0),
    passwordError: false,
    total: computed(() => transferState.fee + BigInt(toNano(transferInput.amount))),
    available: computed(() => {
      return BigInt(deployment.value.balance) >= transferState.total
    })
  })

  const getTransferPayload = () => ({
    estimation: false,
    deploymentId: deployment.value.id,
    password: transferInput.password,
    data: {
      comment: transferInput.comment,
      recipient: transferInput.recipient,
      amount: toNano(transferInput.amount),
    }
  })

  watch(() => toRefs(transferInput), async () => {
    const passwordCheck = await getters['accounts/passwordCheck']({
      password: transferInput.password,
    })

    if (! passwordCheck)
    {
      if (transferInput.password.length) {
        transferState.passwordError = true
      }

      return false
    }

    try {
      const estimatedFee = await dispatch('deployments/transfer', { ...getTransferPayload(), estimation: true })

      transferState.fee = BigInt(estimatedFee)
    } catch (e) {}
  })

  const transfer = async () => {
    const passwordCheck = await getters['accounts/passwordCheck']({
      password: transferInput.password,
    })

    if (! passwordCheck) {
      transferState.passwordError = true

      return false
    }

    transferState.isActive = true

    try {
      await dispatch('deployments/transfer', getTransferPayload())
      await dispatch('deployments/fetch', deployment.value.id)

      router.push({ name: 'home' })
    } catch (e) {
      if (e instanceof WrongPasswordException) {
        transferState.passwordError = true
      }
    }

    transferState.isActive = false
  }

  /*
   * Validation rules
   */
  const recipientRules = [val => val.length > 3 || t('send.rules.recipient')]
  const amountRules = [val => val === password.value || t('welcome.passwords_do_not_match')]
</script>
