<template>
  <div class="flex flex-col space-y-2">
    <span class="text-gray-500">{{ title }}</span>
    <div class="flex flex-col space-y-2 text-gray-700"><slot></slot></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>
