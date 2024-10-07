<template>
  <Transition name="list">
    <div
      v-if="loading === true"
      class="pointer-events-none fixed bottom-2 left-1/2 z-50 w-fit -translate-x-1/2 transform lg:right-4 lg:left-auto lg:translate-x-0"
    >
      <output
        role="status"
        class="`relative mb-3 flex min-h-14 max-w-sm items-center rounded-lg bg-white px-4 py-2 shadow-lg"
      >
        <TwSpinner class="h-7 w-7 animate-spin text-gray-500" />
        <div class="pointer-events-none mx-4 flex max-w-sm flex-col">
          <span class="pointer-events-none text-sm font-semibold text-gray-500">
            Page Loading
          </span>
          <p class="pointer-events-none break-words text-xs text-gray-400">
            Please wait...
          </p>
        </div>
      </output>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import TwSpinner from './tw-spinner.vue'
// defines
defineProps<{ loading?: boolean }>()
</script>
