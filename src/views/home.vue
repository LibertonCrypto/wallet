<template>
  <div v-if="!wallet" class="home__default-message">
    {{ $t('home.select_wallet') }}
  </div>

  <template v-else-if="deployment">
    <div class="home__actions">
      <div
        class="home__action home__action_send"
        @click="$router.push('/transfer')"
      >
        <span class="home__action-text">
          {{ $t('home.buttons.send') }}
        </span>
      </div>

      <it-tooltip
        class="home__action home__action_call home__action_disabled"
        :content="$t('home.buttons.soon')"
      >
        <span class="home__action-text">
          {{ $t('home.buttons.call') }}
        </span>
      </it-tooltip>

      <div @click="showReceiveDialog" class="home__action home__action_receive">
        <span class="home__action-text">
          {{ $t('home.buttons.receive') }}
        </span>
      </div>
    </div>
  </template>

  <transaction-list />
</template>

<script setup>
import { useStore } from 'vuex'
import { ton } from '@/utils/ton'
import { useModals } from '@/features'
import { useRouter } from 'vue-router'
import { computed, ref, watch } from 'vue'
import TransactionList from '../components/ui/transaction-list.vue'

const { show } = useModals()
const r = useRouter()
const { getters, dispatch, state } = useStore()
const network = computed(() => state.network.selectedId)
const wallet = computed(() => getters['wallets/current'])
const deployment = computed(() =>
  wallet.value ? getters['deployments/forWallet'](wallet.value.id) : false
)

const fetch = () => {
  if (!deployment.value || !deployment.value.address) {
    r.push(`/deploy/${wallet.value.id}`)
  }

  if (deployment.value) {
    dispatch('deployments/fetch', deployment.value.id)
  }
}

const showReceiveDialog = () => {
  show('wallet-info', {
    wallet: wallet.value,
  })
}

const explorerLink = computed(() =>
  ton.explorer({
    networkId: network.value,
    wallet: deployment.value.address,
  })
)

fetch()

watch(() => deployment.value, fetch)
</script>
