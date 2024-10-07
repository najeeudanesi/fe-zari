<template>
    <div class="relative flex h-full flex-col space-y-4 px-5 sm:px-14">
        <div class="grid grid-cols-2 gap-5">
            <div class="flex flex-col">
                <label class="text-sm font-semibold" for="serviceName">Service Name</label>
                <span id="serviceName">{{ service.name }}</span>
            </div>
            <div class="flex flex-col">
                <label class="text-sm font-semibold" for="category">Category</label>
                <span id="category">{{ service.category?.name }}</span>
            </div>
        </div>

        <div class="p-4 outline outline-1 outline-gray-200 rounded-lg">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 my-2 p-4">
                <div class="flex flex-col">
                    <label class="text-sm font-semibold" for="costPrice">Cost Price</label>
                    <span id="costPrice">{{ service.costPrice }}</span>
                </div>
            </div>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 my-2 border-t-2 border-primary p-4">
                <div class="flex flex-col">
                    <label class="text-sm font-semibold" for="sellingPrice">Selling Price</label>
                    <span id="sellingPrice">{{ service.sellingPrice }}</span>
                </div>
                <div class="flex items-center">
                    <div class="mt-5 text-lg h-11 font-bold text-white bg-primary py-2 px-3 rounded-lg">%</div>
                    <div class="flex flex-col ml-2">
                        <label class="text-sm font-semibold" for="discount">Selling Price Discount</label>
                        <span id="discount">{{ service.discount }}</span>
                    </div>
                </div>
                <div class="flex flex-col">
                    <label class="text-sm font-semibold" for="discountedPrice">Discounted Selling Price</label>
                    <span id="discountedPrice">{{ service.discountedPrice }}</span>
                </div>
                <div class="flex flex-col">
                    <label class="text-sm font-semibold" for="profit">Profit</label>
                    <span id="profit">{{ service.profit }}</span>
                </div>
            </div>
        </div>

        <div class="flex justify-center sm:gap-32 gap-16">
            <button @click="emit('close')" type="button" class="Btn__alt w-40">Close</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, reactive } from 'vue';
// Define props and emits
const props = defineProps<{
    data?: any
}>();
const emit = defineEmits(['close']);

// Define reactive variable for service form fields
const service = reactive(props.data || {});

// Method to close the view
const closeView = () => {
    emit('close');
};
</script>
