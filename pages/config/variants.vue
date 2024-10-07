<template>
    <div>
        <label
            class="flex lg:max-w-1/2 max-w-full items-center rounded-xl bg-white py-3 pl-2 text-sm text-gray-500 shadow-sm w-full md:w-1/3 top-[-25px] xl:top-[-60px] relative">
            <Icon name="search" class="h-7" />
            <input type="text" class="w-full px-4 placeholder:text-gray-300 focus:outline-none"
                placeholder="Search keyword, name, message" v-model="search" />
        </label>

        <div class="flex gap-16 mb-5">
            <button class="bg-none outline font outline-1 outline-primary text-primary rounded-md px-4 py-2 flex"
                @click="exportCategoriesToXLSX(variants?.data, 'variants')">
                <p>Export</p>
                <Icon :name="'export'"></Icon>
            </button>
            <button class="Btn bg-primary" @click="toggleVariantModal">Add New +</button>
        </div>

        <ResponsiveTable v-bind="{ data: { data: filteredVariants } }">
            <template #header>
                <th>
                    <ToggleSelections v-model="selected" :data="variants" :mapFn="(v) => v.id" />
                </th>
                <th class="px-4 text-left">Name</th>
                <th class="px-4 text-left">Variant Values</th>
                <th class="px-4 text-left">Status</th>
                <th class="px-4 text-left">Created On</th>
                <th class="px-4 text-left">Actions</th>
            </template>
            <template #mobileHeader="{ row: variant }">
                <div class="flex items-center gap-6">
                    <div class="flex items-center text-sm text-gray-600">
                        <CheckBox :selected="selected" :value="variant.id">
                            <input v-model="selected" type="checkbox" :value="variant.id" hidden />
                        </CheckBox>
                    </div>
                    <div>
                        {{ variant.name }}
                    </div>
                </div>
            </template>
            <template #default="{ row: variant }">
                <TableCell class="justify-center">
                    <CheckBox :selected="selected" :value="variant.id">
                        <input v-model="selected" type="checkbox" :value="variant.id" hidden />
                    </CheckBox>
                </TableCell>
                <TableCell class="flex items-center" header="Name">{{ variant.name }}</TableCell>

                <TableCell class="flex items-center" header="Variant Values">
                    <span v-for="(value, index) in variant.values" :key="index">{{ value.value }}<span
                            v-if="index < variant.values.length - 1">, </span></span>
                </TableCell>
                <TableCell class="flex items-center gap-8" header="Status">
                    <div :class="variant.status === 1 ? 'active_chip' : 'inactive_chip'">
                        {{ variant.status === 1 ? 'Active' : 'Inactive' }}
                    </div>
                    <ToggleSwitch :checked="variant.status === 1" @change="toggleStatus(variant)" />
                </TableCell>
                <TableCell class="flex items-center" header="Created">{{ formatDate(variant.createdAt, 'dt') }}
                </TableCell>
                <TableCell class="flex items-end" header="Actions">
                    <div class="relative">
                        <button @click="showActionsMenu(variant)" class="Btn__icon">
                            <Icon name="action" class="h-5 w-5" />
                        </button>
                        <div v-if="variant.id === activeVariantMenu"
                            class="absolute left-14 lg:left-[-80px] mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                            <button @click="setEditVariant(variant)"
                                class="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 w-full text-left">Edit</button>
                        </div>
                    </div>
                </TableCell>
            </template>
        </ResponsiveTable>
    </div>
    <PopUp :open="modalOpen" staticBackDrop title="Add Variant" @close="toggleVariantModal" description=""
        :buttons="[{ alt: true, text: 'Cancel', handler: toggleVariantModal }, { text: 'Save', handler: createVariant }]">
        <template #content>
            <VInput id="variant" label="Variant Name" tooltip="Variant Name" v-model="variant.name" required type="text"
                placeholder="Variant Name" />
            <VMultiSelect id="variantValues" label="Variant Values" tooltip="type value and press enter to add"
                v-model="variant.values" required placeholder="  Type value + enter to add" />
        </template>
    </PopUp>
    <PopUp :open="updateModal" staticBackDrop title="Edit Variant" @close="toggleUpdateModal" description=""
        :buttons="[{ alt: true, text: 'Cancel', handler: toggleUpdateModal }, { text: 'Save', handler: editVariant }]">
        <template #content>
            <VInput id="variant" label="Variant Name" tooltip="Variant Name" v-model="variant.name" required type="text"
                placeholder="Variant Name" />
            <VMultiSelect id="variantValues" label="Variant Values" tooltip="type value and press enter to add"
                v-model="variant.values" required placeholder="  Type value then enter or (+ Button) to add" />
        </template>
    </PopUp>
    <PopUp :open="confirmDeleteModal" staticBackDrop title="Are You Sure?" @close="closeConfirmDeleteModal"
        description="Confirm action to delete variant"
        :buttons="[{ alt: true, text: 'Cancel', handler: closeConfirmDeleteModal }, { text: 'Confirm', handler: deleteVariant }]">
    </PopUp>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import ResponsiveTable, { TableRow } from '~~/components/table/responsive-table.vue';
import TableCell from '~~/components/table/table-cell.vue';
import Icon from '~~/components/ui/icon.vue';
import VInput from '~~/components/input/v-input.vue';
import VMultiSelect from '~~/components/input/v-multi-select.vue';
import ToggleSwitch from '~~/components/ui/toggle-switch.vue';
import PopUp from '~~/components/ui/pop-up.vue';
import { apiFetch } from '~~/composables/fetch';
import { exportCategoriesToXLSX } from '~~/composables/ui';
import { Variant } from '~~/composables/resources/business';

const search = ref('');
const selected = ref<number[]>([]);
const activeVariantMenu = ref<number | null>(null);
const modalOpen = ref(false);
const confirmDeleteModal = ref(false);
const updateModal = ref(false);
const variant = ref<any>({
    id: 0,
    name: '',
    values: [],
});
const variants = ref<{ data: Variant[] } | null>(null);

const { addToast } = useToast();
const route = useRoute();
const router = useRouter();

const fetchVariants = async () => {
    try {
        const response = await apiFetch('/variants', {
            method: 'GET',
        });
        const data = await response;
        if (data) {
            variants.value = { data: data };
        }

    } catch (error) {
        console.error('Error fetching variants:', error);
    }
};

const createVariant = async () => {
    if (variant.value.name === "") {
        addToast({ message: 'Variant name is required', type: 'error' });
        return;
    }
    if (variant.value.values) {
        if (variant.value.values.length < 1) {
            addToast({ message: 'At least one variant value is required', type: 'error' });
            return;
        }
    }
    const payload = {
        name: variant.value.name,
        values: variant.value.values
    };
    try {
        const response = await apiFetch('/variants', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        addToast({ message: 'Variant created successfully', type: 'success' });
        fetchVariants();
        toggleVariantModal();
        variant.value.name = '';
        variant.value.values = [];
    } catch (error) {
        console.error('Error creating variant:', error.data);
        addToast({ message: error.data.message || 'Failed to create variant', type: 'error' });
    }
};

const toggleVariantModal = () => {
    modalOpen.value = !modalOpen.value;

    variant.value.name = '';
    variant.value.values = [];
};

const toggleUpdateModal = () => {
    updateModal.value = !updateModal.value;
};

const confirmDelete = (id: number) => {
    confirmDeleteModal.value = true;
    variant.value.id = id;
};

const closeConfirmDeleteModal = () => {
    confirmDeleteModal.value = false;
};

const showActionsMenu = (variant: Variant) => {
    activeVariantMenu.value = activeVariantMenu.value === variant.id ? null : variant.id;
};
const setEditVariant = (data: { id: number, name: string, values: { value: string }[] }) => {
    variant.value = {
        id: data.id,
        name: data.name,
        values: data.values.map(v => v.value) // Map object to string
    };
    activeVariantMenu.value = null;
    toggleUpdateModal();
};


const editVariant = async () => {
    if (variant.value.name === "") {
        addToast({ message: 'Variant name is required', type: 'error' });
        return;
    }
    if (variant.value.values) {
        if (variant.value.values.length < 1) {
            addToast({ message: 'At least one variant value is required', type: 'error' });
            return;
        }
    }
    const payload = {
        name: variant.value.name,
        values: variant.value.values
    };
    try {
        await apiFetch(`/variants/${variant.value.id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        await fetchVariants();
        activeVariantMenu.value = null;
        toggleUpdateModal();
        addToast({ message: 'Variant updated successfully', type: 'success' });
    } catch (error) {
        console.error('Error editing variant:', error.data);
        addToast({ message: error.data.error || 'Failed to update variant', type: 'error' });
    }
};

const deleteVariant = async () => {
    try {
        await apiFetch(`/productVariants/${variant.value.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        addToast({ message: 'Variant deleted successfully', type: 'success' });
        await fetchVariants();
        closeConfirmDeleteModal();
    } catch (error) {
        console.error('Error deleting variant:', error);
        addToast({ message: 'Failed to delete variant', type: 'error' });
    }
};

const toggleStatus = async (variant: any) => {

    const url = variant.status === 0 ? `/variants/${variant.id}/activate` : `/variants/${variant.id}/deactivate`;
    const payload = {
        id: variant.id,
    };

    try {
        await apiFetch(url, {
            method: 'PUT',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const newStatus = (variant.status === 0 ? 'Active' : 'Inactive');
        addToast({ message: `variant status toggled to ${newStatus}`, type: 'success' });
        await fetchVariants()
    } catch (error) {
        console.error('Error toggling variant status:', error);
        addToast({ message: 'Failed to toggle variant status', type: 'error' });
    }
};


const filteredVariants = computed(() => {
    const searchTerm = search.value.toLowerCase();
    return variants.value?.data.filter((variant) => {
        return (
            variant?.name.toLowerCase().includes(searchTerm)
        );
    }) || [];
});

onMounted(fetchVariants);
</script>
