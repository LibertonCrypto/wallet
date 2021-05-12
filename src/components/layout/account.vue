<template>
  <div class="home">
    <q-scroll-area class="home__wallet-list">
      <wallet-list />
    </q-scroll-area>

    <q-scroll-area class="home__wallet">
      <router-view />
    </q-scroll-area>
  </div>
</template>

<script setup>
  import WalletList from "../ui/wallet-list.vue";
</script>
