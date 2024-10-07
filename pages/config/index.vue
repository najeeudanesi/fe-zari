<template>
    <div>
        <label
            class="flex lg:max-w-1/2 max-w-full  items-center rounded-xl bg-white py-3 pl-2 text-sm text-gray-500 shadow-sm w-full md:w-1/3 top-[-25px] xl:top-[-60px] relative">
            <Icon name="search" class="h-7" />
            <input type="text" class="w-full px-4 placeholder:text-gray-300 focus:outline-none"
                placeholder="Search keyword, name, message" v-model="search" @input="doSearch()" />
        </label>

        <div class="flex gap-16 mb-5">

            <button class="bg-none outline font outline-1 outline-primary text-primary rounded-md px-4 py-2 flex"
                @click="exportCategoriesToXLSX(categories?.data, 'Categories')">
                <p>Export</p>
                <Icon :name="'export'"></Icon>
            </button>


            <button class="Btn bg-primary" @click="toggleCategoryModal">Add New +</button>
        </div>

        <!-- <div class="overflow-x-auto bg-white p-8 rounded-md mt-6"> -->
        <ResponsiveTable v-bind="{ data: categories }" @paginate="paginate">
            <template #header>
                <th>
                    <ToggleSelections v-model="selected" v-bind="{ data: categories, mapFn: (v: Category) => v.id, }" />
                </th>
                <th class="px-4 text-left">Name</th>
                <th class="px-4 text-left">Created On</th>

                <th class="px-4 text-left">Status</th>
                <th class="px-4 text-left">Actions</th>
            </template>
            <template #mobileHeader="{ row: category }: TableRow<Category>">
                <div class="flex items-center gap-6">
                    <div class="flex items-center text-sm text-gray-600">
                        <CheckBox v-bind="{ selected, value: category.id }">
                            <input v-model="selected" type="checkbox" :value="category.id" hidden />
                        </CheckBox>
                    </div>
                    <div>
                        {{ category.name }}
                    </div>
                </div>
            </template>
            <template #default="{ row: category }: TableRow<Category>">
                <TableCell class="justify-center">
                    <CheckBox v-bind="{ selected, value: category.id }">
                        <input v-model="selected" type="checkbox" :value="category.id" hidden />
                    </CheckBox>
                </TableCell>
                <TableCell class="flex items-center" header="Name">{{ category.name }}</TableCell>
                <TableCell class="flex items-center" header="Created">{{ formatDate(category.createdAt, 'dt') }}
                </TableCell>
                <!-- <TableCell class="flex items-center" header="Updated">{{ formatDate(category.updatedAt, 'dt') }}
                </TableCell> -->
                <TableCell class="flex items-center gap-8" header="Status">
                    <div :class="category.status === 'active' ? 'active_chip' : 'inactive_chip'">
                        {{ category.status }}
                    </div>
                    <ToggleSwitch :checked="category.status === 'active'" @change="toggleStatus(category)" />
                </TableCell>
                <TableCell class="flex items-end" header="Actions">
                    <div class="relative">
                        <button @click="showActionsMenu(category)" class="Btn__icon">
                            <Icon name="action" class="h-5 w-5" />
                        </button>
                        <div v-if="category.id === activeCategoryMenu"
                            class="absolute left-14 lg:left-[-80px]  mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                            <button @click="setEditCategory(category)"
                                class="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 w-full text-left">Edit</button>
                            <!-- <button @click="confirmDelete(category.id)"
                                class="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 w-full text-left">Delete</button> -->
                        </div>
                    </div>
                </TableCell>



            </template>
        </ResponsiveTable>
        <!-- </div> -->

    </div>
    <!-- add modal -->
    <PopUp :open="modalOpen" staticBackDrop title="Add Category" @close="toggleCategoryModal" description=""
        :buttons="[{ alt: true, text: 'Cancel', handler: toggleCategoryModal }, { text: 'Save', handler: createCategory }]">
        <template #content>

            <VInput id="category" label="Category Name" tooltip="Category Name" v-model="category.name" required
                type="text" placeholder="Category Name" />

        </template>
    </PopUp>
    <!-- update modal -->
    <PopUp :open="updateModal" staticBackDrop title="Add Category" @close="toggleUpdateModal" description=""
        :buttons="[{ alt: true, text: 'Cancel', handler: toggleUpdateModal }, { text: 'Save', handler: editCategory }]">
        <template #content>

            <VInput id="category" label="Category Name" tooltip="Category Name" v-model="category.name" required
                type="text" placeholder="Category Name" />

        </template>
    </PopUp>

    <!-- delete modal -->
    <PopUp :open="confirmDeleteModal" staticBackDrop title="Are You Sure?" @close="toggleCategoryModal"
        description="Confirm action to delete category"
        :buttons="[{ alt: true, text: 'Cancel', handler: closeConfirmDeleteModal }, { text: 'Confirm', handler: deleteCategory }]">
    </PopUp>
</template>

<script setup lang="ts">

import { ref, onMounted, createApp } from 'vue';
import ResponsiveTable, { TableRow } from '~~/components/table/responsive-table.vue';
import TableCell from '~~/components/table/table-cell.vue';
import Icon from '~~/components/ui/icon.vue';
import VInput from '~~/components/input/v-input.vue';
import ToggleSwitch from '~~/components/ui/toggle-switch.vue';
import PopUp from '~~/components/ui/pop-up.vue';
import { Category } from '~~/composables/resources/category';
import { ApiList, apiFetch } from '~~/composables/fetch';
import { exportCategoriesToXLSX } from '~~/composables/ui';
// import Pagination from './pagination.vue';



// Define your refs
const originalCategories = ref();
const search = ref('');
const selected = ref<number[]>([]);
const activeCategoryMenu = ref<number | null>(null);
const modalOpen = ref(false);
const confirmDeleteModal = ref(false);
const updateModal = ref(false);
const meta = ref({ page: 1, perPage: 10 });
const category = ref<Category>({
    id: 0,
    name: '',
    createdAt: '',
    updatedAt: '',
    status: '',
});
const { addToast } = useToast()
const route = useRoute()
const router = useRouter()
const {
    data: categories,
    refresh,
    pending
} = useApiFetch<ApiList<Category>>('categories', () => ({
    params: {

        search: search.value,
        page: route.query.page ?? 1,
        perPage: route.query.perPage ?? 10
    },
    group: 'categories'
}))


const createCategory = async () => {
    if (category.value.name === "") {
        addToast({ message: 'Category name is required', type: 'error' });
        return
    }
    const payload = {
        name: category.value.name
    }
    try {
        const response = await apiFetch('/categories', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(response);
        refresh();
        addToast({ message: 'Category created successfully', type: 'success' });

        toggleCategoryModal();
        category.value.name = '';
    } catch (error) {
        console.error('Error creating category:', error.data);
        addToast({ message: error.data.message || 'Failed to create category', type: 'error' });
    }
};

// Call the fetchCategories function when the component is mounted
// onMounted(fetchCategories);



// Function to toggle category modal
const toggleCategoryModal = () => {
    modalOpen.value = !modalOpen.value;
};

const toggleUpdateModal = () => {
    updateModal.value = !updateModal.value;
};

const confirmDelete = (id: number) => {
    confirmDeleteModal.value = true
    console.log(id)
    category.value.id = id
}
const closeConfirmDeleteModal = () => {
    confirmDeleteModal.value = false
}

// Function to show actions menu
const showActionsMenu = (category: Category) => {
    if (activeCategoryMenu.value === category.id) {
        activeCategoryMenu.value = null;
    } else {
        activeCategoryMenu.value = category.id;
    }
};

const setEditCategory = (data: Category) => {
    console.log('Editing category:', data);

    // Create a new object and copy properties from data
    const editedCategory: Category = { ...data };

    // Assign the new object to category.value
    category.value = editedCategory;

    activeCategoryMenu.value = null;
    toggleUpdateModal();
};

const editCategory = async () => {
    if (category.value.name === "") {
        addToast({ message: 'Category name is required', type: 'error' });
        return
    }
    const payload = {
        name: category.value.name,
        status: category.value.status
    }

    try {
        const response = await apiFetch(`/categories/${category.value.id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }

        })
        console.log(response);
        refresh()
        activeCategoryMenu.value = null;
        toggleUpdateModal();

        // await fetchCategories();
        addToast({ message: 'Category updated successfully', type: 'success' });
    } catch (error) {
        console.error('Error editing category:', error.data)
        addToast({ message: error.data.error || 'Failed to update category', type: 'error' });
    }
}
// Function to delete a category
const deleteCategory = async () => {
    try {
        const response = await apiFetch(`/categories/${category.value.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        refresh()
        addToast({ message: 'Category deleted successfully', type: 'success' });
        // fetchCategories();
        closeConfirmDeleteModal();
    }
    catch (error) {
        console.error('Error deleting category:', error);
        addToast({ message: 'Failed to delete category', type: 'error' });
    }
};


const toggleStatus = async (category: Category) => {
    const newStatus = category.status === 'active' ? 'inactive' : 'active';
    const payload = { status: newStatus };

    try {
        await apiFetch(`/categories/${category.id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Update the status locally
        category.status = newStatus;
        addToast({ message: `Category status toggled to ${newStatus}`, type: 'success' });
    } catch (error) {
        console.error('Error toggling category status:', error);
        addToast({ message: 'Failed to toggle category status', type: 'error' });
    }
};

const doSearch = useDebounce(() => {
    refresh()
}, 200)

const paginate = usePaginate(refresh)

</script>
