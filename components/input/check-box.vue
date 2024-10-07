<template>
  <label class="cursor-pointer">
    <div class="flex h-5 w-5 items-center justify-center rounded border-2">
      <Icon
        name="check"
        class="h-4 text-primary"
        v-if="selected.includes(value)"
      />
    </div>
    <slot></slot>
  </label>
</template>

<script setup lang="ts">
import Icon from '../ui/icon.vue'

// defines
defineProps<{ selected: unknown[]; value: unknown }>()
</script>
