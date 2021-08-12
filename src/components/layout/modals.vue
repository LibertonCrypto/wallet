<template>
  <confirmation />

  <account-select />
  <account-settings />

  <wallet-create />
  <wallet-info />
  <wallet-select />
  <wallet-settings />

  <new-network />
</template>

<script setup>
import Confirmation from '../modals/confirmation.vue'

import AccountSelect from '../modals/account/select.vue'
import AccountSettings from '../modals/account/settings.vue'

import WalletInfo from '../modals/wallet/info.vue'
import WalletCreate from '../modals/wallet/create.vue'
import WalletSelect from '../modals/wallet/select.vue'
import WalletSettings from '../modals/wallet/settings.vue'

import NewNetwork from '../modals/network/create.vue'
</script>
