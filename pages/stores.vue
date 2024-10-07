<template>
  <div class="flex w-full flex-col space-y-8 px-4 pb-0 sm:p-8">
    <Title>Stores · Zari</Title>
    <div class="flex w-full flex-wrap items-center justify-between space-y-2">
        <h1 class="mr-2 text-2xl font-bold text-gray-700">Vendors</h1>
      <NuxtLink class="Btn items-center" to="/stores/add-store">
        <Icon name="plus" class="mr-2 h-4 stroke-2" />
        Add Store
      </NuxtLink>
    </div>
    <label
      class="flex max-w-lg items-center rounded-xl bg-white py-3 pl-2 text-sm text-gray-500 shadow-sm"
    >
      <Icon name="search" class="h-7" />
      <input
        type="text"
        class="w-full px-4 placeholder:text-gray-300 focus:outline-none"
        placeholder="Search keyword, Store Name, Address, Bank Account No"
        v-model="search"
        @input="doSearch"
      />
    </label>

    <ResponsiveTable v-bind="{ data: stores, pending }" @paginate="paginate">
      <template #header>
        <th>
          <ToggleSelections
            v-model="selected"
            v-bind="{data: stores?.data, mapFn: (v: Store) => v.id}"
          />
        </th>
        <th class="px-4 text-left">Store Name</th>
        <th class="px-4 text-left">Category</th>
        <th class="px-4 text-left">Address</th>
        <th></th>
      </template>
      <template #mobileHeader="{ row: store }: TableRow<Store>">
        <div class="flex items-center text-sm text-gray-600">
          <CheckBox v-bind="{ selected, value: store.id }">
            <input
              v-model="selected"
              type="checkbox"
              :value="store.id"
              hidden
            />
          </CheckBox>
          <span class="ml-4">{{ store.name }}</span>
        </div>
      </template>
      <template #default="{ row: store }: TableRow<Store>">
        <TableCell class="justify-center">
          <CheckBox v-bind="{ selected, value: store.id }">
            <input
              v-model="selected"
              type="checkbox"
              :value="store.id"
              hidden
            />
          </CheckBox>
        </TableCell>
        <TableCell class="flex items-center">{{ store.name }}</TableCell>
        <TableCell header="Category">
          {{ store.categories?.map((c) => c.name).join(', ') }}
        </TableCell>
        <TableCell header="Address">
          <span
            class="max-w-xs lg:truncate lg:whitespace-nowrap 2xl:max-w-md"
            >{{ store.address?.address }}</span
          >
        </TableCell>
        <TableCell header="" class="space-x-4">
          <NuxtLink class="Btn__icon" :to="`/stores/view/${store.id}`">
            <Icon name="eye" class="h-6 w-6" />
          </NuxtLink>
          <NuxtLink class="Btn__icon" :to="`/stores/edit/${store.id}`">
            <Icon name="pencil" class="h-6 w-6" />
          </NuxtLink>
          <button
            class="Btn__icon"
            type="button"
            @click="storeToDelete = store"
          >
            <Icon name="trash" class="h-6 w-6" />
          </button>
        </TableCell>
      </template>
    </ResponsiveTable>
    <SlideModal
      :open="modalOpen"
      staticBackDrop
      @close="$router.replace('/stores')"
      :title="modalTitle"
    >
      <NuxtPage />
    </SlideModal>
    <ConfirmDelete
      v-bind="{ item: storeToDelete, deleteFn: deleteStore, name: (store: Store) => store.name }"
      @cancelled="storeToDelete = undefined"
      @deleted="deleteDone"
    />
  </div>
</template>

<script setup lang="ts">
import Icon from '~~/components/ui/icon.vue'
import ResponsiveTable, {
  TableRow
} from '~~/components/table/responsive-table.vue'
import CheckBox from '~~/components/input/check-box.vue'
import TableCell from '~~/components/table/table-cell.vue'
import SlideModal from '~~/components/ui/slide-modal.vue'
import { ApiList } from '~~/composables/fetch'
import { Store } from '~~/composables/resources/business'
import ConfirmDelete from '~~/components/resources/confirm-delete.vue'
import ToggleSelections from '~~/components/ui/toggle-selections.vue'

// defines
definePageMeta({ layout: 'admin', middleware: ['auth'] })

// refs
const route = useRoute()
const search = ref('')
const selected = ref<number[]>([])
const {
  data: stores,
  refresh,
  pending
} = useApiFetch<ApiList<Store>>('stores', () => ({
  params: {
    'relations[]': ['address', 'bankAccount', 'categories'],
    search: search.value,
    page: route.query.page ?? 1,
    perPage: route.query.perPage ?? 10
  },
  group: 'stores'
}))
const storeToDelete = ref<Store>()
const [modalTitle, modalOpen] = useRouteModal('stores', [
  '/stores/add-store',
  '/stores/edit',
  '/stores/view'
])

// methods
const doSearch = useDebounce(() => {
  refresh()
}, 200)
const deleteStore = (store: Store) =>
  apiFetch(`stores/${store.id}`, { method: 'delete' })
const deleteDone = () => {
  storeToDelete.value = undefined
  refresh()
}
const paginate = usePaginate(refresh)
</script>
