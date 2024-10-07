<template>
    <div class="relative flex h-full flex-col space-y-4 px-5 sm:px-14">
        <div class="flex gap-10 grid-cols-1 sm:grid-cols-2">
            <div class="mb-4 col-span-4">
                <!-- Main Image Display -->
                <div class="relative w-48">
                    <img :src="product?.productImages[0]?.url ? (baseUrl + product?.productImages[0]?.url) : PLACEHOLDER_IMAGE"
                        alt="Main Image" class="h-48 w-48 rounded-lg object-cover" />
                </div>
            </div>

            <!-- Additional Images Display -->
            <div class="mb-4 col-span-8">
                <label class="block mb-2 text-xs font-medium text-gray-700">Additional Images</label>
                <div class="flex flex-wrap gap-4">
                    <div v-for="(image, index) in product?.productImages" :key="index" class="relative w-24 h-24">
                        <img :src="image.url ? (baseUrl + image?.url) : PLACEHOLDER_IMAGE" alt=""
                            class="h-24 w-24 rounded-lg object-cover" />
                    </div>
                </div>
            </div>
        </div>



        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
                <p class="text-sm font-semibold">Product Name</p>
                <p class="text-gray-700">{{ product.name }}</p>
            </div>
            <div>
                <p class="text-sm font-semibold">Unit</p>
                <p class="text-gray-700">{{ product.unit?.name }}</p>
            </div>
            <div>
                <p class="text-sm font-semibold">Category</p>
                <p class="text-gray-700">{{ product.category?.name }}</p>
            </div>
            <!-- <div>
                <p class="text-sm font-semibold">Variants</p>
                <div v-if="selectedVariant.length > 0">
                    <div v-for="variant in selectedVariant" :key="variant.id" class="mb-4">
                        <p class="font-bold">{{ variant.name }}</p>
                        <div v-for="value in variant.values" :key="value.id" class="flex gap-2">
                            <span>{{ value.value }}</span>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <p class="text-gray-700">No variants selected</p>
                </div>
            </div> -->
        </div>

        <!-- Description Display -->
        <div class="mb-4">
            <p class="text-sm font-semibold">Description</p>
            <p class="text-gray-700">{{ product.description || 'No description provided' }}</p>
        </div>

        <div class="mt-4">
            <p class="font-bold text-2xl">Stocks</p>
            <div v-for="(stock, sIndex) in product.stocks" :key="sIndex" class="border p-4 mb-4">
                <div class="grid grid-cols-2 md:grid-cols-3 gap-8 mt-4">
                    <div v-for="(variant, vIndex) in selectedVariant" :key="vIndex" class="col-span-1">
                        <p class="text-sm font-semibold">{{ variant.name }}</p>
                        <p class="text-gray-700">
                            {{
                                variant.values.find(
                                    (value) => value.id === stock.variantValueIds[vIndex]
                                )?.value || 'N/A'
                            }}
                        </p>
                    </div>
                    <div>
                        <p class="text-sm font-semibold">Quantity</p>
                        <p class="text-gray-700">{{ stock.quantity }}</p>
                    </div>
                    <div>
                        <p class="text-sm font-semibold">Cost Price</p>
                        <p class="text-gray-700">{{ stock.costPrice }}</p>
                    </div>
                    <div>
                        <p class="text-sm font-semibold">Selling Price</p>
                        <p class="text-gray-700">{{ stock.sellingPrice }}</p>
                    </div>
                    <div>
                        <p class="text-sm font-semibold">Discount</p>
                        <p class="text-gray-700">{{ stock.discount }}%</p>
                    </div>
                    <div>
                        <p class="text-sm font-semibold">Expiry Date</p>
                        <p class="text-gray-700">{{ stock.expiryDate || 'N/A' }}</p>
                    </div>
                    <div>
                        <p class="text-sm font-semibold">Profit</p>
                        <p class="text-gray-700">{{ calculateProfit(stock) }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex items-end justify-end mt-4">
            <button type="button" class="Btn__alt w-40" @click="emit('close')">
                Close
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Category } from '~~/composables/resources/category'
import { ProductUnit, Variant } from '~~/composables/resources/business'


const props = defineProps<{
    categories: Category[]
    productUnits: ProductUnit[]
    product: any
}>();
const emit = defineEmits(['close', 'submit'])
const config = useRuntimeConfig()
const baseUrl = config.public.apiBaseUrl
interface Stock {
    quantity: number
    costPrice: number | null
    sellingPrice: number | null
    expiryDate: string
    stockLevelAlert: number | null
    variantValueIds: number[]
    discount: number
}

interface Product {
    name: string | null
    stockLevelAlert: number | null
    quantity: number | null
    unit: ProductUnit
    category: Category
    stocks: Stock[]
}

const product = reactive(props.product)

const selectedVariant = ref<Variant[]>([])
const { addToast } = useToast()


onMounted(() => {

    console.log('props', props.product)


    product.id = props.product.id
    product.name = props.product.name || null
    product.unit = props.product.unit || null
    product.category = props.product.category || null
    product.stocks = props.product.stocks.map((stock) => ({
        quantity: stock.quantity || 0,
        costPrice: stock.costPrice || null,
        sellingPrice: stock.sellingPrice || null,
        expiryDate: stock.expiryDate || '',
        stockLevelAlert: stock.stockLevelAlert || null,
        variantValueIds: stock.variantValueIds || [],
        discount: stock.discount || 0
    }))

    // Select the associated variants



})

const calculateProfit = (stock: Stock) => {
    return stock.sellingPrice && stock.costPrice
        ? stock.sellingPrice - stock.costPrice - (stock.discount || 0)
        : 'N/A'
}
</script>