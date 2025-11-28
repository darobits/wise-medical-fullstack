<template>
  <div class="wm-error-alert">
    <span>{{ message }}</span>
    <button type="button" class="wm-error-close" @click="$emit('close')">
      ×
    </button>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true
  }
})

defineEmits(['close'])
</script>

<style scoped>
.wm-error-alert {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.6rem 0.8rem;
  border-radius: 10px;
  background: rgba(248, 113, 113, 0.09);
  border: 1px solid rgba(248, 113, 113, 0.6);
  color: #fecaca;
  font-size: 0.85rem;
}

.wm-error-close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0;
  line-height: 1;
}
</style>
