<template>
  <div class="flex flex-col">
    <div
      v-for="(log, i) in logs"
      class="relative flex min-h-20 flex-col border-l border-gray-300 pb-4 pl-4 pt-1"
    >
      <div
        :class="[
          'absolute -left-[0.4375rem] top-2 box-border h-3.5 w-3.5 rounded-full border-[3px] border-primary',
          i === 0 ? 'bg-primary' : 'bg-white'
        ]"
      ></div>
      <span class="text-[.8rem] font-semibold capitalize"
        >{{ log.comment.replaceAll('_', ' ') }}
      </span>
      <div class="text-3xs">
        <span class="mr-1">
          {{ formatDate(log.createdAt, 'dt') }}
        </span>
        <NuxtLink
          :to="`/users/view/${log.creator?.id}`"
          class="hover:text-primary"
        >
          {{ log.creator?.name }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ItemLog } from '~~/composables/resources/system'

defineProps<{ logs: ItemLog[] }>()
</script>
