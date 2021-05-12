<template>
  <q-list>
    <template :key="wallet.id" v-for="wallet of wallets">
      <q-expansion-item
          group="wallets"
          :label="wallet.name"
          header-class="text-primary"
          @update:model-value="onChange(wallet.id, $event)"
          :default-opened="store.state.wallets.selectedId === wallet.id"
      >
        <div class="home__token-list">
          <div class="home__token">
            <img :src="token.image" class="home__token-image" />

            <div class="home__token-name">
              <template v-if="balance(wallet) !== false">{{ balance(wallet) }}</template>
              {{ token.name }}
            </div>
          </div>
        </div>
      </q-expansion-item>

      <q-separator></q-separator>
    </template>

    <div class="home__token home__token_create-wallet" href="#" @click.prevent="switchCreateDialog">
      <q-icon name="las la-plus-circle" /> {{ $t('home.buttons.create_wallet') }}
    </div>
  </q-list>

  <new-wallet-dialog :show="isDialogVisible" @hide="switchCreateDialog" />
</template>

<script setup>
  import { useStore } from 'vuex'
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { fromNano } from '@utils/convert'
  import NewWalletDialog from "./new-wallet-dialog.vue";

  const store = useStore()
  const router = useRouter()
  const selected = ref([])
  const isDialogVisible = ref(false)
  const token = computed(() => store.getters['network/defaultToken'])
  const wallets = computed(() => store.getters['wallets/forAccount']())

  const switchCreateDialog = () => {
    isDialogVisible.value = ! isDialogVisible.value
  }

  const balance = wallet => {
    const d = store.getters["deployments/forWallet"](wallet.id)

    if (d) {
      return fromNano(d.balance, 3)
    }

    return false
  }

  const onChange = async (id, state) => {
    await router.push({ name: 'home' })

    if (state) {
      selected.value.push(id)
    } else {
      selected.value = selected.value.filter(i => i !== id)
    }

    if (! selected.value.length) {
      store.commit('wallets/resetSelect')
    }

    if (selected.value.length === 1) {
      store.commit('wallets/select', selected.value[0])
    }
  }
</script>
