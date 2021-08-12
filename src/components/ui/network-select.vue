<template>
  <div class="network-select">
    <it-dropdown placement="top">
      <i class="las la-plug network-select__icon"></i> {{ network.name }}

      <template #menu>
        <it-dropdown-menu>
          <it-dropdown-item
            v-for="n of list"
            :key="n.id"
            @click="select(n.id)"
            >{{ n.name }}</it-dropdown-item
          >
        </it-dropdown-menu>
      </template>
    </it-dropdown>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useNetworking, useModals } from '@/features'

const { show } = useModals()
const { current: network, list, select } = useNetworking()
</script>
