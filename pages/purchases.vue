<template>
  <div class="flex w-full flex-col space-y-8 px-4 pb-0 sm:p-8">
    <Title>Gift Cards · Zari</Title>
    <div class="flex w-full flex-wrap items-center justify-between space-y-2">
      <h1 class="mr-2 text-2xl font-bold text-gray-700">
        {{ auth?.user.stores?.[0].name ?? 'Store' }} purchases
      </h1>
      <button class="Btn font-medium" @click="redeemPopUp.open = true">
        Redeem Gift Card
      </button>
    </div>
    <div class="flex max-w-xs justify-between rounded-lg bg-white p-4 shadow-sm">
      <div class="flex flex-col space-y-3">
        <span class="text-sm font-semibold text-gray-400">Total gifts issued</span>
        <h1 class="text-2xl font-bold text-gray-700">
          {{ purchases?.meta?.total }}
        </h1>
      </div>
      <DropDown v-if="false" v-bind="{ items: [{ title: 'ok' }] }">
        <div class="flex cursor-pointer items-center justify-between rounded-lg bg-gray-100 px-2 py-1">
          <span class="text-xs">This Month</span>
          <Icon name="arrow-drop-down" class="h-5 w-5 text-gray-600" aria-hidden="true" />
        </div>
      </DropDown>
    </div>
    <label class="flex max-w-xs items-center rounded-xl bg-white py-3 pl-2 text-sm text-gray-500 shadow-sm">
      <Icon name="search" class="h-7" />
      <input type="text" class="w-full px-4 placeholder:text-gray-300 focus:outline-none"
        placeholder="Search keyword, Gift card Number" v-model="search" @input="doSearch" />
    </label>
    <ResponsiveTable v-bind="{ data: purchases, pending, skeleton: { rows: 3, columns: 7 } }" @paginate="paginate">
      <template #header>
        <th>
          <ToggleSelections v-model="selected" v-bind="{ data: purchases?.data, mapFn: (v: Purchase) => v.id, }" />
        </th>
        <th class="px-4 text-left">Voucher</th>
        <th class="px-4 text-left">Recipient</th>
        <th class="px-4 text-left">Amount</th>
        <th class="px-4 text-left">Date Gifted</th>
        <th v-show="false" class="px-4 text-left">Expiry Date</th>
        <th class="px-4 text-left">Status</th>
        <th class="px-4 text-left">Actions</th>
      </template>
      <template #mobileHeader="{ row: purchase }: TableRow<Purchase>">
        <div class="flex items-center text-sm text-gray-600">
          <CheckBox v-bind="{ selected, value: purchase.id }">
            <input v-model="selected" type="checkbox" :value="purchase.id" hidden />
          </CheckBox>
          <div class="ml-2 flex items-center space-x-2">
            <span>To:</span>
            <img :src="PLACEHOLDER_IMAGE" alt="sample user" class="h-10 rounded-full" />
            <span>{{ purchase.recipient?.name }}</span>
          </div>
        </div>
      </template>
      <template #default="{ row: purchase }: TableRow<Purchase>">
        <TableCell class="justify-center">
          <CheckBox v-bind="{ selected, value: purchase.id }">
            <input v-model="selected" type="checkbox" :value="purchase.id" hidden />
          </CheckBox>
        </TableCell>
        <TableCell class="flex items-center space-x-3">
          {{ purchase.voucherNumber }}
        </TableCell>
        <TableCell>
          <span>{{ purchase.recipient?.name }}</span>
        </TableCell>
        <TableCell header="Amount"> {{ toMoney(purchase.money) }} </TableCell>
        <TableCell header="Date Gifted">
          {{ formatDate(purchase.createdAt, 'l') }}
        </TableCell>
        <TableCell header="Expiry Date" v-if="false">
          {{ purchase.expiresAt && formatDate(purchase.expiresAt, 'l') }}
        </TableCell>
        <TableCell header="Status">
          <div :class="['Status', `Status--${purchaseStatusMap[purchase.status]}`]">
            {{ purchase.status.replace('_', ' ') }}
          </div>
        </TableCell>
        <TableCell header="Actions">
          <NuxtLink v-if="purchase.status !== 'pending'" class="Btn__icon" :to="`/purchases/${purchase.voucherNumber}`">
            <Icon name="eye" class="h-5 w-5" />
          </NuxtLink>
        </TableCell>
      </template>
    </ResponsiveTable>
    <SlideModal :open="modalOpen" staticBackDrop @close="$router.replace('/purchases')" :title="modalTitle">
      <NuxtPage />
    </SlideModal>
    <PopUp v-bind="redeemPopUp">
      <form @submit.prevent="verifyVoucher" class="flex flex-col items-center space-y-3">
        <VInput v-model="voucherNumber" id="voucherNumber" label="Enter Gift Card Number"
          class="items-center text-center" type="number" required />
        <div class="flex space-x-3 pt-2">
          <Btn type="submit" class="Btn w-32" :loading="redeeming">
            Redeem
          </Btn>
          <button type="button" class="Btn__alt w-32" @click="closeVerifyVoucher">
            Cancel
          </button>
        </div>
      </form>
    </PopUp>
  </div>
</template>

<script setup lang="ts">
import DropDown from '~~/components/ui/drop-down.vue'
import Icon from '~~/components/ui/icon.vue'
import ResponsiveTable, {
  TableRow
} from '~~/components/table/responsive-table.vue'
import CheckBox from '~~/components/input/check-box.vue'
import TableCell from '~~/components/table/table-cell.vue'
import SlideModal from '~~/components/ui/slide-modal.vue'
import ToggleSelections from '~~/components/ui/toggle-selections.vue'
import PopUp from '~~/components/ui/pop-up.vue'
import VInput from '~~/components/input/v-input.vue'
import Btn from '~~/components/input/btn.vue'
import { ApiList, ApiShow } from '~~/composables/fetch'
import { Purchase } from '~~/composables/resources/gifting'
import { Auth } from '~~/composables/resources/auth'

// defines
definePageMeta({ layout: 'admin', middleware: ['auth'] })

// refs
const route = useRoute()
const router = useRouter()
const search = ref('')
const {
  data: purchases,
  refresh,
  pending
} = useApiFetch<ApiList<Purchase>>('purchases', () => ({
  params: {
    'relations[]': ['recipient'],
    search: search.value,
    page: route.query.page ?? 1,
    perPage: route.query.perPage ?? 10
  },
  group: 'purchases'
}))
const selected = ref<number[]>([])
const [modalTitle, modalOpen] = useRouteModal('purchases', ['/purchases/.'])
const auth = inject<Auth>('auth')
const redeemPopUp = reactive({
  open: false,
  title: 'Redeem Gift Card',
  description: 'Enter gift card code to redeem gift card'
})
const redeeming = ref('')
const voucherNumber = ref('')
const purchaseStatusMap: Record<Purchase['status'], string> = {
  cancelled: 'error',
  pending: 'warning',
  redeemed: 'success',
  settled: 'success',
  settlement_failed: 'error'
}

// methods
const { addToast } = useToast()
const doSearch = useDebounce(() => {
  refresh()
}, 200)
const closeVerifyVoucher = () => {
  redeemPopUp.open = false
  voucherNumber.value = ''
}
const verifyVoucher = async () => {
  redeeming.value = 'Verifying...'
  try {
    const response = await apiFetch<ApiShow<Purchase>>(
      `purchases/${voucherNumber.value}`
    )
    const purchase = response.data
    if (purchase.status !== 'pending') return handleInvalidVoucher()
    const redeemFlow = useRedeemFlow(voucherNumber.value)
    redeemFlow.value.purchase = purchase
    router.push(`/purchases/redeem/${voucherNumber.value}`)
    closeVerifyVoucher()
  } catch (error) {
    handleInvalidVoucher()
  } finally {
    redeeming.value = ''
  }
}
const handleInvalidVoucher = () => {
  addToast({
    type: 'error',
    message: 'Invalid gift card number',
    details: 'Please check gift card number and try again'
  })
}
const paginate = usePaginate(refresh)
</script>
