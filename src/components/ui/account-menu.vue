<template>
  <div class="account-menu">
    <it-dropdown>
      <i class="las la-user account-menu__icon" /> {{ current.name }}

      <template #menu>
        <it-dropdown-menu>
          <it-dropdown-item
            icon="cog"
            :divided="true"
            @click="show('account-settings')"
            >{{ $t('account-menu.settings') }}</it-dropdown-item
          >
          <it-dropdown-item icon="key" @click="onBackup">{{
            $t('account-menu.backup_phrase')
          }}</it-dropdown-item>
          <it-dropdown-item
            icon="plus-circle"
            @click="$router.push('/create')"
            >{{ $t('account-menu.create') }}</it-dropdown-item
          >
          <it-dropdown-item
            icon="exchange-alt"
            @click="show('account-select')"
            >{{ $t('account-menu.change') }}</it-dropdown-item
          >
        </it-dropdown-menu>
      </template>
    </it-dropdown>
  </div>
</template>

<script setup>
import {
  useAccounts,
  useConfirmation,
  useModals,
  useDownloads,
} from '@/features'
import { useStore } from 'vuex'

const store = useStore()
const { show } = useModals()
const { current } = useAccounts()
const { confirm } = useConfirmation()
const { downloadText } = useDownloads()

const onBackup = async () => {
  const password = await confirm('backup')

  if (!password) {
    return false
  }

  const phrase = await store.getters['accounts/getDecrypted']({
    password,
    field: 'phrase',
    id: current.value.id,
  })

  downloadText(`${current.value.name}.txt`, phrase)
}
</script>
