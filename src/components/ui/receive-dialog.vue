<template>
  <q-dialog class="receive__dialog" style="min-width: 45rem">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ $t('receive.heading') }}</div>
      </q-card-section>

      <q-card-section class="receive">
        <img :src="addressQR" v-if="addressQR" class="receive__code" />

        <div class="receive__content">
          <label class="text-grey">{{ $t('receive.address') }}</label>
          <span class="receive__address">{{ deployment.address }}</span>

          <label class="text-grey">{{ $t('receive.public_key') }}</label>
          <span class="receive__address">{{ wallet.public }}</span>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
  import { useStore } from 'vuex'
  import { generateAsURL } from "@utils/qrcode";
  import {defineEmit, defineProps, useContext, watch, ref, computed} from "vue";

  defineEmit(['hide'])

  const { emit } = useContext()
  const { getters } = useStore()
  const props = defineProps({
    show: Boolean,
    wallet: Object,
  })

  const deployment = computed(() => getters['deployments/forWallet'](props.wallet.id))

  const addressQR = ref(false)
  const generateQR = async () => {
    addressQR.value = await generateAsURL(deployment.value.address)
  }

  generateQR()

  watch(() => props.wallet, generateQR)

  const hide = () => {
    emit('hide')
  }
</script>
