<template>
  <div class="flex w-full flex-col space-y-8 px-4 pb-0 sm:p-8">
    <Title>Transactions · Zari</Title>
    <div class="flex w-full flex-wrap items-center justify-between space-y-2">
      <h1 class="mr-2 text-2xl font-bold text-gray-700">Transactions</h1>
    </div>

    <div class="flex items-center justify-between">
      <label
        class="flex w-full max-w-xs items-center rounded-xl bg-white py-3 pl-2 text-sm text-gray-500 shadow-sm"
      >
        <Icon name="search" class="h-7" />
        <input
          type="text"
          class="w-full px-4 placeholder:text-gray-300 focus:outline-none"
          placeholder="Search keyword, gift card Number"
          v-model="search"
          @input="doSearch"
        />
      </label>
    </div>
    <ResponsiveTable
      v-bind="{ data: purchases, pending, skeleton: { rows: 3, columns: 6 } }"
      @paginate="paginate"
    >
      <template #header>
        <th class="px-4 text-left">Voucher</th>
        <th class="px-4 text-left">Gifter & Giftee</th>
        <th class="px-4 text-left">Store</th>
        <th class="px-4 text-left">Amount</th>
        <th class="px-4 text-left">Status</th>
        <th class="px-4 text-left">Actions</th>
      </template>
      <template #mobileHeader="{ row: purchase }: TableRow<Purchase>">
        <div class="flex items-center text-sm text-gray-600">
          <CheckBox v-bind="{ selected, value: purchase.id }">
            <input
              v-model="selected"
              type="checkbox"
              :value="purchase.id"
              hidden
            />
          </CheckBox>
          <div class="ml-2 flex items-center space-x-2">
            <span>To:</span>
            <img
              :src="PLACEHOLDER_IMAGE"
              alt="sample user"
              class="h-10 rounded-full"
            />
            <span>{{ purchase.recipient?.name }}</span>
          </div>
        </div>
      </template>
      <template #default="{ row: purchase }: TableRow<Purchase>">
        <TableCell class="flex items-center space-x-3">
          {{ userRole() === 'admin' ? purchase.voucherNumber : '****' }}
        </TableCell>
        <TableCell>
          <div class="flex flex-col space-y-3 text-xs">
            <div class="flex space-x-2">
              <span class="font-semibold text-gray-500">Gifter:</span>
              <span>{{ purchase.creator?.name }}</span>
            </div>
            <div class="flex space-x-2">
              <span class="font-semibold text-gray-500">Giftee:</span>
              <span>{{ purchase.recipient?.name }}</span>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <span>{{ purchase.voucher?.store?.name }}</span>
        </TableCell>
        <TableCell header="Amount"> {{ toMoney(purchase.money) }} </TableCell>

        <TableCell header="Expiry Date" v-if="false">
          {{ purchase.expiresAt && formatDate(purchase.expiresAt, 'l') }}
        </TableCell>
        <TableCell header="Status">
          <div
            :class="['Status', `Status--${purchaseStatusMap[purchase.status]}`]"
          >
            {{ purchase.status.replace('_', ' ') }}
          </div>
        </TableCell>
        <TableCell header="Actions">
          <NuxtLink
            class="Btn__icon mr-3"
                :to=" `/transactions/${purchase.voucherNumber ? purchase.voucherNumber : purchase.id}`"
          >
            <Icon name="eye" class="h-5 w-5" />
          </NuxtLink>
          <RetryPayment
            v-if="retryPaymentStatuses.has(purchase.status)"
            v-bind="{ purchase }"
            @refresh="refresh"
          />
        </TableCell>
      </template>
    </ResponsiveTable>
    <SlideModal
      :open="modalOpen"
      staticBackDrop
      @close="$router.replace('/transactions')"
      :title="modalTitle"
    >
      <NuxtPage />
    </SlideModal>
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
import { Purchase } from '~~/composables/resources/gifting'
import RetryPayment from '~~/components/resources/purchases/retry-payment.vue'

// defines
definePageMeta({ layout: 'admin', middleware: ['auth'] })

// refs
const route = useRoute()
const search = ref('')
const {
  data: purchases,
  refresh,
  pending
} = useApiFetch<ApiList<Purchase>>('purchases', () => ({
  params: {
    page: route.query.page ?? 1,
    perPage: route.query.perPage ?? 10,
    'relations[]': ['recipient', 'voucher', 'creator'],
    'statuses[]': ['redeemed', 'settled', 'settlement_failed', 'pending', 'cancelled'],
    search: search.value
  },
  group: 'purchases'
}))
const selected = ref<number[]>([])
const [modalTitle, modalOpen] = useRouteModal('transactions', [
  '/transactions/.'
])
const retryPaymentStatuses = new Set<Purchase['status']>([
  'redeemed',
  'settlement_failed'
])

// methods
const doSearch = useDebounce(() => {
  refresh()
}, 200)
const paginate = usePaginate(refresh)
</script>
