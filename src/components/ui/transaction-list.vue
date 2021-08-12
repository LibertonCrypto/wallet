<template>
  <div
    class="home__loading"
    v-if="state.isLoading && !state.transactions.length"
  >
    <it-loading></it-loading>
  </div>

  <template v-else>
    <div class="transaction-list">
      <div
        v-for="t of state.transactions"
        class="transaction-list__item"
        :key="t.id"
      >
        <div class="transaction-list__description">
          <div>
            <template v-if="t.in_message.src_account"
              >{{ $t('transactions.from') }}
              {{ shorten(t.in_message.src_account.id) }}
            </template>

            <template v-else-if="t.out_messages.length"
              >{{ $t('transactions.to') }}
              {{ shorten(t.out_messages[0].dst_account.id) }}
            </template>

            <template v-else>
              {{ $t('transactions.deployment') }}
            </template>
          </div>

          <span class="transaction-list__meta"
            >{{ getTime(t) }} · {{ getDate(t) }} · {{ shorten(t.id) }}</span
          >
        </div>

        <div v-if="t.comment" class="transaction-list__comment">
          <it-tag>{{ t.comment }}</it-tag>
        </div>

        <div class="transaction-list__amount">
          <amount
            :value="fromNano(t.balance_delta, 4)"
            :positive="BigInt(t.balance_delta) > 0"
          />
        </div>

        <a
          :href="explorerLink(t)"
          target="_blank"
          class="transaction-list__explorer"
        >
          <it-tooltip :content="$t('actions.view_in_explorer')">
            <i class="las la-external-link-alt" />
          </it-tooltip>
        </a>
      </div>
    </div>

    <div class="transaction-list__load-more">
      <it-button
        v-if="state.canLoadMore"
        type="primary"
        size="big"
        @click="fetch"
        :disabled="state.isLoading"
        :loading="state.isLoading"
        >{{ $t('home.buttons.load_more') }}</it-button
      >
    </div>
  </template>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { onMounted, watch, reactive } from 'vue'
import { fromNano, shorten } from '@/utils/convert'
import { useDeployments, useNetworking, useTon, useWallets } from '@/features'

const ton = useTon()
const r = useRouter()
const { t } = useI18n()
const { current: wallet } = useWallets()
const { current: network } = useNetworking()
const { current: deployment, activity } = useDeployments()

const state = reactive({
  total: null,
  isLoading: true,
  lastTxTime: null,
  transactions: [],
  canLoadMore: false,
})

const explorerLink = (t) => {
  return ton.explorer({ transaction: t.id, networkId: network.value.id })
}

watch(
  () => [deployment.value, state.page],
  () => {
    state.lastTxTime = null
    state.transactions = []

    fetch()
  }
)

const intl = (t, options) => {
  const date = new Date(t.now * 1e3)
  const locale = Intl.DateTimeFormat().resolvedOptions().locale

  return new Intl.DateTimeFormat(locale, options).format(date)
}

const getDate = (t) => {
  return intl(t, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

const getTime = (t) => {
  return intl(t, {
    hour: 'numeric',
    minute: 'numeric',
  })
}

const fetch = async () => {
  state.isLoading = true

  const { transactions, count, lastTxTime } = await activity({
    limit: state.limit,
    after: state.lastTxTime,
    deployment: deployment.value,
  })

  const list = await Promise.all(
    transactions.map(async (t) => {
      t.comment = await ton.getComment(t)

      return t
    })
  )

  state.total = count
  state.transactions.push(...list)

  state.isLoading = false
  state.lastTxTime = lastTxTime
  state.canLoadMore = state.transactions.length < count
}

onMounted(fetch)
</script>
