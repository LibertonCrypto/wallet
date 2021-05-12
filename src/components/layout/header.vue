<template>
  <div class="header">
    <div class="container">
      <div class="header__logo">Liberton</div>
      <div class="header__menu">
        <div class="header__menu-item">
          <network-select />
        </div>

        <div class="header__menu-item">
          <account-select />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import NetworkSelect from "../ui/network-select.vue";
  import AccountSelect from "../ui/account-select.vue";
</script>
