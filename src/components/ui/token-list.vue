<template>
  <h3 class="home__subtitle">{{ $t('global.assets') }}</h3>

  <div class="tokens__list">
    <div class="tokens__item">
      <div class="tokens__content">
        <div class="tokens__name">
          {{ token.name }}
        </div>

        <amount
          v-if="hasDeployment(wallet) !== false"
          :value="balance(wallet)"
        />
      </div>

      <img :src="token.image" class="tokens__image" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import {
  useModals,
  useUtils,
  useNetworking,
  useDeployments,
  useWallets,
} from '@/features'

const { push } = useRouter()
const { show } = useModals()
const { balance } = useUtils()
const { token } = useNetworking()
const { exists: hasDeployment } = useDeployments()
const { select, current: wallet, list: wallets } = useWallets()

const onChange = async (id, state) => {
  select(state ? id : 0)
  push('/')
}
</script>
