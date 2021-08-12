<template>
  <div class="wallet-list">
    <it-drawer v-model="model" placement="left">
      <h3 class="wallet-list__heading">
        <it-icon name="user" />
        {{ $t('dialogs.account.select.heading') }}
      </h3>

      <it-divider />

      <template v-for="account of accounts" :key="account.id">
        <div class="wallet-list__item">
          <div>
            <p style="font-weight: 500">{{ account.name }}</p>
            <p class="wallet-list__address">
              {{
                $t(
                  'dialogs.account.select.wallets_count',
                  forAccount(account.id).length
                )
              }}
            </p>
          </div>

          <div class="wallet-list__actions">
            <it-tooltip
              :content="$t('dialogs.account.select.hint')"
              placement="left"
            >
              <it-button
                icon="check-circle"
                type="primary"
                @click.prevent="onSelect(account)"
              ></it-button>
            </it-tooltip>
          </div>
        </div>

        <it-divider />
      </template>

      <div class="wallet-list__create-area">
        <it-button type="primary" @click.prevent="onCreate">{{
          $t('dialogs.account.select.create')
        }}</it-button>
      </div>
    </it-drawer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useModals, useAccounts, useWallets } from '@/features'

const { push } = useRouter()
const { forAccount } = useWallets()
const { getModel, hide, show } = useModals()
const { select, list: accounts } = useAccounts()

const model = getModel('account-select')

const onSelect = (w) => {
  select(w.id)
  hide()
  push('/')
}

const onCreate = () => {
  hide()
  push('/create')
}
</script>
