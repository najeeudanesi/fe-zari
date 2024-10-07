<template>
  <div class="flex items-center justify-between rounded-lg bg-gray-100 p-2">
    <slot></slot>
    <button
      class="ml-3 rounded-full bg-gray-500 p-0.5 text-white"
      type="button"
      @click="emit('clear')"
    >
      <Icon name="x" class="h-3.5 w-3.5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import Icon from './icon.vue'

// defines
const emit = defineEmits(['clear'])
</script>
