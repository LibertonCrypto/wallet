<template>
  <q-select dense :options="networkList" v-model="networkModel" dropdown-icon="las la-angle-down">
    <template v-slot:selected-item="scope">
      {{ currentNetwork.name }}
    </template>
  </q-select>
</template>

<script setup>
  import { computed } from 'vue'
  import { useStore } from 'vuex'

  const { state, getters, commit } = useStore()

  const networkModel = computed({
    get: () => state.network.selectedId,
    set: (sel) => commit('network/select', sel.value)
  })

  const currentNetwork = computed(() => getters['network/current'])
  const networkList = computed(() => getters["network/withIds"].map(n => ({ label: n.name, value: n.id })))
</script>
