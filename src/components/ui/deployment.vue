<template>
  <h6 class="q-mt-none">{{ $t('deployment.heading') }}</h6>

  <div class="deployment__step">
    <img src="/img/steps/1.png" class="deployment__step-n" />

    <div class="deployment__step-content">
      <h5 class="deployment__step-title">{{ $t('deployment.steps.select_contract') }}</h5>

      <q-select dense
                filled
                class="q-mb-md"
                :options="walletContractsMap"
                v-model="deployment.contract"
                @update:model-value="genAddress"
                :label="$t('deployment.wallet_contract')" />
    </div>
  </div>

  <div class="deployment__step">
    <img src="/img/steps/2.png" class="deployment__step-n" />

    <div class="deployment__step-content">
      <h5 class="deployment__step-title">{{ $t('deployment.steps.account_password') }}</h5>

      <account-password v-model="deployment.password" v-model:error="deployment.passwordError" />
    </div>
  </div>

  <div class="deployment__step">
    <img src="/img/steps/3.png" class="deployment__step-n" />

    <div class="deployment__step-content">
      <h5 class="deployment__step-title">
        {{ $t('deployment.steps.send_fees', { n: deployment.fee > 0 ? fromNano(deployment.fee, 4, 'up') : 0.1 }) }}
      </h5>

      <q-input dense filled disable v-model="deployment.address"
               :label="$t('deployment.predicted_address')" bottom-slots>
        <template v-slot:hint>
          {{ $t('deployment.balance') }}: {{ fromNano(deployment.addressBalance, 4) }}
        </template>
      </q-input>
    </div>
  </div>

  <div class="deployment__step">
    <img src="/img/steps/4.png" class="deployment__step-n" />

    <div class="deployment__step-content">
      <h5 class="deployment__step-title">{{ $t('deployment.steps.everything_ready') }}</h5>

      <div class="text-grey q-mb-md" v-if="deployment.fee > 0">
        {{ $t('transfer.fee') }} ≈ {{ fromNano(deployment.fee, 4) }}
      </div>

      <q-btn @click="deploy" :disable="! deployment.isReady"
             :loading="deployment.isActive" class="bg-primary text-white">
        {{ $t('global.buttons.deploy') }}
      </q-btn>
    </div>
  </div>
</template>

<script setup>
  import { useStore } from "vuex";
  import { fromNano } from '@utils/convert'
  import AccountPassword from "./account-password.vue";
  import { reactive, defineProps, watch, onUnmounted } from 'vue'
  import {wallets as walletContracts} from "../../utils/contracts";
  import WrongPasswordException from "@utils/exceptions/WrongPasswordException";

  const props = defineProps({
    wallet: Object,
  })

  const { dispatch, getters } = useStore()
  const walletContractsMap = walletContracts.map(w => ({ label: w.slug, value: w.slug }))

  const deployment = reactive({
    address: '',
    password: '',
    contract: null,
    isReady: false,
    isActive: false,
    addressBalance: 0,
    fee: BigInt(0),
    passwordError: false,
  })

  /*
   * Generate and fetch address interval
   */
  const interval = setInterval(() => genAddress(), 5e3)

  onUnmounted(() => clearInterval(interval))

  /*
   * Predict address method, call on wallet change
   */
  watch(() => props.wallet, () => genAddress())

  const genAddress = async () => {
    if (! deployment.contract) {
      return false
    }

    const contract = walletContracts.find(c => c.slug === deployment.contract.value)

    const { address, balance, fee } = await dispatch('deployments/preview', {
      contract,
      wallet: props.wallet,
      password: deployment.password
    })

    if (fee > 0 && balance >= fee)
    {
      clearInterval(interval)
      deployment.isReady = true
    }

    const passwordCheck = await getters['wallets/passwordCheck']({
      password: deployment.password,
    })

    if (! passwordCheck)
    {
      if (deployment.password.length) {
        deployment.passwordError = true
      }
    }

    deployment.address = address
    deployment.fee = BigInt(fee)
    deployment.addressBalance = balance
  }

  const deploy = async () => {
    const passwordCheck = await getters['wallets/passwordCheck']({
      password: deployment.password
    })

    if (! passwordCheck) {
      deployment.passwordError = true

      return false
    }

    deployment.isActive = true

    const contract = walletContracts.find(c => c.slug === deployment.contract.value)

    await dispatch('deployments/run', {
      contract,
      wallet: props.wallet,
      password: deployment.password
    })

    deployment.isActive = false
  }
</script>
