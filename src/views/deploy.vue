<template>
  <h1 class="home__heading">{{ $t('deployment.heading') }}</h1>

  <transition-group>
    <div v-if="deployment.step >= 1" class="deployment__step">
      <img src="/img/steps/1.png" class="deployment__step-n" />

      <div class="deployment__step-content">
        <h5 class="deployment__step-title">
          {{ $t('deployment.steps.select_contract') }}
        </h5>

        <it-select
          v-model="deployment.contract"
          :options="walletContractOptions"
          :label="$t('deployment.wallet_contract')"
        >
          <template #icon>
            <i class="las la-angle-down" />
          </template>

          <template #selected-option>
            {{ $t(`contracts.${deployment.contract}.name`) }}
          </template>

          <template #option="{ option }">
            <div class="deployment__contract">
              {{ $t(`contracts.${option}.name`) }}
            </div>
            <div class="deployment__contract-description">
              {{ $t(`contracts.${option}.description`) }}
            </div>
          </template>
        </it-select>
      </div>
    </div>

    <div v-if="deployment.step >= 2" class="deployment__step">
      <img src="/img/steps/2.png" class="deployment__step-n" />

      <div class="deployment__step-content">
        <h5 class="deployment__step-title">
          {{ $t('deployment.steps.send_fees', { n: 0.06 }) }}
        </h5>

        <copy
          class="deployment__address"
          :content="deployment.account.address"
          >{{ deployment.account.address }}</copy
        >
        <label v-if="deployment.account.balance > 0">
          {{ $t('deployment.balance') }}:
          {{ fromNano(deployment.account.balance, 4) }}
        </label>
      </div>
    </div>

    <div v-if="deployment.step >= 3" class="deployment__step">
      <img src="/img/steps/3.png" class="deployment__step-n" />

      <div class="deployment__step-content">
        <h5 class="deployment__step-title">
          {{ $t('deployment.steps.everything_ready') }}
        </h5>

        <div v-if="deployment.fee > 0" class="text-grey q-mb-md">
          {{ $t('transfer.fee') }} ≈ {{ fromNano(deployment.fee, 4) }}
        </div>

        <it-button
          type="primary"
          :loading="deployment.isActive"
          @click="onDeploy"
        >
          {{ $t('global.buttons.deploy') }}
        </it-button>
      </div>
    </div>
  </transition-group>
</template>

<script setup>
import { useStore } from 'vuex'
import { fromNano } from '@/utils/convert'
import { useRoute, useRouter } from 'vue-router'
import { reactive, onMounted, computed, onUnmounted } from 'vue'
import { useConfirmation, useWallets, useDeployments, useTon } from '@/features'

const ton = useTon()
const route = useRoute()
const router = useRouter()
const { getById } = useWallets()
const { confirm } = useConfirmation()
const { deploy, contracts, findDeployment } = useDeployments()

const wallet = getById(route.params.id)
const walletContractOptions = contracts.map((w) => w.slug)

/*
 * Reset subscription
 */
onUnmounted(() => {
  if (deployment.subscription) {
    ton.unsubscribe(deployment.subscription)

    deployment.subscription = null
  }
})

/*
 * Check if there is already existing deployment of any known wallet
 */
onMounted(async () => {
  /*
   * Fetch possible addresses for current public key, redirect if wallet was already deployed
   */
  const { accounts, deployment: foundDeployment } = await findDeployment(wallet)

  if (foundDeployment) {
    return router.push('/')
  }

  /*
   * Key by slug instead of address
   */
  deployment.accounts = reactive(
    Object.fromEntries(
      Object.entries(accounts).map(([address, data]) => [
        data.slug,
        { address, ...data },
      ])
    )
  )

  /*
   * Subscribe on possible balance updates, update local state on callback
   */
  deployment.subscription = await ton.watchBalance(
    Object.keys(accounts),
    ({ result }) => {
      const c = accounts[result.id]

      if (!c) {
        return false
      }

      deployment.accounts[c.slug].balance = result.balance
    }
  )
})

const deployment = reactive({
  /*
   * User input
   */
  contract: null,

  /*
   * Other data
   */
  accounts: null,
  isActive: false,
  subscription: null,

  /*
   * Computed
   */
  step: computed(() => {
    if (!deployment.account) {
      return 1
    }

    if (deployment.account.balance < 0.06) {
      return 2
    }

    return 3
  }),
  account: computed(() => {
    if (!deployment.contract || !deployment.accounts) {
      return false
    }

    return deployment.accounts[deployment.contract]
  }),
})

const onDeploy = async () => {
  if (deployment.isActive) {
    return false
  }

  const password = await confirm('deploy', {})

  if (!password || !deployment.account) {
    return false
  }

  deployment.isActive = true

  const deployResult = await deploy({
    wallet,
    password,
    contract: deployment.contract,
  })

  if (deployResult) {
    return router.push('/')
  }

  deployment.isActive = false
}
</script>
