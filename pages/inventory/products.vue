<template>
    <div class="overflow-auto pt-7 px-3 w-full  min-h-screen">
        <div :key="componentKey">

            <div class="flex justify-between mb-10 mt-16">
                <div class="flex gap-10 items-center ">
                    <button class="Btn bg-primary" @click="toggleProductModal">Add New +</button>

                </div>

                <!-- <div v-if="viewMode === 'Single Products'">
        <button class="bg-none outline font outline-1 outline-primary text-primary rounded-md px-4 py-2 flex"
            @click="exportCategoriesToXLSX(products.data, 'Products')">
            <p>Export</p>
            <Icon :name="'export'" />
        </button>
    </div>
    <div v-else>
        <button class="bg-none outline font outline-1 outline-primary text-primary rounded-md px-4 py-2 flex"
            @click="exportCategoriesToXLSX(services.data, 'Services')">
            <p>Export</p>
            <Icon :name="'export'" />
        </button>
    </div> -->
            </div>


            <div class="flex gap-2">
                <!-- Tabs as chips -->
                <div v-for="tab in tabs" :key="tab" class="cursor-pointer px-4 py-2 rounded-md text-sm" :class="{
            'bg-primary text-white': viewMode === tab,
            'bg-gray-200 text-gray-600': viewMode !== tab
        }" @click="toggleViewMode(tab)">
                    {{ tab }}
                </div>
            </div>
            <template v-if="viewMode === 'Single Products'">
                <ProductsTable :search="search" :reload="reload" />
            </template>
            <template v-if="viewMode === 'Services'">
                <ServicesTable :search="search" :reload="reload" />
            </template>
            <template v-if="viewMode === 'Gift Boxes'">
                <BundledProductsTable :search="search" :reload="reload" />
            </template>
            <template v-if="viewMode === 'Custom Boxes'">
                <BoxProductsTable :search="search" :reload="reload" />
            </template>

            <!-- Modals and other components -->
            <PopUp :open="modalOpen" staticBackDrop title="Create new Product" @close="toggleProductModal"
                description="" :buttons="[{ alt: true, text: 'Cancel', handler: toggleProductModal }]">
                <template #content>
                    <div class="p-6 flex flex-col space-y-4">
                        <div class="flex items-center w-full justify-between outline outline-2 outline-gray-200 rounded-lg p-4 cursor-pointer hover:scale-105 btn-transition"
                            @click="toggleSingleProductModal">
                            <div class="flex items-center gap-4">
                                <Icon name="product" class="h-6 w-12" />
                                <div>
                                    <div class="text-gray-800 text-lg"> Single Product/Service</div>

                                </div>
                            </div>
                            <div class="text-gray-800">
                                <Icon name="chevron-right" class="h-5 w-5" />
                            </div>
                        </div>
                        <div class="flex items-center w-full justify-between outline outline-2 outline-gray-200 rounded-lg p-4 cursor-pointer hover:scale-105 btn-transition"
                            @click="toggleMultiProductModal">
                            <div class="flex items-center gap-4">
                                <Icon name="product-stack" class="h-6 w-12" />
                                <div>
                                    <div class="text-gray-800 text-lg"> Multiple product</div>

                                </div>
                            </div>
                            <div class="text-gray-800">
                                <Icon name="chevron-right" class="h-5 w-5" />
                            </div>
                        </div>
                        <div class="flex items-center w-full justify-between outline outline-2 outline-gray-200 rounded-lg p-4 cursor-pointer hover:scale-105 btn-transition"
                            @click="toggleVariableProductModal">
                            <div class="flex items-center gap-4">
                                <Icon name="product" class="h-6 w-12" />
                                <div>
                                    <div class="text-gray-800 text-lg"> Variable Product</div>

                                </div>
                            </div>
                            <div class="text-gray-800">
                                <Icon name="chevron-right" class="h-5 w-5" />
                            </div>
                        </div>
                        <div class="flex items-center w-full justify-between outline outline-2 outline-gray-200 rounded-lg p-4 cursor-pointer hover:scale-105 btn-transition"
                            @click="toggleBundledProductModal">
                            <div class="flex items-center gap-4">
                                <Icon name="product" class="h-6 w-12" />
                                <div>
                                    <div class="text-gray-800 text-lg">Ready To Gift Box</div>

                                </div>
                            </div>
                            <div class="text-gray-800">
                                <Icon name="chevron-right" class="h-5 w-5" />
                            </div>
                        </div>
                        <div class="flex items-center w-full justify-between outline outline-2 outline-gray-200 rounded-lg p-4 cursor-pointer hover:scale-105 btn-transition"
                            @click="toggleBoxProductModal">
                            <div class="flex items-center gap-4">
                                <Icon name="product" class="h-6 w-12" />
                                <div>
                                    <div class="text-gray-800 text-lg"> Build Your Own Box</div>

                                </div>
                            </div>
                            <div class="text-gray-800">
                                <Icon name="chevron-right" class="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                </template>
            </PopUp>

            <!-- Slide Modals for Single, Multiple, and Variable Products -->
            <SlideModal :open="singleModalOpen" staticBackDrop @close="toggleSingleProductModal" title="Single Product"
                description="Please provide the following information about your product"
                :buttons="[{ alt: true, text: 'Back', handler: toggleProductModal }]" slideFrom="rightLg">
                <template #switchable>
                    <div class="flex gap-4">
                        <div class="p-2 outline outline-1 outline-gray-200 rounded-lg flex gap-2 items-center text-sm cursor-pointer"
                            @click="toggleSingleProductForm">
                            <div class="p-1 h-8 w-8 outline outline-1 rounded-full">
                                <div :class="'bg-primary' + (singleProductForm ? ' h-6 w-6 rounded-full' : '')"></div>
                            </div>
                            Single Product
                        </div>
                        <div class="p-2 outline outline-1 outline-gray-200 rounded-lg flex gap-2 items-center text-sm cursor-pointer"
                            @click="toggleSingleServiceForm">
                            <div class="p-1 h-8 w-8 outline outline-1 rounded-full">
                                <div :class="'bg-primary' + (!singleProductForm ? ' h-6 w-6 rounded-full' : '')"></div>
                            </div>
                            Single Service
                        </div>
                    </div>
                </template>
                <template #content>
                    <template v-if="singleProductForm">
                        <AddSingleProduct @close="toggleSingleProductModal" :categories="categories.data"
                            @submit="refreshProducts" :productUnits="unitOptions.data" />
                    </template>
                    <template v-else>
                        <AddSingleService @close="toggleSingleProductModal" :categories="categories.data"
                            @submit="refreshServices" />
                    </template>
                </template>
            </SlideModal>

            <SlideModal :open="multiModalOpen" staticBackDrop @close="toggleMultiProductModal"
                title="Add Multiple Products" :buttons="[{ alt: true, text: 'Back', handler: toggleProductModal }]"
                slideFrom="rightLg">
                <template #content>
                    <AddMultipleProducts />
                </template>
            </SlideModal>

            <SlideModal :open="variableModalOpen" staticBackDrop @close="toggleVariableProductModal"
                title="Add Variable Product" :buttons="[{ alt: true, text: 'Back', handler: toggleProductModal }]"
                slideFrom="rightLg">
                <template #content>
                    <AddVariableProduct @close="toggleVariableProductModal" :categories="categories.data"
                        @submit="refreshProducts" :productUnits="unitOptions.data" :variants="variantOptions.data" />
                </template>
            </SlideModal>
            <SlideModal :open="bundledModalOpen" staticBackDrop @close="toggleBundledProductModal"
                title="Add 'Ready To Gift' Box" :buttons="[{ alt: true, text: 'Back', handler: toggleProductModal }]"
                slideFrom="rightLg">
                <template #content>
                    <AddBundledProduct @close="toggleBundledProductModal" :categories="categories.data"
                        @submit="refreshProducts" :productUnits="unitOptions.data" :variants="variantOptions.data" />
                </template>
            </SlideModal>
            <SlideModal :open="boxModalOpen" staticBackDrop @close="toggleBoxProductModal" title="Create Box Template"
                :buttons="[{ alt: true, text: 'Back', handler: toggleBoxProductModal }]" slideFrom="rightLg">
                <template #content>
                    <AddBoxProduct @close="toggleBoxProductModal" :categories="categories.data"
                        @submit="refreshProducts" :productUnits="unitOptions.data" :variants="variantOptions.data" />
                </template>
            </SlideModal>

            <SlideModal :open="addProductModal" staticBackDrop @close="toggleAddProductModal" title="Product 1"
                :buttons="[{ alt: true, text: 'Back', handler: toggleAddProductModal }]" slideFrom="rightLg">
                <template #content>
                    <AddProduct @close="toggleAddProductModal" />
                </template>
            </SlideModal>
        </div>
    </div>

</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ResponsiveTable, { TableRow } from '~~/components/table/responsive-table.vue';
import { Product } from '~~/composables/resources/product';
import { ProductUnit } from '~/composables/resources/business';
import Icon from '~~/components/ui/icon.vue';
import PopUp from '~~/components/ui/pop-up.vue';
import SlideModal from '~~/components/ui/slide-modal.vue';
import VInput from '~~/components/input/v-input.vue';
import AddMultipleProducts from '~~/components/resources/products/add-multiple-products.vue';
import AddSingleProduct from '~~/components/resources/products/add-single-product.vue';
import ProductsTable from '~~/components/resources/products/products-table.vue';
import BundledProductsTable from '~~/components/resources/products/bundled-products-table.vue';
import BoxProductsTable from '~~/components/resources/products/box-products-table.vue';
import ServicesTable from '~~/components/resources/products/services-table.vue';
import AddProduct from '~~/components/resources/products/add-product.vue';
import AddSingleService from '~~/components/resources/products/add-single-service.vue';
import AddVariableProduct from '~~/components/resources/products/add-variable-product.vue';
import AddBundledProduct from '~~/components/resources/products/add-bundled-product.vue';
import AddBoxProduct from '~~/components/resources/products/add-box-product.vue';
import ToggleSelections from '~~/components/ui/toggle-selections.vue';
import { exportCategoriesToXLSX } from '~~/composables/ui';

const router = useRouter();
const route = useRoute();

const search = ref('');
const viewMode = ref(route.query.viewMode || 'Single Products'); // Default to 'Products' view, read from query params if available
const selected = ref<number[]>([]);
const reload = ref(true);
const singleProductForm = ref(true);
const modalOpen = ref(false);
const multiModalOpen = ref(false);
const singleModalOpen = ref(false);
const variableModalOpen = ref(false);
const bundledModalOpen = ref(false)
const boxModalOpen = ref(false);
const addProductModal = ref(false);
const originalProducts = ref();
const componentKey = ref(0);
const tabs = ref(['Single Products', 'Services', 'Gift Boxes', 'Custom Boxes']); // Define your tabs
const products = ref({
    data: []
});
const services = ref({
    data: []
});
const originalCategories = ref();
const categories = ref({
    data: []
});
const unitOptions = ref({ data: [{ id: 0, name: "test", createdAt: "", updatedAt: "", status: "active" }] });
const variantOptions = ref({ data: [{ id: 0, name: null, createdAt: "", updatedAt: "", value: null, type: null }] });

const meta = ref();

const fetchVariants = async () => {
    try {
        const response = await apiFetch('/variants', {
            method: 'GET',
        });

        variantOptions.value = { data: response };
        console.log("variants", variantOptions.value);
    } catch (e) {
        console.log(e);
    }
}

const fetchCategories = async () => {
    try {
        const response = await apiFetch('/categories', {
            method: 'GET',
        });
        const data = await response;

        // Filter categories where status is true
        const filteredCategories = data.data.filter(category => category.status === "active");

        categories.value = { data: filteredCategories };
        originalCategories.value = { data: filteredCategories };
        meta.value = data.meta;

        console.log("cat", categories.value);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};

// const fetchServices = async () => {
//     try {
//         const response = await apiFetch('/services', {
//             method: 'GET',
//         });
//         const data = await response;
//         services.value = { data: data.data };
//         console.log('Services', services.value);
//     } catch (error) {
//         console.error('Error fetching services:', error);
//     }
// };

const toggleAddProductModal = () => {
    addProductModal.value = !addProductModal.value;
}

const toggleProductModal = () => {
    modalOpen.value = !modalOpen.value;
};

const toggleSingleProductForm = () => {
    singleProductForm.value = true;
}
const toggleSingleServiceForm = () => {
    singleProductForm.value = false;
}

const toggleSingleProductModal = () => {
    singleModalOpen.value = !singleModalOpen.value;
    toggleProductModal();
};

const toggleMultiProductModal = () => {
    multiModalOpen.value = !multiModalOpen.value;
    toggleProductModal();
};

const toggleVariableProductModal = () => {
    variableModalOpen.value = !variableModalOpen.value;
    toggleProductModal();
};
const toggleBundledProductModal = () => {
    bundledModalOpen.value = !bundledModalOpen.value;
    toggleProductModal();
};

const toggleBoxProductModal = () => {
    boxModalOpen.value = !boxModalOpen.value;
    toggleProductModal()
}



const toggleViewMode = (view) => {
    viewMode.value = view;
};

const refreshProducts = () => {

    toggleProductModal();

    setInterval(() => {
        window.location.reload();
    }, 2000)

}

const refreshServices = () => {
    toggleProductModal();

    setInterval(() => {
        window.location.reload();
    }, 2000)
};

// const fetchProducts = async () => {
//     try {
//         const response = await apiFetch('/products', {
//             method: 'GET',
//         });
//         const data = await response;
//         products.value = { data: data.data };
//         originalProducts.value = { data: data.data };
//         console.log(products.value);
//     } catch (error) {
//         console.error('Error fetching products:', error);
//     }
// };

const fetchUnits = async () => {
    try {
        const response = await apiFetch('/productunits', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = response;

        const filteredUnits = data.filter(unit => unit.status === "active");
        // Assign the parsed data to unitOptions
        unitOptions.value = { data: filteredUnits };
        console.log("unit", unitOptions.value);
    } catch (error) {
        console.error('Error fetching unit options:', error);
    }
};

// Watch for changes in viewMode and update the URL query parameters accordingly
watch(viewMode, (newMode) => {
    router.push({ path: '/inventory/products', query: {} });
});
watch(componentKey, () => {
    document.body.style.overflowY = 'auto';
});
onMounted(fetchVariants);
onMounted(fetchUnits);
onMounted(fetchCategories);
// onMounted(fetchServices);
</script>
