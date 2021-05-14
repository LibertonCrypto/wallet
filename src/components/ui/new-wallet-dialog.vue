<template>
  <q-dialog v-model="show" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">{{ $t('newWalletDialog.heading') }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input dense :label="`${$t('newWalletDialog.wallet_name')} (${$t('global.optional')})`" class="q-mb-md"
                  v-model="newWallet.name"></q-input>

        <account-password v-model="newWallet.password" v-model:error="newWallet.error" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat :label="$t('global.buttons.cancel')" @click="hide"></q-btn>
        <q-btn flat :label="$t('global.buttons.create')" @click="create"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
  import { useStore } from "vuex";
  import { reactive, toRefs } from "vue";
  import AccountPassword from './account-password.vue'
  import {wallets as walletContracts} from "../../utils/contracts";
  import WrongPasswordException from "@utils/exceptions/WrongPasswordException";

  export default {
    emits: ['hide'],

    components: { AccountPassword },

    props: {
      show: Boolean,
    },

    setup (props, { emit }) {
      const { show } = toRefs(props)
      const { dispatch, getters } = useStore()

      const newWallet = reactive({
        name: '',
        error: false,
        password: '',
        contract: null,
        predictedAddress: null,
      })

      const hide = () => {
        emit('hide')
      }

      const create = async () => {
        const passwordCheck = await getters['accounts/passwordCheck']({
          password: newWallet.password,
        })

        if (! passwordCheck) {
          newWallet.error = true

          return false
        }

        await dispatch('wallets/create', {
          name: newWallet.name,
          password: newWallet.password,
        })

        newWallet.name = ''
        newWallet.password = ''

        emit('hide')
      }

      return {
        hide,
        show,
        create,
        newWallet,
      }
    }
  }
</script>
