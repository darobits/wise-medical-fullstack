<template>
  <div class="wm-spinner-wrapper">
    <div class="wm-spinner"></div>
    <span>Cargando...</span>
  </div>
</template>

<script setup>
</script>

<style scoped>
.wm-spinner-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--wm-text-muted);
}

.wm-spinner {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 2px solid rgba(148, 163, 184, 0.4);
  border-top-color: var(--wm-green);
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
