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
                @click="exportCategoriesToXLSX(filteredUnits, 'units')">
                <p>Export</p>
                <Icon :name="'export'"></Icon>
            </button>

            <button class="Btn bg-primary" @click="toggleunitModal">Add New +</button>
        </div>

        <ResponsiveTable v-bind="{ data: { data: filteredUnits } }">
            <template #header>
                <th>
                    <ToggleSelections v-model="selected" v-bind="{ data: units, mapFn: (v: Unit) => v.id, }" />
                </th>
                <th class="px-4 text-left">Name</th>
                <th class="px-4 text-left">Created On</th>
                <th class="px-4 text-left">Status</th>
                <th class="px-4 text-left">Actions</th>
            </template>
            <template #mobileHeader="{ row: unit }: TableRow<Unit>">
                <div class="flex items-center gap-6">
                    <div class="flex items-center text-sm text-gray-600">
                        <CheckBox v-bind="{ selected, value: unit.id }">
                            <input v-model="selected" type="checkbox" :value="unit.id" hidden />
                        </CheckBox>
                    </div>
                    <div>
                        {{ unit.name }}
                    </div>
                </div>
            </template>
            <template #default="{ row: unit }: TableRow<Unit>">
                <TableCell class="justify-center">
                    <CheckBox v-bind="{ selected, value: unit.id }">
                        <input v-model="selected" type="checkbox" :value="unit.id" hidden />
                    </CheckBox>
                </TableCell>
                <TableCell class="flex items-center" header="Name">{{ unit.name }}</TableCell>
                <TableCell class="flex items-center" header="Created">{{ formatDate(unit.createdAt, 'dt') }}
                </TableCell>
                <TableCell class="flex items-center gap-8" header="Status">
                    <div :class="unit.status === 'active' ? 'active_chip' : 'inactive_chip'">
                        {{ unit.status }}
                    </div>
                    <ToggleSwitch :checked="unit.status === 'active'" @change="toggleStatus(unit)" />
                </TableCell>
                <TableCell class="flex items-end" header="Actions">
                    <div class="relative">
                        <button @click="showActionsMenu(unit)" class="Btn__icon">
                            <Icon name="action" class="h-5 w-5" />
                        </button>
                        <div v-if="unit.id === activeunitMenu"
                            class="absolute left-14 lg:left-[-80px]  mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                            <button @click="setEditunit(unit)"
                                class="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 w-full text-left">Edit</button>
                        </div>
                    </div>
                </TableCell>
            </template>
        </ResponsiveTable>

    </div>
    <!-- add modal -->
    <PopUp :open="modalOpen" staticBackDrop title="Add unit" @close="toggleunitModal" description=""
        :buttons="[{ alt: true, text: 'Cancel', handler: toggleunitModal }, { text: 'Save', handler: createUnit }]">
        <template #content>
            <VInput id="unit" label="unit Name" tooltip="unit Name" v-model="unit.name" required type="text"
                placeholder="unit Name" />
        </template>
    </PopUp>
    <!-- update modal -->
    <PopUp :open="updateModal" staticBackDrop title="Add unit" @close="toggleUpdateModal" description=""
        :buttons="[{ alt: true, text: 'Cancel', handler: toggleUpdateModal }, { text: 'Save', handler: editunit }]">
        <template #content>
            <VInput id="unit" label="unit Name" tooltip="unit Name" v-model="unit.name" required type="text"
                placeholder="unit Name" />
        </template>
    </PopUp>
    <!-- delete modal -->
    <PopUp :open="confirmDeleteModal" staticBackDrop title="Are You Sure?" @close="toggleunitModal"
        description="Confirm action to delete unit"
        :buttons="[{ alt: true, text: 'Cancel', handler: closeConfirmDeleteModal }, { text: 'Confirm', handler: deleteunit }]">
    </PopUp>
</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue';
import ResponsiveTable, { TableRow } from '~~/components/table/responsive-table.vue';
import TableCell from '~~/components/table/table-cell.vue';
import Icon from '~~/components/ui/icon.vue';
import VInput from '~~/components/input/v-input.vue';
import ToggleSwitch from '~~/components/ui/toggle-switch.vue';
import PopUp from '~~/components/ui/pop-up.vue';
import { Unit } from '~~/composables/resources/unit';
import { ApiList, apiFetch } from '~~/composables/fetch';
import { exportCategoriesToXLSX } from '~~/composables/ui';
import { useRoute, useRouter } from 'vue-router';

// Define your refs
const originalunits = ref<Unit[]>([]);
const search = ref('');
const selected = ref<number[]>([]);
const activeunitMenu = ref<number | null>(null);
const modalOpen = ref(false);
const confirmDeleteModal = ref(false);
const updateModal = ref(false);
const meta = ref({ page: 1, perPage: 10 });
const unit = ref<Unit>({
    id: 0,
    name: '',
    createdAt: '',
    updatedAt: '',
    status: '',
});
const units = ref<Unit[]>([]);
const { addToast } = useToast();
const route = useRoute();
const router = useRouter();

const fetchunits = async () => {
    try {
        const response = await apiFetch('/productunits', {
            method: 'GET',
        });
        const data = await response;
        units.value = data;
        originalunits.value = data;
        console.log('units', units.value);
    } catch (error) {
        console.error('Error fetching services:', error);
    }
};

const createUnit = async () => {
    if (unit.value.name === "") {
        addToast({ message: 'unit name is required', type: 'error' });
        return;
    }
    const payload = {
        name: unit.value.name,
    };
    try {
        const response = await apiFetch('/productunits', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log(response);
        addToast({ message: 'unit created successfully', type: 'success' });
        toggleunitModal();
        await fetchunits();
        unit.value.name = '';
    } catch (error) {
        console.error('Error creating unit:', error.data);
        addToast({ message: error.data.message || 'Failed to create unit', type: 'error' });
    }
};

// Function to toggle unit modal
const toggleunitModal = () => {
    modalOpen.value = !modalOpen.value;
};

const toggleUpdateModal = () => {
    updateModal.value = !updateModal.value;
};

const confirmDelete = (id: number) => {
    confirmDeleteModal.value = true;
    console.log(id);
    unit.value.id = id;
};
const closeConfirmDeleteModal = () => {
    confirmDeleteModal.value = false;
};

const showActionsMenu = (unit: Unit) => {
    if (activeunitMenu.value === unit.id) {
        activeunitMenu.value = null;
    } else {
        activeunitMenu.value = unit.id;
    }
};

const setEditunit = (data: Unit) => {
    console.log('Editing unit:', data);
    const editedunit: Unit = { ...data };
    unit.value = editedunit;
    activeunitMenu.value = null;
    toggleUpdateModal();
};

const editunit = async () => {
    if (unit.value.name === "") {
        addToast({ message: 'unit name is required', type: 'error' });
        return;
    }
    const payload = {
        name: unit.value.name,
        status: unit.value.status,
    };

    try {

        const response = await apiFetch(`/productunits/${unit.value.id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log(response);
        fetchunits();
        activeunitMenu.value = null;
        toggleUpdateModal();
        addToast({ message: 'unit updated successfully', type: 'success' });
    } catch (error) {
        console.error('Error editing unit:', error.data);
        addToast({ message: error.data.error || 'Failed to update unit', type: 'error' });
    }
};

const deleteunit = async () => {
    try {
        const response = await apiFetch(`/productunits/${unit.value.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        addToast({ message: 'unit deleted successfully', type: 'success' });
        fetchunits();
        closeConfirmDeleteModal();
    } catch (error) {
        console.error('Error deleting unit:', error);
        addToast({ message: 'Failed to delete unit', type: 'error' });
    }
};

const toggleStatus = async (unit: Unit) => {
    const newStatus = unit.status === 'active' ? 'inactive' : 'active';
    const payload = { status: newStatus };

    try {
        await apiFetch(`/productunits/${unit.id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        unit.status = newStatus;
        addToast({ message: `unit status toggled to ${newStatus}`, type: 'success' });
    } catch (error) {
        console.error('Error toggling unit status:', error);
        addToast({ message: 'Failed to toggle unit status', type: 'error' });
    }
};

const filteredUnits = computed(() => {
    const searchTerm = search.value.toLowerCase();
    return units.value.filter((unit) => {
        return (
            unit.name.toLowerCase().includes(searchTerm) ||
            unit.status.toLowerCase().includes(searchTerm) ||
            unit.createdAt.toLowerCase().includes(searchTerm)
        );
    });
});

onMounted(fetchunits);

</script>
