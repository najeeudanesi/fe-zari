<template>
    <div class="relative flex h-full flex-col space-y-4 px-5 sm:px-14">
        <div class="mb-4 col-span-4">
            <FileInput label="Main Image" id="mainImage" v-model="product.mainImage" v-slot="{ fileUrl }"
                accept="image/*">
                <div class="relative w-48" accept="image/*">
                    <div class="absolute bottom-0 right-0 rounded-full bg-gray-100 p-1.5">
                        <Icon name="pencil" class="h-3.5 w-3.5" />
                    </div>
                    <img :src="fileUrl || PLACEHOLDER_IMAGE" alt="Main Image"
                        class="h-48 w-48 rounded-lg object-cover" />
                </div>
            </FileInput>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <VInput id="productName" label="Product Name" v-model="product.name" required placeholder="Product Name" />
            <!-- <div>
                <VSelect id="unit" label="Unit" v-model="product.unit"  :options="unitOptions" optionValue="id"
                    optionLabel="name" :displayValue="displayValue" :searchValue="displayValue" />
            </div> -->
            <!-- <div>
                <VSelect id="category" label="Category" v-model="product.category" required :options="categoryOptions"
                    optionValue="id" optionLabel="name" :displayValue="displayValue" :searchValue="displayValue" />
            </div> -->
            <div>
                <VSelect id="stocks" label="Stocks" v-model="selectedStock" required multiple :options="stockOptions"
                    optionValue="id" optionLabel="name" :displayValue="displayValue" :searchValue="displayValue" />
            </div>
        </div>


        <div class="mb-4">
            <VTextArea id="description" label="Description" v-model="product.description"
                placeholder="Enter product description here" rows="4" />
        </div>
        <p class="font-bold text-2xl mt-16">Package</p>

        <div v-if="selectedStock.length > 0">
            <div v-for="stock in selectedStock" :key="stock.id" class="border p-4 mb-4 flex gap-4 items-center w-full">
                <div class="border p-4 mb-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center w-full">
                    <p class="text-xl font-bold ">{{ stock.product.name }}</p>
                    <p>Attributes:</p>
                    <p>Red,</p>
                    <p>XL</p>
                    <p>Selling Price: <b>{{ stock.sellingPrice }}</b></p>

                </div>

            </div>
        </div>


        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 my-2 border-t-2 border-primary p-4">
            <VInput id="minAmount" label="Min Items" v-model="product.minAmount" required type="number" />
            <VInput id="maxAmount" label="Max Items" v-model="product.maxAmount" required type="number" />
        </div>

        <div class="flex items-end justify-end mt-4">
            <div class="flex justify-center sm:gap-32 gap-16">
                <button type="button" class="Btn__alt w-16 md:w-40" @click="emit('close')">Cancel</button>
                <Btn class="cursor-pointer Btn w-16 md:w-40 disabled:bg-gray-400" @click="saveProduct"
                    :loading="loading ? 'Submitting...' : ''" :disabled="!isValidForm || loading">{{ isUpdate ? 'Update'
                        : 'Save' }}
                </Btn>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import VInput from '~~/components/input/v-input.vue';
import VTextArea from '~~/components/input/v-text-area.vue';
import VSelect from '~~/components/input/v-select.vue';
import { Category } from '~~/composables/resources/category';
import { ProductUnit } from '~~/composables/resources/business';
import { BoxProduct } from '~~/composables/resources/product';
import Btn from '~~/components/input/btn.vue';
import FileInput from '~~/components/input/file-input.vue'
import Icon from '~~/components/ui/icon.vue';

const props = defineProps<{
    submitting?: boolean;
    categories: Category[];
    productUnits: ProductUnit[];
    product?: any;
    isUpdate?: boolean;
}>();

const mainImage = ref<File | null>(null);

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
    newQuantity: number;
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
    mainImage: { fileUrl: '', file: null },
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
const loading = ref(false);

const emit = defineEmits(['close', 'submit']);
const { addToast } = useToast();

const unitOptions = ref(props.productUnits || []);
const categoryOptions = props.categories || [];

const mainImageUrl = computed(() => {
    return product.mainImage?.value?.fileUrl || PLACEHOLDER_IMAGE;
});

// If isUpdate is true and product data is passed, pre-fill the form
onMounted(() => {
    if (props.isUpdate && props.product) {
        // Pre-fill the form with product data
        product.mainImage = { fileUrl: '', file: null };
        product.id = props.product.id;
        product.name = props.product.name;
        product.minAmount = parseFloat(props.product.minAmount);
        product.maxAmount = parseFloat(props.product.maxAmount);
        product.unit = props.product.unitId ? { id: props.product.unitId } : {};
        product.category = props.product.categoryId ? { id: props.product.categoryId } : {};

        selectedStock.value = props.product?.items?.map((item: any) => ({
            id: item.stock.id,
            quantity: item.quantity || 0,
            sellingPrice: parseFloat(item.price),
            product: { name: item.stock.productName }, // Assuming you get this from your API
            values: item.stock.values || [], // Assuming stock has a 'values' array
        }));
    }
});

watch(() => props.product?.items, (newItems) => {
    if (props.isUpdate && newItems?.length > 0) {

        const newStocks = newItems.map((item: any) => ({
            id: item.stock.id,
            quantity: item.quantity || 0,
            sellingPrice: parseFloat(item.price),
            product: { name: item.stock.productName },
            values: item.stock.values || [],
        }));

        // Merge new items with existing ones
        selectedStock.value = [...selectedStock.value, ...newStocks.filter(newStock =>
            !selectedStock.value.some(stock => stock.id === newStock.id)
        )];
    }
}, { immediate: true, deep: true });


const saveProduct = async () => {
    loading.value = true;
    try {
        const payload = {
            name: product.name,
            description: product.description,
            minAmount: product.minAmount,
            maxAmount: product.maxAmount,
            unitId: product.unit.id,
            categoryId: product.category.id,
            items: selectedStock.value.map(stock => ({
                stockId: stock.id,
                price: stock.sellingPrice,
            })),
        };

        const method = props.isUpdate ? 'PUT' : 'POST';
        const url = props.isUpdate ? `/box-products/${product.id}` : '/box-products';

        const response = await apiFetch(url, {
            method,
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        addToast({ message: `Product ${props.isUpdate ? 'updated' : 'added'} successfully`, type: 'success' });
        const data = await response
        const productId = data.data.id; // Get the newly created product ID

        // Handle image upload using the productId
        if (mainImage)
            await uploadProductImages(productId);

        emit('submit');
        emit('close');
    } catch (error) {
        console.error('Unexpected error:', error.data || error);
        addToast({ message: error.data.message + " details: " + error.data.details || 'Unexpected error occurred', type: 'error' });
        loading.value = false;

    }

    loading.value = false;
};


const uploadProductImages = async (productId: number): Promise<void> => {
    const imageUploads: Promise<any>[] = []; // Explicitly declare the array type as Promise<any>[]

    // Add the main logo image
    if (product.mainImage) {
        imageUploads.push(
            apiFetch('media', {
                method: 'POST',
                body: toFormData({
                    file: product.mainImage.file,
                    key: 'box_product_image',
                    entity: 'box_products',
                    refId: productId // Use the product ID returned from the product API
                })
            })
        );
    }


    try {
        await Promise.all(imageUploads); // Wait for all images to be uploaded
        addToast({ message: 'Images uploaded successfully', type: 'success' });
    } catch (error) {
        console.error('Error uploading images:', error);
        addToast({ message: 'Error uploading images', type: 'error' });
    }
};

const fetchStocks = async () => {
    try {
        const response = await apiFetch('/stocks', { method: 'GET' });
        stockOptions.value = response;
    } catch (e) {
        console.error(e);
    }
};

const isValidForm = computed(() => {
    return (
        product.name &&
        product.minAmount &&
        product.maxAmount &&
        selectedStock.value.length > 0

    );
});

onMounted(fetchStocks);

// Watch selectedStock changes and append new items to the list without replacing
watch(() => props.product?.items, (newItems) => {
    if (props.isUpdate && newItems?.length > 0) {
        const newStocks = newItems.map((item: any) => ({
            id: item.stock.id,
            quantity: item.quantity || 0,
            sellingPrice: parseFloat(item.price),
            product: { name: item.stock.productName }, // Assuming you get this from your API
            values: item.stock.values || [], // Assuming stock has a 'values' array
        }));

        // Check for duplicates before appending new items
        newStocks.forEach((newStock) => {
            if (!selectedStock.value.some(stock => stock.id === newStock.id)) {
                selectedStock.value.push(newStock);
            }
        });
    }
}, { immediate: true, deep: true });

const displayValue = (v: any) => v?.name || v?.product?.name;
</script>
