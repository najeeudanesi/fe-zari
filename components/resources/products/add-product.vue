<template>
    <div class="relative flex h-full flex-col space-y-4 px-5 sm:px-14">

        <div class="grid grid-cols-2 gap-5">

            <VInput id="quantity" label="Quantity" v-model="product.quantity" required placeholder="Quantity"
                type="number" />
            <div>
                <label for="expDate" class="text-xs flex gap-1 text-gray-700 mb-3">Exp Date</label>
                <VueDatePicker v-model="product.expDate" name="expDate" id="expDate" format="d.MM.yy" />
            </div>
        </div>

        <div class="p-4 outline outline-1 outline-gray-200 rounded-lg">

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 my-2 p-4">
                <VInput id="costPrice" label="Cost Price" v-model="product.costPrice" required type="number" />

            </div>

            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 my-2  border-t-2 border-primary p-4">
                <VInput id="sellingPrice" label="Selling Price" v-model="product.sellingPrice" required type="number" />
                <div class="flex items-center">
                    <div class="mt-5 text-lg h-11 font-bold text-white bg-primary py-2 px-3 rounded-lg">%</div>
                    <VInput id="discount" label="Selling Price Discount" v-model="product.discount" required
                        type="number" />
                </div>

                <VInput id="discountedPrice" label="Discounted Selling Price" v-model="product.discountedPrice" required
                    type="number" :disabled="true" />
                <VInput id="profit" label="Profit" v-model="product.profit" required type="number" :disabled="true" />
            </div>

        </div>

        <div class="flex justify-center sm:gap-32 gap-16">
            <button @click="emit('close')" type="button" class="Btn__alt w-40">
                Cancel
            </button>
            <Btn @click="submitProduct" class="Btn w-40" :loading="loading ? 'Submitting...' : ''"
                :disabled="!isValidForm">
                Save
            </Btn>
        </div>
    </div>
</template>

<script setup lang="ts">
import Icon from '~~/components/ui/icon.vue'
import VInput from '~~/components/input/v-input.vue'
import VSelect from '~~/components/input/v-select.vue'
import { ProductForm } from '~/composables/resources/business'
import VTextArea from '~~/components/input/v-text-area.vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import Btn from '~~/components/input/btn.vue'
const { addToast } = useToast();
// defines
const props = defineProps<{
    data?: ProductForm
    submitting?: boolean
}>()
const emit = defineEmits(['close', 'submit'])
const loading = ref(false)

// refs
const product = reactive(props.data || { ...defaultProduct, discount: 0 })

// methods
const calculateDiscountedPrice = () => {
    if (product.sellingPrice && product.discount) {
        product.discountedPrice = product.sellingPrice - (product.sellingPrice * product.discount / 100);
    } else {
        product.discountedPrice = product.sellingPrice || 0;
    }
}

const calculateProfit = () => {
    if (product.costPrice && product.discountedPrice) {
        product.profit = product.discountedPrice - product.costPrice;
    } else {
        product.profit = 0;
    }
}

// Watchers to auto-calculate discounted price and profit
watch([() => product.sellingPrice, () => product.discount], () => {
    calculateDiscountedPrice();
    calculateProfit();
});

watch([() => product.costPrice, () => product.discountedPrice], () => {
    calculateProfit();
});

// Computed property to check if the form is valid
const isValidForm = computed(() => {
    return (
        product.name &&
        product.category &&
        product.quantity &&
        product.stock &&
        product.sellingPrice
    );
});

// Method to submit form data
const submitProduct = async () => {
    loading.value = true;
    let payload = {

        id: product.id,
        productId: product.id,
        quantity: product.quantity,
        costPrice: product.costPrice,
        sellingPrice: product.sellingPrice,
        expiryDate: formatDate(product.expDate, 'in'),
        createdAt: "",
        updatedAt: ""
    };

    console.log(payload);

    try {
        // Send a POST request to the API endpoint
        const response = await apiFetch('/stocks', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Handle success response
        console.log('Stock added successfully:', response);
        loading.value = false
        addToast({ message: 'Stock added successfully', type: 'success' });
        emit('submit');
        emit('close');
    } catch (error) {
        // Handle error
        console.error('Error adding Stock:', error);
        addToast({ message: 'Failed to add Stock', type: 'error' });
        loading.value = false
    }

    loading.value = false
};


onMounted(calculateDiscountedPrice)
onMounted(calculateProfit)
</script>
