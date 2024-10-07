<template>
  <Transition
    enterActiveClass="duration-500 ease-out"
    enterFromClass="max-h-0 scale-y-0"
    enterToClass="max-h-full scale-y-100"
    leaveActiveClass="duration-300 ease-in"
    leaveFromClass="max-h-full scale-y-100"
    leaveToClass="max-h-0 scale-y-0"
  >
    <span
      v-if="error"
      class="mt-1 max-w-xs text-2xs font-semibold text-red-500"
    >
      {{ error }}
    </span>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{ error?: string }>()
</script>
