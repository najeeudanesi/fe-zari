<template>
  <div class="flex flex-col space-y-7 px-5 text-sm sm:px-14">
    <div v-for="_ in fakeRows" class="flex animate-pulse flex-col space-y-2">
      <span class="h-3 w-20 bg-gray-200"></span>
      <div class="flex flex-col space-y-2">
        <span class="h-2 w-4/12 bg-gray-200"></span>
        <span class="h-2 w-7/12 bg-gray-200"></span>
        <span class="h-2 w-5/12 bg-gray-200"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ rows: number }>()
const fakeRows = new Array(props.rows)
</script>
