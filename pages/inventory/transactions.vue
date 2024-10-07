<template>
    <div>
        <label
            class="flex lg:max-w-1/2 max-w-full  items-center rounded-xl bg-white py-3 pl-2 text-sm text-gray-500 shadow-sm w-full md:w-1/3 top-[-25px] xl:top-[-60px] relative">
            <Icon name="search" class="h-7" />
            <input type="text" class="w-full px-4 placeholder:text-gray-300 focus:outline-none"
                placeholder="Search keyword, name, message" v-model="search" />
        </label>
        <div class="flex gap-16">
            <button class="bg-none outline font outline-1 outline-primary text-primary rounded-md px-4 py-2 flex">
                <p>Export</p>
                <Icon :name="'export'"></Icon>
            </button>
        </div>

        <div class="mt-6">
            <ResponsiveTable v-bind="{ data: transactions, skeleton: { rows: 3, columns: 7 } }">
                <template #header>
                    <th>
                        <ToggleSelections v-model="selected"
                            v-bind="{ data: transactions.data, mapFn: (v: Transaction) => v.id }" />
                    </th>
                    <th class="px-4 text-left">Order Number</th>
                    <th class="px-4 text-left">Order Date</th>
                    <th class="px-4 text-left">Payment Type</th>
                    <th class="px-4 text-left">Amount</th>
                    <th class="px-4 text-left">Customer</th>
                    <th class="px-4 text-left">User</th>
                    <th class="px-4 text-left">Store</th>
                    <th class="px-4 text-left">Status</th>
                </template>
                <template #mobileHeader="{ row: transaction }: TableRow<Transaction>">
                    <div class="flex items-center gap-6">
                        <div class="flex items-center text-sm text-gray-600">
                            <CheckBox v-bind="{ selected, value: transaction.id }">
                                <input v-model="selected" type="checkbox" :value="transaction.id" hidden />
                            </CheckBox>
                        </div>
                        <div>
                            {{ transaction.orderNumber }}
                        </div>
                    </div>
                </template>
                <template #default="{ row: transaction }: TableRow<Transaction>">
                    <TableCell class="justify-center">
                        <CheckBox v-bind="{ selected, value: transaction.id }">
                            <input v-model="selected" type="checkbox" :value="transaction.id" hidden />
                        </CheckBox>
                    </TableCell>
                    <TableCell class="flex items-center" header="Order Number">{{ transaction.orderNumber }}</TableCell>
                    <TableCell class="flex items-center" header="Order Date">{{ transaction.created_at }}</TableCell>
                    <TableCell class="flex items-center" header="Payment Type">{{ transaction.paymentType }}</TableCell>
                    <TableCell class="flex items-center" header="Amount">{{ transaction.amount }}</TableCell>
                    <TableCell class="flex items-center" header="Customer">{{ transaction.customer }}</TableCell>
                    <TableCell class="flex items-center" header="User">{{ transaction.user }}</TableCell>
                    <TableCell class="flex items-center" header="Store">{{ transaction.store }}</TableCell>
                    <TableCell class="flex items-center" header="Status">
                        <div :class="transaction.status === 'Success' ? 'active_chip' : 'inactive_chip'">
                            {{ transaction.status }}
                        </div>
                    </TableCell>
                </template>
            </ResponsiveTable>
        </div>
    </div>
</template>

<script setup lang="ts">
import ResponsiveTable, { TableRow } from '~~/components/table/responsive-table.vue'

import TableCell from '~~/components/table/table-cell.vue'
import Icon from '~~/components/ui/icon.vue'
import PopUp from '~~/components/ui/pop-up.vue'

import { Transaction } from '~~/composables/resources/transaction';

const selected = ref<number[]>([]);
const search = ref('')
const transactions = ref({
    data: [

    ]
});

const fetchTransactions = async () => {
    try {
        const response = await apiFetch('/transactions', {
            method: 'GET',
        });
        const data = await response
        transactions.value = { data: data };
        console.log('Transactions', transactions.value)
    } catch (error) {
        console.error('Error fetching services:', error);
    }
};


onMounted(fetchTransactions)
</script>