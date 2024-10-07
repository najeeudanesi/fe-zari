<template>
    <div class="flex w-full flex-col space-y-8 px-4 pb-0 sm:p-8">
        <Title>Config · Zari</Title>
        <div class="flex justify-end">
            <Tabs v-bind="{ tabs }" />
        </div>
        <NuxtPage />
    </div>
</template>

<script setup lang="ts">
import Tabs from '~~/components/ui/tabs.vue'
import { NavItem } from '~~/composables/ui'

definePageMeta({ layout: 'admin', middleware: ['auth'] })
const tabs: NavItem[] = [
    { title: 'Categories', path: '/config' },
    { title: 'Units', path: '/config/units' },
    { title: 'Variants', path: '/config/variants' },
]
</script>