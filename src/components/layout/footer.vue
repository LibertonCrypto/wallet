<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__selects">
        <network-select />
        <language-select />
      </div>

      <hr />

      <div class="container footer__links">
        <span>{{ $t('footer.motto') }}</span>
        <a href="https://liberton.org/" target="_blank">
          <i class="las la-link" /> Liberton.org
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useStore } from 'vuex'
import NetworkSelect from '../ui/network-select.vue'
import LanguageSelect from '../ui/language-select.vue'

const { commit } = useStore()

const toggleTheme = () => {
  commit('settings/toggleTheme')
}
</script>
