<template>
  <h3 class="home__subtitle">{{ $t('global.fast_actions') }}</h3>
  <div class="fast-actions">
    <div class="fast-actions__item">
      <a href="#" @click.prevent="show('wallet-select')">
        <it-tooltip :content="$t('actions.change_wallet')">
          <i class="las la-wallet" />
        </it-tooltip>
      </a>
    </div>

    <div class="fast-actions__item">
      <a href="#" @click.prevent="show('wallet-settings')">
        <it-tooltip :content="$t('actions.wallet_settings')">
          <i class="las la-cog" />
        </it-tooltip>
      </a>
    </div>

    <div class="fast-actions__item">
      <a href="#" @click.prevent="viewInExplorer">
        <it-tooltip :content="$t('actions.view_in_explorer')">
          <i class="las la-external-link-alt" />
        </it-tooltip>
      </a>
    </div>
  </div>
</template>

<script setup>
import { useDeployments, useModals, useNetworking, useTon } from '@/features'

const ton = useTon()
const { show } = useModals()
const { current: network } = useNetworking()
const { current: deployment } = useDeployments()

const viewInExplorer = () => {
  window.open(
    ton.explorer({
      wallet: deployment.value.address,
      networkId: network.value.id,
    })
  )
}
</script>
