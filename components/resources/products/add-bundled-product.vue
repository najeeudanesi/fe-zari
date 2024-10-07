<template>
    <div class="relative flex h-full flex-col space-y-4 px-5 sm:px-14">

        <div class="mb-4 col-span-4">
            <FileInput label="Main Image" id="mainImage" v-model="product.mainImage" v-slot="{ fileUrl }"
                :required="!product.mainImage.fileUrl || product.mainImage.fileUrl === PLACEHOLDER_IMAGE"
                accept="image/*">
                <div class="relative w-48">
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
                <VSelect id="unit" label="Unit" v-model="product.unit" :options="unitOptions" optionValue="id"
                    optionLabel="name" :displayValue="displayValue" :searchValue="displayValue" />
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
            <div v-for="stock in selectedStock" :key="stock.id"
                class="border p-4 mb-4 flex gap-4 justify-between items-center">
                <div class="border p-4 mb-4 grid grid-cols-1 md:grid-cols-3  gap-4 items-center">
                    <p class="text-xl font-bold ">{{ stock.product.name }}</p>
                    <p>Attributes:</p>
                    <p>Red,</p>
                    <p>XL</p>
                    <p>Cost Price: <b>{{ stock.costPrice }}</b></p>
                    <p>Selling Price: <b>{{ stock.sellingPrice }}</b></p>

                </div>


                <div class="flex flex-col items-center align-middle">
                    <VInput :id="`stock-${stock.id}`" label="Quantity" v-model="stock.quantity" type="number"
                        class="w-16" required />

                    <!-- <div class="text-xs mt-2">QTY: {{ stock.quantity }}</div> -->
                </div>
                <div v-for="value in stock.values" :key="value.id" class="flex justify-start gap-3">
                    <label :for="'value-' + value.id" class="ml-1">{{ value.value || 'value' }}</label>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 my-2 border-t-2 border-primary p-4">
            <VInput id="sellingPrice" label="Selling Price" v-model="product.sellingPrice" required type="number" />
            <div class="flex items-center">
                <div class="mt-5 text-lg h-11 font-bold text-white bg-primary py-2 px-3 rounded-lg">
                    %
                </div>
                <VInput id="discount" label="Selling price Discount" v-model="product.discount" type="number" />
            </div>
            <VInput id="stock" label="Discounted selling price" v-model="product.discountedPrice" type="number"
                :disabled="true" />
            <VInput id="profit" label="Profit" v-model="product.profit" type="number" :disabled="true" />
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
    product: Product;
}

interface NewStock {
    id: number;
    quantity: number | null;
    costPrice: number | null;
    sellingPrice: number | null;
    expiryDate: string;
    stockLevelAlert: number | null;
    variantValueIds: number[];
    discount: number;
}

interface Product {
    id: number;
    name: string;
    stockLevelAlert: number | null;
    sellingPrice: number;
    discountedPrice: number;
    costPrice: number;
    discount: number;
    profit: number;
    unit: ProductUnit;
    category: Category;
    stocks: NewStock[];
}

const product = reactive<any>({
    mainImage: { fileUrl: '', file: null },
    id: 0,
    name: '',
    stockLevelAlert: null,
    unit: { id: 0, name: '', status: '', createdAt: '', updatedAt: '' },
    category: { id: 0, name: '', status: '', createdAt: '', updatedAt: '' },
    sellingPrice: 0,
    costPrice: 0,
    profit: 0,
    discount: 0,
    discountedPrice: 0,
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

const stockOptions = ref<Stock[]>([]);
const selectedStock = ref<Stock[]>([]);
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
    console.log("prop", props.product)
    if (props.isUpdate && props.product) {
        product.id = props.product.id;
        product.description = props.product.description;
        product.name = props.product.name;
        product.unit = props.product.unitId ? { id: props.product.unitId } : {};
        product.category = props.product.categoryId ? { id: props.product.categoryId } : {};

        selectedStock.value = props.product?.items?.map((item: any) => ({
            id: item.stock.id,
            quantity: item.quantity || 0,
            sellingPrice: parseFloat(item.stock.sellingPrice),
            costPrice: parseFloat(item.stock.costPrice),
            product: { name: item.stock.product }, // Assuming you get this from your API
            values: item.stock.values || [], // Assuming stock has a 'values' array
        }));

        calculateTotals();
    }
});


// Watch selectedStock changes and append new items to the list without replacing
watch(() => props.product?.items, (newItems) => {
    if (props.isUpdate && newItems?.length > 0) {
        const newStocks = newItems.map((item: any) => ({
            id: item.stock.id,
            quantity: item.quantity || 0,
            sellingPrice: parseFloat(item.stock.sellingPrice),
            product: { name: item.stock.productName },
            values: item.stock.values || [],
        }));

        // Check for duplicates before appending new items
        newStocks.forEach((newStock) => {
            if (!selectedStock.value.some(stock => stock.id === newStock.id)) {
                selectedStock.value.push(newStock);
            }
        });
    }
}, { immediate: true, deep: true });


const calculateTotals = () => {
    let totalSellingPrice = 0;
    let totalCostPrice = 0;

    selectedStock.value.forEach(stock => {
        const sellingPrice = Number(stock.sellingPrice);
        const costPrice = Number(stock.costPrice);
        const quantity = Number(stock.quantity);

        // Multiply prices by quantity and add to the total
        totalSellingPrice += sellingPrice * quantity;
        totalCostPrice += costPrice * quantity;
    });

    product.sellingPrice = totalSellingPrice;
    product.discountedPrice = totalSellingPrice * (1 - product.discount / 100);
    product.profit = product.discountedPrice - totalCostPrice;
};

const calculateEditTotals = () => {
    let totalSellingPrice = 0;
    let totalCostPrice = 0;

    selectedStock.value.forEach(stock => {
        const sellingPrice = Number(stock.sellingPrice);
        const costPrice = Number(stock.costPrice);

        totalSellingPrice += sellingPrice;
        totalCostPrice += costPrice;
    });


    product.discountedPrice = product.sellingPrice * (1 - product.discount / 100);
    product.profit = product.discountedPrice - totalCostPrice;
};

watch(selectedStock, calculateTotals, { deep: true });
watch(() => product.discount, calculateEditTotals);
watch(() => product.sellingPrice, calculateEditTotals);
watch(() => product.quantity, calculateEditTotals); // Add this to watch newQuantity



const saveProduct = async () => {
    loading.value = true;
    try {
        const payload = {
            name: product.name,
            description: product.description,
            categoryId: product.category.id,
            unitId: product.unit.id,
            discount: product.discount,
            discountType: "percentage",
            price: product.sellingPrice,
            items: selectedStock.value.map(stock => ({
                quantity: stock.quantity,
                stockId: stock.id,
            })),
        };

        const method = props.isUpdate ? 'PUT' : 'POST';
        const url = props.isUpdate ? `/bundled-products/${product.id}` : '/bundled-products';

        const response = await apiFetch(url, {
            method,
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        addToast({ message: `Product ${props.isUpdate ? 'updated' : 'added'} successfully`, type: 'success' });

        const data = await response.data
        const productId = data.id; // Get the newly created product ID

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
    if (mainImage) {
        imageUploads.push(
            apiFetch('media', {
                method: 'POST',
                body: toFormData({
                    file: product.mainImage.file,
                    key: 'bundled_product_image',
                    entity: 'bundled_products',
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
        product.stocks.length > 0 &&
        selectedStock.value.every(stock => stock.quantity)
    );
});
onMounted(fetchStocks);

const displayValue = (v: any) => v?.name || v?.product?.name;
</script>
