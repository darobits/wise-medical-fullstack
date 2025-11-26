<template>
  <div class="auth-page">
    <div class="auth-card">
      <LogoWiseMedical />

      <div class="auth-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import LogoWiseMedical from '../components/LogoWiseMedical.vue'
</script>
