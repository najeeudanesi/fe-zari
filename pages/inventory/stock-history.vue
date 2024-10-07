<template>
  <div>
    <label
      class="flex lg:max-w-1/2 max-w-full  items-center rounded-xl bg-white py-3 pl-2 text-sm text-gray-500 shadow-sm w-full md:w-1/3 top-[-25px] xl:top-[-60px] relative">
      <Icon name="search" class="h-7" />
      <input type="text" class="w-full px-4 placeholder:text-gray-300 focus:outline-none"
        placeholder="Search keyword, name, message" v-model="search">
    </label>
    <div class="flex gap-16 mb-6">
      <button class="bg-none outline font outline-1 outline-primary text-primary rounded-md px-4 py-2 flex">
        <p>Export</p>
        <Icon :name="'export'"></Icon>
      </button>
    </div>


    <ResponsiveTable v-bind="{ data: stocks, skeleton: { rows: 3, columns: 7 } }">
      <template #header>
        <th>
          <ToggleSelections v-model="selected" v-bind="{ data: stocks?.data, mapFn: (v: Stock) => v.id }" />
        </th>
        <th class="px-4 text-left">Stock Id</th>
        <th class="px-4 text-left">Cost Price</th>
        <th class="px-4 text-left">Selling Price Price</th>
        <th class="px-4 text-left">Product</th>
        <th class="px-4 text-left">Quantity</th>
        <th class="px-4 text-left">Expiry Date</th>
      </template>
      <template #mobileHeader="{ row: stock }: TableRow<Stock>">
        <div class="flex items-center gap-6">
          <div class="flex items-center text-sm text-gray-600">
            <CheckBox v-bind="{ selected, value: stock.id }">
              <input v-model="selected" type="checkbox" :value="stock.id" hidden />
            </CheckBox>
          </div>
          <div>
            {{ stock.id }}
          </div>
        </div>
      </template>
      <template #default="{ row: stock }: TableRow<Stock>">
        <TableCell class="justify-center">
          <CheckBox v-bind="{ selected, value: stock.id }">
            <input v-model="selected" type="checkbox" :value="stock.id" hidden />
          </CheckBox>
        </TableCell>
        <TableCell class="flex items-center" header="Stock Id">{{ stock.id }}</TableCell>
        <TableCell class="flex items-center" header="Cost Price">N{{ stock.costPrice }}</TableCell>
        <TableCell class="flex items-center" header="Selling Price">N{{ stock.sellingPrice }}</TableCell>
        <TableCell class="flex items-center" header="Product">{{ stock.product.name }}</TableCell>
        <TableCell class="flex items-center" header="Quantity">{{ stock.product.quantity }}</TableCell>
        <TableCell class="flex items-center" header="Expiry Date">{{ stock.expiryDate }}</TableCell>

      </template>
    </ResponsiveTable>

  </div>
</template>

<script setup lang="ts">
import ResponsiveTable, { TableRow } from '~~/components/table/responsive-table.vue'
import { Stock } from '~~/composables/resources/stock'
import TableCell from '~~/components/table/table-cell.vue'
import Icon from '~~/components/ui/icon.vue'
import PopUp from '~~/components/ui/pop-up.vue'
import AddSingleService from '~~/components/resources/products/add-single-service.vue'
import ToggleSelections from '~~/components/ui/toggle-selections.vue'
import { exportCategoriesToXLSX } from '~~/composables/ui'
import { ApiList } from '~~/composables/fetch'

import { Transaction } from '~~/composables/resources/transaction';

const selected = ref<number[]>([]);
const search = ref('')
const route = useRoute()
const router = useRouter()
const stocks = ref();

const { addToast } = useToast()
// const {
//   data: stocks,
//   refresh,
//   pending
// } = useApiFetch<ApiList<Stock>>('stocks', () => ({
//   params: {
//     search: search.value,
//     page: route.query.page ?? 1,
//     perPage: route.query.perPage ?? 20
//   },
//   group: 'stocks'
// }))


const fetchStocks = async () => {
  try {
    const response = await apiFetch('/stocks', {
      method: 'GET',
    });
    const data = await response
    stocks.value = { data: data };
    console.log('Stocks', stocks.value)
  } catch (error) {
    console.error('Error fetching services:', error);
  }
};


// const doSearch = useDebounce(() => {
//   refresh()
// }, 200)


onMounted(fetchStocks)

// const paginate = usePaginate(refresh)
</script>