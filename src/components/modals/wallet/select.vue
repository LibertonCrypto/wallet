<template>
  <div class="wallet-list">
    <it-drawer v-model="model" placement="left">
      <h3 class="wallet-list__heading">
        <it-icon name="wallet" />
        {{ $t('dialogs.wallet.select.heading') }}
      </h3>

      <it-divider />

      <template v-for="w of wallets" :key="w.id">
        <div class="wallet-list__item">
          <div>
            <div class="wallet-list__name">
              {{ w.name }}
              <template v-if="hasDeployment(w)">
                · {{ $t('contracts.' + getD(w).contract + '.name') }} ·
                {{ fromNano(getD(w).balance, 3) }}

                <img :src="token.image" class="wallet-list__token" />
              </template>
            </div>
            <p v-if="hasDeployment(w)" class="wallet-list__address">
              {{ getD(w).address }}
            </p>
          </div>

          <div class="wallet-list__actions">
            <it-tooltip
              :content="$t('dialogs.wallet.select.select_hint')"
              placement="left"
            >
              <it-button
                icon="check-circle"
                type="primary"
                @click.prevent="onSelect(w)"
              ></it-button>
            </it-tooltip>
          </div>
        </div>

        <it-divider />
      </template>

      <div class="wallet-list__create-area">
        <it-button type="primary" @click.prevent="onCreate">{{
          $t('dialogs.wallet.select.create')
        }}</it-button>
      </div>
    </it-drawer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { fromNano } from '@/utils/convert'
import {
  useModals,
  useWallets,
  useDeployments,
  useNetworking,
} from '@/features'

const { push } = useRouter()
const { token } = useNetworking()
const { getModel, hide, show } = useModals()
const { select, list: wallets } = useWallets()
const { exists: hasDeployment, get: getD } = useDeployments()

const model = getModel('wallet-select')

const onSelect = (w) => {
  select(w.id)
  hide()
  push('/')
}

const onCreate = () => {
  hide()
  show('new-wallet')
}
</script>
