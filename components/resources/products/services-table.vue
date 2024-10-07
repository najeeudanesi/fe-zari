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
                @click="exportCategoriesToXLSX(services?.data, 'Services')">
                <p>Export</p>
                <Icon :name="'export'" />
            </button>
        </div>


        <!-- <div class="cursor-pointer flex gap-2 items-center absolute top-[180px] left-[300px] sm:top-[210px] sm:left-[400px]  md:left-[420px] lg:left-[500px]  md:top-[200px] rounded-full"
            @click="toggleFilter">
            <Icon :name="'filter'" />
        </div> -->

        <div v-if="showFilter"
            class="flex gap-3 lg:max-w-1/2 max-w-2/3 items-center rounded-xl p-2 h-16 bg-white shadow-lg w-2/3 lg:w-1/3 top-[220px] sm:top-[240px] xl:top-[250px] absolute">
            <input type="text"
                class="w-full p-2  placeholder:text-gray-300 border border-gray-200  rounded-lg focus:outline-none"
                placeholder="Service name" v-model="search" @input="doSearch()" />

            <input type="text"
                class="w-full p-2  placeholder:text-gray-300 border border-gray-200  rounded-lg focus:outline-none"
                placeholder="Category" v-model="search" @input="doSearch()" />



        </div>

        <ResponsiveTable v-bind="{ data: services, skeleton: { rows: 3, columns: 6 } }" @paginate="paginate">
            <template #header>
                <th>
                    <ToggleSelections v-model="selected"
                        v-bind="{ data: services?.data, mapFn: (v: Service) => v.id }" />
                </th>
                <th class="px-4 text-left">Name</th>
                <th class="px-4 text-left">Cost Price</th>
                <th class="px-4 text-left">Price</th>
                <th class="px-4 text-left">Category</th>
                <th class="px-4 text-left">Actions</th>
            </template>
            <template #mobileHeader="{ row: service }: TableRow<ServiceForm>">
                <div class="flex items-center gap-6">
                    <div class="flex items-center text-sm text-gray-600">
                        <CheckBox v-bind="{ selected, value: service.id }">
                            <input v-model="selected" type="checkbox" :value="service.id" hidden />
                        </CheckBox>
                    </div>
                    <div>
                        {{ service?.name }}
                    </div>
                </div>

            </template>
            <template #default="{ row: service }: TableRow<ServiceForm>">
                <TableCell2 class="justify-center">
                    <CheckBox v-bind="{ selected, value: service.id }">
                        <input v-model="selected" type="checkbox" :value="service.id" hidden />
                    </CheckBox>


                </TableCell2>
                <TableCell2 class="flex items-center" header="Name">{{ service?.name }}</TableCell2>
                <TableCell2 class="flex items-center" header="Price">N{{ formatNumberWithCommas(service.sellingPrice) }}
                </TableCell2>
                <TableCell2 class="flex items-center" header="Cost Price">N{{ formatNumberWithCommas(service.costPrice)
                    }}
                </TableCell2>
                <TableCell2 class="flex items-center" header="Category">{{ service.category?.name }}</TableCell2>


                <TableCell2 class="" header="Actions">
                    <div class="relative flex items-center gap-2">
                        <!-- <button class="bg-primary text-white rounded-md p-1" @click="toggleServiceModal">Add
                            Stock</button> -->
                        <!-- <button class="Btn__icon" @click="setService(service)">
                            <Icon name="pencil" class="h-5 w-5" />
                        </button> -->
                        <button @click="showActionsMenu(service)" class="Btn__icon">
                            <Icon name="action" class="h-5 w-5" />
                        </button>

                        <div v-if="service.id === activeServiceMenu"
                            class="absolute left-14 lg:left-[10px]  top-8 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">

                            <button @click="setService(service)"
                                class="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 w-full text-left">Edit</button>
                            <button @click="setViewService(service)"
                                class="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 w-full text-left">View
                                Service</button>
                        </div>
                    </div>
                </TableCell2>
                <!-- update modal -->



            </template>
        </ResponsiveTable>


        <SlideModal :open="modalOpen" staticBackDrop @close="toggleModal" title="Edit Service" @submit="refresh"
            :buttons="[{ alt: true, text: 'cancel', handler: toggleModal }]" slideFrom="rightLg">
            <template #content>

                <AddSingleService @close="toggleModal" :categories="categories.data" :data="service" :isUpdate="true" />
            </template>

        </SlideModal>
        <SlideModal :open="viewModal" staticBackDrop @close="toggleViewModal" :title="service.name" @submit="refresh"
            :buttons="[{ alt: true, text: 'cancel', handler: toggleViewModal }]" slideFrom="rightLg">
            <template #content>

                <ViewService @close="toggleViewModal" :categories="categories.data" :data="service" :isUpdate="true" />
            </template>

        </SlideModal>
        <!-- delete modal -->
        <PopUp :open="confirmDeleteModal" staticBackDrop title="Are You Sure?" @close="closeConfirmDeleteModal"
            description="Confirm action to delete service"
            :buttons="[{ alt: true, text: 'No', handler: closeConfirmDeleteModal }, { text: 'Yes', handler: deleteService }]">
        </PopUp>
    </div>
</template>

<script setup lang="ts">
import ResponsiveTable, { TableRow } from '~~/components/table/responsive-table.vue'
import SlideModal from '~~/components/ui/slide-modal.vue'
import { Service } from '~~/composables/resources/service'
import CheckBox from '~~/components/input/check-box.vue'
import TableCell2 from '~~/components/table/table-cell-2.vue'
import Icon from '~~/components/ui/icon.vue'
import ToggleSelections from '~~/components/ui/toggle-selections.vue'
import PopUp from '~~/components/ui/pop-up.vue'
import AddSingleService from '~~/components/resources/products/add-single-service.vue'
import { ServiceForm } from '~~/composables/resources/business'
import { ApiList } from '~~/composables/fetch'
import ViewService from './view-service.vue'


const props = defineProps<{
    search: string
    reload?: boolean
}>();

const reload = toRef(props, 'reload');
const { addToast } = useToast()
const route = useRoute()
const router = useRouter()
const search = ref('');
const selected = ref<number[]>([])
const addServiceModal = ref(false);
const viewModal = ref(false);
const confirmDeleteModal = ref(false);
const showFilter = ref(false)
const modalOpen = ref(false);
const activeServiceMenu = ref<number | null>(null);
const {
    data: services,
    refresh,
    pending
} = useApiFetch<ApiList<Service>>('services', () => ({
    params: {

        search: search.value,
        page: route.query.page ?? 1,
        perPage: route.query.perPage ?? 20
    },
    group: 'services'
}))

const originalCategories = ref();
const categories = ref({
    data: []
});

const service = ref<ServiceForm>(
    { ...defaultService }

);


const setService = (data: ServiceForm) => {
    service.value = data
    toggleModal()
}
const setViewService = (data: ServiceForm) => {
    service.value = data
    toggleViewModal()
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


        console.log("cat", categories.value);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};

onMounted(fetchCategories);
const toggleAddServiceModal = () => {
    addServiceModal.value = !addServiceModal.value;
};

const confirmDelete = (id: number) => {
    confirmDeleteModal.value = true
    console.log(id)
    service.value.id = id
}
const closeConfirmDeleteModal = () => {
    confirmDeleteModal.value = false
}

const toggleModal = () => {
    modalOpen.value = !modalOpen.value
}

const toggleViewModal = () => {
    viewModal.value = !viewModal.value
}
const showActionsMenu = (service: ServiceForm) => {
    if (activeServiceMenu.value === service.id) {
        activeServiceMenu.value = null;
    } else {
        activeServiceMenu.value = service.id;
    }
};


// Function to edit a service


// Function to delete a service
const deleteService = async () => {
    try {
        const response = await apiFetch(`/services/${service.value.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        addToast({ message: 'Service deleted successfully', type: 'success' });
        refresh();
        closeConfirmDeleteModal();
    } catch (error) {
        console.error('Error deleting service:', error);
        addToast({ message: 'Failed to delete service', type: 'error' });
    }
}

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