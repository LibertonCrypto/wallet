<template>
  <q-select dense :options="accounts" v-model="account" class="on-right" dropdown-icon="las la-angle-down"
            v-if="accountsCount > 0"
  >
    <template v-slot:selected-item="scope">
      {{ state.accounts.items[scope.opt].name }}
    </template>
  </q-select>
</template>

<script setup>
  import { computed } from "vue"
  import { useStore } from "vuex"

  const { commit, state, getters } = useStore()
  const accountsCount = computed(() => getters['accounts/count'] > 0)

  const account = computed({
    get: () => state.accounts.selectedId,
    set: (sel) => commit('accounts/select', sel.value)
  })

  const accounts = computed(() => state.accounts.ids.map(id => ({
    value: id,
    label: state.accounts.items[id].name,
  })))
</script>
