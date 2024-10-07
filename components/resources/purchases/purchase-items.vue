<template>
  <table class="w-full">
    <thead>
      <th class="text-left text-xs text-gray-400">Item</th>
      <th class="text-right text-xs text-gray-400">Price</th>
      <th class="pt-4"></th>
    </thead>
    <tr
      v-for="(item, i) in items"
      class="rounded-xl border-b text-gray-600 last:border-none"
    >
      <td class="py-4 text-xs text-gray-600">
        {{ item.name }}
      </td>
      <td class="py-4 text-right text-xs text-gray-600">
        {{ toMoney({ amount: item.price ?? 0, currency: 'NGN' }) }}
      </td>
      <td class="py-4 text-right text-xs text-gray-600">
        <slot name="actions" v-bind="{ item, i }"></slot>
      </td>
    </tr>
  </table>
</template>

<script setup lang="ts">
import { PurchaseItem } from '~~/composables/resources/gifting'

// defines
defineProps<{ items: Partial<PurchaseItem>[] }>()
</script>
