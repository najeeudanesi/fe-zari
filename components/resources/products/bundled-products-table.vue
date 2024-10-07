<template>
    <div>
        <label
            class="flex lg:max-w-1/2 max-w-full items-center rounded-xl bg-white py-3 pl-2 text-sm text-gray-500 shadow-sm w-full md:w-1/3 top-[-220px] xl:top-[-200px] relative">
            <Icon name="search" class="h-7" />
            <input type="text" class="w-full px-4 placeholder:text-gray-300 focus:outline-none"
                placeholder="Search keyword, name, category" v-model="search" @input="doSearch()" />
        </label>

        <div class="w-full flex justify-end mb-4">
            <button class="bg-none outline font outline-1 outline-primary text-primary rounded-md px-4 py-2 flex"
                @click="exportCategoriesToXLSX(products?.data, 'Ready To Gift Products')">
                <p>Export</p>
                <Icon :name="'export'" />
            </button>
        </div>


        <!-- <div class="cursor-pointer flex gap-2 items-center absolute top-[180px] left-[300px] sm:top-[210px] sm:left-[400px]  md:left-[420px] lg:left-[500px]  md:top-[200px]"
            @click="toggleFilter">
            <Icon :name="'filter'" />
        </div> -->

        <div v-if="showFilter"
            class="flex gap-3 lg:max-w-1/2 max-w-2/3 items-center rounded-xl p-2 h-16 bg-white shadow-lg w-2/3 lg:w-1/3 top-[220px] sm:top-[240px] xl:top-[250px] absolute">
            <input type="text"
                class="w-full p-2  placeholder:text-gray-300 border border-gray-200  rounded-lg focus:outline-none"
                placeholder="Product name" v-model="search" @input="doSearch()" />

            <input type="text"
                class="w-full p-2  placeholder:text-gray-300 border border-gray-200  rounded-lg focus:outline-none"
                placeholder="Category" v-model="search" @input="doSearch()" />


        </div>


        <ResponsiveTable v-bind="{ data: products, skeleton: { rows: 3, columns: 7 } }" @paginate="paginate">
            <template #header>
                <th>
                    <ToggleSelections v-model="selected"
                        v-bind="{ data: products?.data, mapFn: (v: BundledProduct) => v.id, }" />
                </th>

                <th class="px-4 text-left">Image</th>
                <th class="px-4 text-left">Name</th>
                <th class="px-4 text-left">Price</th>
                <th class="px-4 text-left">items</th>
                <th class="px-4 text-left">Actions</th>
            </template>
            <template #mobileHeader="{ row: product }: TableRow<BundledProduct>">
                <div class="flex items-center gap-6">
                    <div class="flex items-center text-sm text-gray-600">
                        <CheckBox v-bind="{ selected, value: product.id }">
                            <input v-model="selected" type="checkbox" :value="product.id" hidden />
                        </CheckBox>
                    </div>
                    <div>
                        {{ product.name }}
                    </div>
                </div>
            </template>
            <template #default="{ row: product }: TableRow<BundledProduct>">
                <TableCell2 class="justify-center">
                    <CheckBox v-bind="{ selected, value: product.id }">
                        <input v-model="selected" type="checkbox" :value="product.id" hidden />

                    </CheckBox>

                </TableCell2>
                <TableCell2 class="flex items-center max-w-64" header="Image">
                    <div class="w-16 h-16 object-contain"><img
                            :src="product?.productImages[0] ? (baseUrl + product?.productImages[0]?.url) : PLACEHOLDER_IMAGE"
                            alt="" class="rounded-lg h-16 w-16"></div>
                </TableCell2>
                <TableCell2 class="flex items-center " header="Name">
                    <div class="w-32">{{
                        product.name
                        }}</div>
                </TableCell2>

                <TableCell2 class="flex items-center" header="Price">
                    <div class="w-24">N{{
                        formatNumberWithCommas(product.price)
                        }}</div>
                </TableCell2>
                <TableCell2 class="flex items-center" header="items">
                    <div class="w-24">{{
                        product?.items?.length
                        }}</div>
                </TableCell2>

                <TableCell2 class="" header="Actions">
                    <div class="relative flex items-center gap-2 w-32">

                        <button @click="showActionsMenu(product)" class="Btn__icon">
                            <Icon name="action" class="h-5 w-5" />
                        </button>

                        <div v-if="product?.id === activeProductMenu"
                            class="absolute left-14 lg:left-[10px] top-8 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                            <button @click="setProduct(product)"
                                class="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 w-full text-left">
                                Edit
                            </button>
                            <button @click="setViewProduct(product)"
                                class="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 w-full text-left">
                                View Gift
                            </button>
                        </div>
                    </div>
                </TableCell2>
            </template>
        </ResponsiveTable>
        <SlideModal :open="modalOpen" staticBackDrop @close="toggleProductModal" title="Edit Product"
            :buttons="[{ alt: true, text: 'cancel', handler: toggleProductModal }]" slideFrom="rightLg">
            <template #content>
                <AddBundledProduct @close="toggleProductModal" @submit="refresh" :categories="categories.data"
                    :product="product" :productUnits="unitOptions.data" :variantOptions="variantOptions.data"
                    :is-update="true" />
            </template>
        </SlideModal>

        <SlideModal :open="viewModal" staticBackDrop @close="toggleViewModal" :title="product.name"
            :buttons="[{ alt: true, text: 'Back', handler: toggleViewModal }]" slideFrom="rightLg">
            <template #content>
                <ViewGiftBundledProduct @close="toggleViewModal" @submit="refresh" :categories="categories.data"
                    :product="product" :productUnits="unitOptions.data" />
            </template>
        </SlideModal>

        <!-- delete modal -->
        <PopUp :open="confirmDeleteModal" staticBackDrop title="Are You Sure?" @close="closeConfirmDeleteModal"
            description="Confirm action to delete product" :buttons="[
                { alt: true, text: 'No', handler: closeConfirmDeleteModal },
                { text: 'Yes', handler: deleteProduct }
            ]">
        </PopUp>
    </div>
</template>
<script setup lang="ts">
import ResponsiveTable, {
    TableRow
} from '~~/components/table/responsive-table.vue'
import { BundledProduct, Product } from '~~/composables/resources/product'
import { ProductForm, ProductUnit } from '~/composables/resources/business'
import TableCell2 from '~~/components/table/table-cell-2.vue'
import Icon from '~~/components/ui/icon.vue'
import PopUp from '~~/components/ui/pop-up.vue'
import SlideModal from '~~/components/ui/slide-modal.vue'
import CheckBox from '~~/components/input/check-box.vue'
import AddMultipleProducts from '~~/components/resources/products/add-multiple-products.vue'
import AddSingleProduct from '~~/components/resources/products/add-single-product.vue'
import AddProduct from '~~/components/resources/products/add-product.vue'
import AddSingleService from '~~/components/resources/products/add-single-service.vue'
import ToggleSelections from '~~/components/ui/toggle-selections.vue'
import { exportCategoriesToXLSX } from '~~/composables/ui'
import { ApiList } from '~~/composables/fetch'
import AddBundledProduct from './add-bundled-product.vue'
import ViewGiftBundledProduct from './view-gift-bundled-product.vue'

const props = defineProps<{
    search?: string
    reload?: boolean
}>()
const route = useRoute()
const router = useRouter()
const search = ref('')
const selected = ref<number[]>([])
const modalOpen = ref(false)
const viewModal = ref(false)
const confirmDeleteModal = ref(false)
const activeProductMenu = ref<number | null>(null)
const addProductModal = ref(false)
const reload = toRef(props, 'reload');
const showFilter = ref(false)
const config = useRuntimeConfig()
const baseUrl = config.public.apiBaseUrl
const originalCategories = ref()
const categories = ref({
    data: []
})
const originalProducts = ref()
const {
    data: products,
    refresh,
    pending
} = useApiFetch<ApiList<any>>('bundled-products', () => ({
    params: {

        search: search.value,
        page: route.query.page ?? 1,
        perPage: route.query.perPage ?? 20
    },
    group: 'bundled-products'
}))

const product = ref<any>({ ...defaultProduct })
const { addToast } = useToast()
const unitOptions = ref({
    data: [
        { id: 0, name: 'test', createdAt: '', updatedAt: '', status: 'active' }
    ]
})
const variantOptions = ref({
    data: [
        { id: 0, name: null, createdAt: '', updatedAt: '', value: null, type: null }
    ]
})

const meta = ref()


const stageProduct = (data: any) => {
    product.value = {
        id: data?.id ?? null,
        name: data?.name ?? '',
        description: data?.description,
        quantity: data?.quantity ?? null,
        unit: {
            id: data?.unit?.id ?? null,
            name: data?.unit?.name ?? 'Select Unit',
            code: data?.unit?.code ?? 'null'
        },
        hasVariant: data?.hasVariant ?? 0, // Assuming 0 means no variant
        variant: {
            id: data?.variant?.id ?? null,
            name: data?.variant?.name ?? '',
            type: data?.variant?.type ?? '',
            value: data?.variant?.value ?? '',
            createdAt: data?.variant?.createdAt ?? '',
            updatedAt: data?.variant?.updatedAt ?? ''
        },
        variantName: data?.variant?.name ?? '',
        variantType: data?.variant?.type ?? '',
        category: {
            id: data?.category?.id ?? null,
            name: data?.category?.name ?? 'Select Category',
            code: data?.category?.code ?? 'null'
        },
        costPrice: data?.costPrice ?? null,
        stock: data?.stocks?.[0]?.quantity ?? null, // Assuming stocks is an array and taking the quantity from index 0
        sellingPrice: data?.sellingPrice ?? null,
        discount: data?.discount ?? null,
        expDate: data?.stocks?.[0]?.expiryDate ?? '', // Assuming stocks is an array and taking expiryDate from index 0
        profit: data?.profit ?? null,
        discountedPrice: data?.discountedPrice ?? null,
        discountType: data?.discountType ?? 'percentage',
        items: data?.items,
        productImages: data?.productImages ?? [],
    }
}

const setStockProduct = (data: any) => {
    stageProduct(data)
    toggleAddProductModal()
}

const setProduct = (data: any) => {
    stageProduct(data);
    toggleProductModal()
}

const setViewProduct = (data: any) => {
    stageProduct(data);
    toggleViewModal()

}
const fetchVariants = async () => {
    try {
        const response = await apiFetch('/variants', {
            method: 'GET'
        })

        variantOptions.value = { data: response }
        console.log('variants', variantOptions.value)
    } catch (e) {
        console.log(e)
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
const toggleAddProductModal = () => {
    addProductModal.value = !addProductModal.value
}
const toggleProductModal = () => {
    modalOpen.value = !modalOpen.value
}
const toggleViewModal = () => {
    viewModal.value = !viewModal.value
}

const confirmDelete = (id: number) => {
    confirmDeleteModal.value = true
    console.log(id)
    product.value.id = id
}
const closeConfirmDeleteModal = () => {
    confirmDeleteModal.value = false
}
const showActionsMenu = (product: BundledProduct) => {
    if (activeProductMenu.value === product.id) {
        activeProductMenu.value = null
    } else {
        activeProductMenu.value = product.id
    }
}

const fetchUnits = async () => {
    try {
        const response = await apiFetch('/productunits', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = response

        // Assign the parsed data to unitOptions
        unitOptions.value = { data: data }
        console.log('unit', unitOptions.value)
    } catch (error) {
        console.error('Error fetching unit options:', error)
    }
}

onMounted(fetchVariants)
onMounted(fetchUnits)
onMounted(fetchCategories)


// Function to delete a product
const deleteProduct = async () => {
    try {
        const response = await apiFetch(`/products/${product.value.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        addToast({ message: 'Product deleted successfully', type: 'success' })

        closeConfirmDeleteModal()
    } catch (error) {
        console.error('Error deleting product:', error)
        addToast({ message: 'Failed to delete product', type: 'error' })
    }
}





//handle filter 

const doSearch = useDebounce(() => {
    refresh()
}, 200)

const paginate = usePaginate(refresh)

const toggleFilter = () => {
    showFilter.value = !showFilter.value
}
watch(() => reload, () => {

    refresh()

});
</script>
