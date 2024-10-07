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
                <label class="font-semibold">Product Name</label>
                <p>{{ product.name }}</p>
            </div>


            <div>
                <label class="block text-gray-700 mt-10">Product Description</label>
                <p class="text-lg">{{ product.description || 'No description provided' }}</p>
            </div>
        </div>

        <p class="font-bold text-2xl mt-16">Package</p>

        <div v-if="selectedStock.length > 0">
            <div v-for="stock in selectedStock" :key="stock.id"
                class="border p-4 mb-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <p class="text-xl font-bold ">{{ stock.product.name }}</p>
                <p>Attributes: {{ stock.values.map(value => value.value).join(', ') }}</p>
                <p>Cost Price: <b>{{ stock.costPrice }}</b></p>
                <p>Selling Price: <b>{{ stock.sellingPrice }}</b></p>
                <p>Quantity: <b>{{ stock.quantity }}</b></p>
            </div>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 my-2 border-t-2 border-primary p-4">
            <div>
                <label class="font-semibold">Selling Price</label>
                <p>{{ product.sellingPrice }}</p>
            </div>
            <div>
                <label class="font-semibold">Discount (%)</label>
                <p>{{ product.discount }}</p>
            </div>
            <div>
                <label class="font-semibold">Discounted Selling Price</label>
                <p>{{ product.discountedPrice }}</p>
            </div>
            <div>
                <label class="font-semibold">Profit</label>
                <p>{{ product.profit }}</p>
            </div>
        </div>

        <div class="flex items-end justify-end mt-4">
            <div class="flex justify-center sm:gap-32 gap-16">
                <button type="button" class="Btn__alt w-16 md:w-40" @click="emit('close')">Close</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue';
import { Category } from '~~/composables/resources/category';


const props = defineProps<{
    categories: Category[];
    productUnits: any[];
    product?: any;
    isUpdate?: boolean;
}>();

const config = useRuntimeConfig()
const baseUrl = config.public.apiBaseUrl
const emit = defineEmits(['close', 'submit'])
const mainImage = ref<any>(null);
const mainImageUrl = computed(() => {
    return mainImage?.value?.fileUrl || PLACEHOLDER_IMAGE;
});

const product = reactive({
    id: 0,
    name: '',
    stockLevelAlert: null,
    sellingPrice: 0,
    costPrice: 0,
    profit: 0,
    discount: 0,
    discountedPrice: 0,
    unit: { id: 0, name: '' },
    category: { id: 0, name: '' },
    productImages: [],
    stocks: [{
        id: 0,
        quantity: null,
        costPrice: null,
        sellingPrice: 0,
        expiryDate: '',
        stockLevelAlert: null,
        variantValueIds: [],
        discount: 0
    }],
});

const selectedStock = ref<any[]>([]);

onMounted(() => {

    product.productImages = props.product?.productImages || [],
        product.id = props.product.id;
    product.name = props.product.name;
    selectedStock.value = props.product?.items?.map((item: any) => ({
        id: item.stock.id,
        quantity: item.quantity || 0,
        sellingPrice: parseFloat(item.stock.sellingPrice),
        product: { name: item.stock.productName },
        values: item.stock.values || [],
    }));

});

const displayValue = (v: any) => v?.name || v?.product?.name;
</script>