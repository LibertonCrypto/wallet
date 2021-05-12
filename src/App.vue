<template>
  <app-header />

  <q-scroll-area class="wrapper container">
    <router-view />
  </q-scroll-area>

  <app-footer />
</template>

<script setup>
import "./assets/scss/app.scss"
import AppHeader from "./components/layout/header.vue";
import AppFooter from "./components/layout/footer.vue";
</script>
