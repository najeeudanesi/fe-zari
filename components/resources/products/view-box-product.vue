<template>
    <div class="relative flex h-full flex-col space-y-4 px-5 sm:px-14">
        <div class="mb-4 col-span-4">
            <div class="relative w-48">
                <img :src="product?.productImages[0]?.url ? (baseUrl + product?.productImages[0]?.url) : PLACEHOLDER_IMAGE"
                    alt="Main Image" class="h-48 w-48 rounded-lg object-cover" />
            </div>
        </div>

        <div class="">
            <div>
                <label class="block text-gray-700">Product Name</label>
                <p class="text-lg">{{ product.name }}</p>
            </div>

            <div>
                <label class="block text-gray-700 mt-10">Product Description</label>
                <p class="text-lg">{{ product.description || 'No description provided' }}</p>
            </div>
        </div>

        <p class="font-bold text-2xl mt-16">Package</p>

        <div v-if="selectedStock.length > 0">
            <div v-for="stock in selectedStock" :key="stock.id"
                class="border p-4 mb-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center w-full">
                <p class="text-xl font-bold">{{ stock.product.name }}</p>
                <p>Attributes:</p>
                <p v-for="value in stock.values" :key="value.id">{{ value.value }}</p>

                <p>Selling Price: <b>{{ stock.sellingPrice }}</b></p>
            </div>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 my-2 border-t-2 border-primary p-4">
            <div>
                <label class="block text-gray-700">Min Items</label>
                <p class="text-lg">{{ product.minAmount }}</p>
            </div>
            <div>
                <label class="block text-gray-700">Max Items</label>
                <p class="text-lg">{{ product.maxAmount }}</p>
            </div>
        </div>

        <!-- The buttons can be removed or commented out in read-only mode -->
        <!-- <div class="flex items-end justify-end mt-4">
            <div class="flex justify-center sm:gap-32 gap-16">
                <button type="button" class="Btn__alt w-16 md:w-40" @click="emit('close')">Cancel</button>
                <Btn class="cursor-pointer Btn w-16 md:w-40 disabled:bg-gray-400" @click="saveProduct"
                    :loading="loading ? 'Submitting...' : ''" :disabled="!isValidForm || loading">{{ isUpdate ? 'Update' : 'Save' }}
                </Btn>
            </div>
        </div> -->
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { Category } from '~~/composables/resources/category';
import { ProductUnit } from '~~/composables/resources/business';
import { BoxProduct } from '~~/composables/resources/product';

const props = defineProps<{
    categories: Category[];
    productUnits: ProductUnit[];
    product?: any;
    isUpdate?: boolean;
}>();

const config = useRuntimeConfig()
const baseUrl = config.public.apiBaseUrl

interface Stock {
    id: number;
    name: string;
    type: string | null;
    value: string | null;
    createdAt: string;
    updatedAt: string;
    costPrice: number;
    sellingPrice: number;
    quantity: number;
    values: Array<{
        id: number;
        variantId: number;
        value: string;
        createdAt: string;
        updatedAt: string;
    }>;
    product: any;
}

const product = reactive(props.product || {
    id: 0,
    name: '',
    minAmount: 0,
    maxAmount: 0,
    unit: {},
    category: {},
    items: [],
});

const stockOptions = ref<Stock[]>([]);
const selectedStock = ref<any>([]);

const mainImageUrl = computed(() => {
    return props.product?.mainImage || PLACEHOLDER_IMAGE;
});

// If isUpdate is true and product data is passed, pre-fill the form
onMounted(() => {

    selectedStock.value = props.product?.items?.map((item: any) => ({
        id: item.stock.id,
        quantity: item.quantity || 0,
        sellingPrice: parseFloat(item.price),
        product: { name: item.stock.productName },
        values: item.stock.values || [],
    }));

});

const displayValue = (v: any) => v?.name || v?.product?.name;
</script>
