<template>
    <td class="TableCell hidden lg:table-cell">
        <div v-bind="$attrs" class="my-2 flex h-20 w-full items-center bg-white py-1 px-4 text-sm">
            <slot></slot>
        </div>
    </td>
    <div v-if="typeof header === 'string'" class="flex flex-col space-y-1 lg:hidden">
        <span class="text-gray-500">{{ header }}</span>
        <div class="flex items-center" v-bind="$attrs">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
// defines
defineProps<{ header?: string }>()
</script>