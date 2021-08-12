<template>
  <h1 class="home__heading">{{ $t('transfer.heading') }}</h1>

  <div class="form-input">
    <it-input
      v-model="transferData.recipient"
      prefix-icon="user"
      class="transfer__input"
      :label-top="$t('transfer.recipient')"
      @update:model-value="onRecipientBlur"
    ></it-input>
  </div>

  <it-alert
    v-if="transferData.showAlert"
    class="mb-1"
    type="warning"
    icon="exclamation-circle"
    :body="$t('transfer.warning.' + transferData.showAlert)"
    :title="$t('transfer.warning.title')"
  />

  <div class="input-group">
    <div class="form-input">
      <it-input
        v-model="transferData.amount"
        prefix-icon="gem"
        class="transfer__input"
        :label-top="$t('transfer.amount')"
        :disabled="transferData.allBalance"
      >
      </it-input>
    </div>

    <div class="form-input">
      <it-switch
        v-model="transferData.allBalance"
        type="primary"
        :label="$t('transfer.allBalance')"
      ></it-switch>
    </div>
  </div>

  <div class="form-input">
    <it-input
      v-model="transferData.comment"
      prefix-icon="comment"
      :label-top="`${$t('transfer.message')} (${$t('global.optional')})`"
    ></it-input>
  </div>

  <span v-if="transferData.fee > 0" class="">
    {{ $t('transfer.fee') }} ≈ {{ fromNano(transferData.fee, 4) }}
  </span>

  <div class="transfer__buttons">
    <it-button
      type="primary"
      class="on-left"
      :loading="transferData.isActive"
      :disabled="!transferData.available"
      @click="onTransfer"
    >
      {{ $t('transfer.buttons.transfer') }}
    </it-button>

    <it-button flat @click="$router.push('/')">
      {{ $t('global.buttons.back') }}
    </it-button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { toNano } from '@/utils/convert'
import { reactive, watch, computed } from 'vue'
import {
  useConfirmation,
  useTransfers,
  useTon,
  useDeployments,
} from '@/features'

const ton = useTon()
const router = useRouter()
const { transfer } = useTransfers()
const { confirm } = useConfirmation()
const { current: deployment } = useDeployments()

const transferData = reactive({
  /*
   * User Input
   */
  amount: '',
  comment: '',
  recipient: '',
  password: '',
  allBalance: false,

  /*
   * Other data
   */
  showAlert: false,
  isActive: false,
  fee: BigInt(0),

  /*
   * Computed variables
   */
  available: computed(() => {
    const amount = BigInt(toNano(transferData.amount))

    return (
      (amount > BigInt(0) || transferData.allBalance) &&
      amount < BigInt(deployment.value.balance)
    )
  }),
})

watch(
  () => transferData.allBalance,
  () => {
    transferData.amount = ''
  }
)

const onRecipientBlur = async () => {
  transferData.showAlert = false

  const data = await ton.fetchAccounts([transferData.recipient])

  if (!data.length) {
    transferData.showAlert = 'not_found'
  } else if (data[0].code_hash === 'null') {
    transferData.showAlert = 'uninitialized'
  }
}

const onTransfer = async () => {
  const password = await confirm('transfer', {
    k: 'v',
  })

  if (!password) {
    return false
  }

  transferData.isActive = true

  await transfer({
    password,
    deploymentId: deployment.value.id,
    data: {
      amount: transferData.amount,
      comment: transferData.comment,
      recipient: transferData.recipient,
      allBalance: transferData.allBalance,
    },
  })

  transferData.isActive = false
  router.push('/')
}
</script>
