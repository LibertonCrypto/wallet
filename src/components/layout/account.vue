<template>
  <div class="home">
    <div class="home__assets">
      <div class="home__sticky">
        <fast-actions />
        <token-list />
      </div>
    </div>

    <div class="wrapper">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import TokenList from '../ui/token-list.vue'
import FastActions from '../ui/fast-actions.vue'
</script>
