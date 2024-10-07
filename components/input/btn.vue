<template>
  <button
    :class="[
      'Btn',
      loading ? 'cursor-nir-allowed opacity-50' : '',
      disabled ? 'cursor-not-allowed opacity-50' : ''
    ]"
    :disabled="!!loading || disabled"
  >
    <div class="flex space-x-2" v-if="loading">
      <TwSpinner class="mr-4 h-5 w-5 animate-spin text-white" />
      {{ loading }}
    </div>
    <slot v-else></slot>
  </button>
</template>

<script setup lang="ts">
import TwSpinner from '../ui/tw-spinner.vue'
defineProps<{ loading?: string; disabled?: boolean }>()
</script>
