<template>
  <div
    v-for="surrounder in surrounders"
    :class="['pointer-events-auto absolute bg-transparent', surrounder]"
    @mouseenter="emit('mouseenter')"
  ></div>
</template>

<script setup lang="ts">
// defines
const emit = defineEmits(['mouseenter'])
// refs
const surrounders = [
  'w-full h-1 top-0 left-0',
  'w-1 h-full top-0 right-0',
  'w-full h-1 bottom-0 right-0',
  'w-1 h-full bottom-0 left-0'
]
</script>
