<template>
  <div
    class="flex h-full w-full flex-col items-center justify-center space-y-4 text-center text-gray-700"
  >
    <div class="-mt-16 rounded-full bg-green-500 p-2">
      <Icon name="check" class="h-20 w-20 text-white" />
    </div>
    <h1 class="text-2xl font-bold">Transaction Completed</h1>
    <span class="max-w-md text-base">
      This transaction has been completed and an invoice has been sent to our
      mail.
    </span>
  </div>
</template>

<script setup lang="ts">
import Icon from '~~/components/ui/icon.vue'
</script>
