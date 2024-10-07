<template>
  <div class="flex w-full flex-col space-y-8 px-4 pb-0 sm:p-8">
    <Title>Users · Zari</Title>
    <Tabs v-bind="{ tabs }" />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import Tabs from '~~/components/ui/tabs.vue'
import { NavItem } from '~~/composables/ui'

// refs
const tabs: NavItem[] = [
  { title: 'Giftees', path: '/users' },
  { title: 'Vendors Admins', path: '/users/vendor' },
  { title: 'Zari Admins', path: '/users/admin' }
]
</script>
