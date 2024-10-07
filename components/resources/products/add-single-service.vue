<template>
    <div class="relative flex h-full flex-col space-y-4 px-5 sm:px-14">
        <div class="grid grid-cols-2 gap-5">
            <VInput id="serviceName" label="Service Name" v-model="service.name" required placeholder="Service Name" />
            <VSelect id="category" label="Category" v-model="service.category" required :options="categoryOptions"
                optionValue="id" optionLabel="name" :displayValue="displayValue" :searchValue="displayValue" />
        </div>

        <div class="mb-4">
            <VTextArea id="description" label="Description" v-model="service.description"
                placeholder="Enter service description here" rows="4" />
        </div>
        <div class="p-4 outline outline-1 outline-gray-200 rounded-lg">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 my-2 p-4">
                <VInput id="costPrice" label="Cost Price" v-model="service.costPrice" required type="number" />
            </div>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 my-2 border-t-2 border-primary p-4">
                <VInput id="sellingPrice" label="Selling Price" v-model="service.sellingPrice" required type="number" />
                <div class="flex items-center">
                    <div class="mt-5 text-lg h-11 font-bold text-white bg-primary py-2 px-3 rounded-lg">%</div>
                    <VInput id="discount" label="Selling price Discount" v-model="service.discount" type="number" />
                </div>
                <VInput id="stock" label="Discounted selling price" v-model="service.discountedPrice" :disabled="true"
                    type="number" />
                <VInput id="profit" label="Profit" v-model="service.profit" :disabled="true" type="number" />
            </div>
        </div>

        <div class="flex justify-center sm:gap-32 gap-16">
            <button @click="emit('close')" type="button" class="Btn__alt w-40">Cancel</button>
            <Btn v-if="!isUpdate" @click="submitService" class="Btn w-40 disabled:bg-gray-400" :disabled="!isValidForm"
                :loading="submitting ? 'Submitting...' : ''">Save</Btn>
            <Btn v-else @click="updateService" class="Btn w-40 disabled:bg-gray-400" :disabled="!isValidForm"
                :loading="submitting ? 'Submitting...' : ''">Save</Btn>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, reactive, watch, computed } from 'vue';
import VInput from '~~/components/input/v-input.vue';
import VSelect from '~~/components/input/v-select.vue';
import VTextArea from '~~/components/input/v-text-area.vue';
import { ServiceForm } from '~/composables/resources/business';
import { Category } from '~~/composables/resources/category';
import Btn from '~~/components/input/btn.vue';
const { addToast } = useToast();

// Define props and emits
const props = defineProps<{
    data?: ServiceForm
    categories?: Category[]
    isUpdate?: Boolean
}>();
const emit = defineEmits(['close', 'submit']);
const submitting = ref(false);
const categoryOptions = props.categories || [];

// Define reactive variable for service form fields
const service = reactive(props.data || { ...defaultService });

const calculateProfit = () => {
    if (service.sellingPrice && service.discount != null) {
        service.discountedPrice = service.sellingPrice - (service.sellingPrice * service.discount / 100);
    } else {
        service.discountedPrice = service.sellingPrice; // or set a default value if needed
    }
}

const calculateDiscountedPrice = () => {
    if (service.costPrice && service.discountedPrice) {
        service.profit = service.discountedPrice - service.costPrice;
    } else {
        service.profit = 0; // or set a default value if needed
    }
}
// Watchers to auto-calculate discounted price and profit
watch([() => service.sellingPrice, () => service.discount], () => {
    calculateProfit()
});

watch([() => service.costPrice, () => service.discountedPrice], () => {
    calculateDiscountedPrice()
});

// Method to submit service form data
const submitService = async () => {
    submitting.value = true;
    const payload = {
        name: service.name,
        categoryId: service.category.id,
        costPrice: service.costPrice,
        sellingPrice: service.sellingPrice,
        discount: service.discount,
        discountedPrice: service.discountedPrice,
        profit: service.profit,
        createdAt: "",
        updatedAt: ""
    };
    try {
        // Send a POST request to the API endpoint
        const response = await apiFetch('/services', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        addToast({ message: 'Service added successfully', type: 'success' });
        setTimeout(() => {
            // Refresh the page here
            location.reload();
        }, 1000);


    } catch (error) {
        // Handle any errors
        console.error('Error adding service:', error.data);
        // Optionally, display an error toast message
        addToast({ message: error.data.message || 'Failed to add service', type: 'error' });
    }
    submitting.value = false;
};

// Method to update service
const updateService = async () => {
    submitting.value = true;
    const payload = {
        id: service.id,
        name: service.name,
        categoryId: service.category.id,
        description: "",
        costPrice: service.costPrice,
        sellingPrice: service.sellingPrice,
        discount: service.discount,
        discountedPrice: service.discountedPrice,
        createdAt: "",
        updatedAt: ""
    };
    try {
        const response = await apiFetch(`/services/${service.id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        addToast({ message: 'Service updated successfully', type: 'success' });
        emit('submit');
        emit('close');
    } catch (error) {
        // Handle any errors
        console.error('Error updating service:', error.data);
        // Optionally, display an error toast message
        addToast({ message: error.data.error || 'Failed to update service', type: 'error' });
    }
    submitting.value = false;
};

// Method to display value in select options
const displayValue = (v) => v?.name;

// Computed property to check if the form is valid
const isValidForm = computed(() => {
    return (
        service.name &&
        service.category &&
        service.costPrice &&
        service.sellingPrice &&
        service.discountedPrice !== null
    );
});

onMounted(calculateProfit)
onMounted(calculateDiscountedPrice)
</script>
