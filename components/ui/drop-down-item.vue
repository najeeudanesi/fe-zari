<template>
  <button
    class="group flex w-full items-center rounded-md px-4 py-3 text-sm text-gray-400 transition duration-500 ease-in-out hover:bg-gray-100 hover:text-gray-500"
  >
    <TwSpinner v-if="item.loading" class="mr-4 h-5 w-5 animate-spin" />
    <Icon v-if="item.icon" :name="item.icon" class="mr-4 h-5 w-5" />
    {{ item.title }}
  </button>
</template>

<script setup lang="ts">
import TwSpinner from './tw-spinner.vue'
import Icon from './icon.vue'
import { NavItem } from '~~/composables/ui'

// defines
defineProps<{ item: NavItem }>()
</script>
