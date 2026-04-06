<template>
  <header class="header">
    <ul class="menu-list">
      <li :class="{ active: $route.path === '/' }">
        <router-link to="/">Все котики</router-link>
      </li>
      <li :class="{ active: $route.path === '/liked' }">
        <router-link to="/liked">Любимые котики</router-link>
      </li>
    </ul>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>