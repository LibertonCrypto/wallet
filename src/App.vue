<template>
  <app-header />

  <main class="container">
    <router-view />
  </main>

  <app-footer />
  <app-modals />
</template>

<script setup>
import AppHeader from './components/layout/header.vue'
import AppFooter from './components/layout/footer.vue'
import AppModals from './components/layout/modals.vue'
</script>
