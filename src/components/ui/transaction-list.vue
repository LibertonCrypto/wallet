<template>
  <q-tabs
      v-model="tab"
      inline-label
      :breakpoint="0"
      align="justify"
      class="bg-white text-primary"
  >
    <q-tab name="transactions" :label="$t('home.tabs.transactions')" />
    <q-tab name="messages" :label="$t('home.tabs.messages')" />
  </q-tabs>

  <div class="transaction-list">
    <div class="transaction-list__item" v-for="t of transactions">
      <div class="transaction-list__id">{{ t.id }}</div>
      <div class="transaction-list__amount"
           :class="{'transaction-list__amount_positive': BigInt(t.balance_delta) > 0}">
        {{ fromNano(t.balance_delta, 4) }}
      </div>

      <a :href="explorerLink(t)" target="_blank" class="transaction-list__explorer">
        <q-tooltip>
          {{ $t('global.view_in_explorer') }}
        </q-tooltip>
        <q-icon name="las la-external-link-alt" />
      </a>
    </div>
  </div>

<!--  @TODO <q-pagination
      v-model="page"
      color="primary"
      :max="10"
      :max-pages="6"
      boundary-numbers
  ></q-pagination>-->
</template>

<script setup>
  import { useStore } from 'vuex'
  import { ton } from '@utils/ton'
  import {computed, ref, onMounted, watch} from 'vue'
  import { fromNano } from '@utils/convert'

  const page = ref(6)
  const total = ref(0)
  const transactions = ref([])
  const tab = ref('transactions')
  const { getters, dispatch, state } = useStore()
  const network = computed(() => state.network.selectedId)
  const wallet = computed(() => getters['wallets/current'])
  const deployment = computed(() => wallet.value.id ? getters['deployments/forWallet'](wallet.value.id) : false)

  const explorerLink = t => {
    return ton.explorer({ transaction: t.id, networkId: network.value })
  }

  watch(() => [wallet, network, deployment], () => fetch())

  const fetch = async () => {
    const { transactions: data, aggregateTransactions } = await dispatch('deployments/activity', {
      id: deployment.value.id,
    })

    transactions.value = data
    total.value = aggregateTransactions
  }

  onMounted(fetch)
</script>
