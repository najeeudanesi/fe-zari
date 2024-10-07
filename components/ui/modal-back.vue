<template>
  <NuxtLink :to="to" class="absolute top-6 left-6 text-gray-600">
    <Icon name="left-arrow" class="h-5 w-5" />
  </NuxtLink>
</template>

<script setup lang="ts">
import Icon from './icon.vue'
defineProps<{ to: string }>()
</script>
