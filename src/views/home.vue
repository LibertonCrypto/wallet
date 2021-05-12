<template>
  <div class="home__default-message" v-if="! wallet.id">
    {{ $t('home.select_wallet') }}
  </div>

  <template v-else-if="deployment">
    <div class="row q-col-gutter-lg q-mb-lg">
      <div class="col-xs-12 col-md-5">
        <div class="home__main-action" @click="$router.push({ name: 'transfer' })">
          <q-icon name="las la-paper-plane" /> {{ $t('home.buttons.send') }}
        </div>
      </div>

      <div class="col-xs-12 col-md-5">
        <div class="home__main-action home__main-action_send" @click="showReceiveDialog = true">
          <q-icon name="las la-hand-holding-usd" /> {{ $t('home.buttons.receive') }}
        </div>
      </div>

      <div class="col-xs-12 col-md-2">
        <a class="home__main-action home__main-action_external" :href="explorerLink" target="_blank">
          <q-icon name="las la-external-link-alt" />
          <q-tooltip>
            {{ $t('global.view_in_explorer') }}
          </q-tooltip>
        </a>
      </div>
    </div>

    <transaction-list />
  </template>

  <deployment :wallet="wallet" v-else />

  <receive-dialog :wallet="wallet" v-model="showReceiveDialog" v-if="deployment"  />
</template>

<script setup>
  import { useStore } from 'vuex'
  import { ton } from '@utils/ton'
  import { computed, ref, watch } from 'vue'
  import Deployment from "../components/ui/deployment.vue";
  import WalletList from "../components/ui/wallet-list.vue";
  import ReceiveDialog from "../components/ui/receive-dialog.vue";
  import TransactionList from "../components/ui/transaction-list.vue";

  const { getters, dispatch, state } = useStore()
  const showReceiveDialog = ref(false)
  const network = computed(() => state.network.selectedId)
  const wallet = computed(() => getters['wallets/current'])
  const deployment = computed(() => wallet.value.id ? getters['deployments/forWallet'](wallet.value.id) : false)

  const fetch = () => {
    if (deployment.value) {
      dispatch('deployments/fetch', deployment.value.id)
    }
  }

  const explorerLink = computed(() => ton.explorer({
    networkId: network.value,
    wallet: deployment.value.address,
  }))

  fetch()

  watch(() => deployment.value, fetch)

  const tab = ref('transactions')
</script>
