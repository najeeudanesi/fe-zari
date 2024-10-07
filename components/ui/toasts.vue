<template>
  <TransitionGroup
    name="list"
    tag="div"
    class="pointer-events-none fixed bottom-2 left-1/2 z-50 w-fit -translate-x-1/2 transform lg:right-4 lg:left-auto lg:translate-x-0"
  >
    <Toast v-for="toast in toasts" v-bind="{ toast }" :key="toast.id" />
  </TransitionGroup>
</template>

<script setup lang="ts">
import Toast from './toast.vue'
const { toasts } = useToast()
</script>
