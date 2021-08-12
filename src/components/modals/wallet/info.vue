<template>
  <it-modal v-if="show" v-model="show" class="receive__dialog">
    <template #header>
      <h3 style="margin: 0">{{ $t('receive.heading') }}</h3>
    </template>

    <template #body>
      <div v-if="wallet" class="receive">
        <copy :content="QrAsClipboard">
          <template #trigger>
            <img v-if="addressQR" :src="addressQR" class="receive__code" />
          </template>
        </copy>

        <div class="receive__content">
          <label class="receive__label">{{ $t('receive.address') }}</label>
          <span class="receive__address">
            <copy :content="deployment.address">{{ deployment.address }}</copy>
          </span>

          <label class="receive__label">{{ $t('receive.public_key') }}</label>
          <span class="receive__address">
            <copy :content="wallet.public">{{ wallet.public }}</copy>
          </span>
        </div>
      </div>
    </template>
  </it-modal>
</template>

<script setup>
import { useStore } from 'vuex'
import { watch, ref, computed } from 'vue'
import { b64toBlob } from '@/utils/convert'
import { generateAsURL } from '@/utils/qrcode'
import { useModals, useWallets } from '@/features'

const { getters } = useStore()
const { current: wallet } = useWallets()
const { hide, getModel, getProp } = useModals()

const addressQR = ref(false)
const show = getModel('wallet-info')
const deployment = computed(() =>
  wallet.value ? getters['deployments/forWallet'](wallet.value.id) : false
)

const QrAsClipboard = computed(() => {
  if (!addressQR.value) {
    return ''
  }

  return [new ClipboardItem({ 'image/png': b64toBlob(addressQR.value) })]
})

const generateQR = async () => {
  if (!deployment.value) {
    return false
  }

  addressQR.value = await generateAsURL(deployment.value.address)
}

generateQR()

watch(() => wallet.value, generateQR)
</script>
