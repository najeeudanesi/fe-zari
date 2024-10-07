<template>
    <Title>Analytics · Inventory · Zari</Title>
    <div>
        <label
            class="flex lg:max-w-1/2 max-w-full  items-center rounded-xl bg-white py-3 pl-2 text-sm text-gray-500 shadow-sm w-full md:w-1/3 top-[-25px] xl:top-[-60px] relative">
            <Icon name="search" class="h-7" />
            <input type="text" class="w-full px-4 placeholder:text-gray-300 focus:outline-none"
                placeholder="Search keyword, name, message" v-model="search" />
        </label>
        <h2>Analytics</h2>
        <!-- Add your analytics content here -->
    </div>
</template>

<script setup>

import Icon from '~~/components/ui/icon.vue'


const search = ref('')
</script>

<style scoped></style>