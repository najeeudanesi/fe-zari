<template>
  <form
    class="flex h-full flex-col space-y-4 px-5 sm:px-14"
    @submit.prevent="addItem"
  >
    <div v-if="redeemFlow.purchase" class="grid grid-cols-2 gap-4 text-sm">
      <div
        class="flex flex-col space-y-1 rounded-xl bg-primary-alt p-4 text-primary"
      >
        <span class="font-semibold">Gift card Amount</span>
        <span class="text-base">{{ toMoney(redeemFlow.purchase.money) }}</span>
      </div>
      <div
        :class="[
          'flex flex-col space-y-1 rounded-xl p-4',
          amountLeft.amount < 0
            ? 'bg-red-50 text-red-500'
            : 'bg-slate-100 text-gray-500'
        ]"
      >
        <span class="font-bold">Amount Left</span>
        <span class="text-base">{{ toMoney(amountLeft) }}</span>
      </div>
    </div>
    <div
      class="flex flex-col space-y-4"
      v-if="amountLeft.amount > 0 || item.price !== null"
    >
      <span class="text-xs text-gray-600">
        Fill in the name & price of each item the recipient picks.
      </span>
      <VInput id="gift" label="Gift Item" v-model="item.name" required />
      <VInput
        id="price"
        :label="
          item.price
            ? `Price (${toMoney({ amount: item.price, currency: 'NGN' })})`
            : 'Price'
        "
        v-model="item.price"
        required
        type="number"
      />
      <button
        class="flex items-center space-x-3 text-xs font-semibold text-gray-500"
      >
        <div
          class="btn-transition m-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-base font-bold text-white hover:-translate-y-[0.1rem] hover:scale-105"
        >
          +
        </div>
        Add Item
      </button>
    </div>
    <div
      v-if="redeemFlow.items.length > 0 && amountLeft.amount > 0"
      class="flex items-center space-x-4 rounded-lg bg-primary-alt p-4 text-xs text-gray-600"
    >
      <Icon name="info-circle" class="text-primary" />
      <span>
        Exccess amount of {{ toMoney(amountLeft) }} will be refunded to the
        Gifter
      </span>
    </div>
    <div class="w-full pt-4">
      <PurchaseItems
        v-if="redeemFlow.items.length > 0"
        v-bind="{
          items: redeemFlow.items.map(({ name, price }) => ({ name, price }))
        }"
      >
        <template #actions v-slot="{ i }">
          <button
            type="button"
            @click="redeemFlow.items.splice(i, 1)"
            class="Btn__icon ml-10"
          >
            <Icon name="trash" class="h-5 w-5" />
          </button>
        </template>
      </PurchaseItems>
    </div>
    <div class="Modal__footer">
      <Btn
        class="w-full"
        type="button"
        @click="redeemVoucher"
        :disabled="redeemFlow.items.length < 1 || amountLeft.amount < 0"
      >
        Redeem Gift Card
      </Btn>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ItemForm } from '~~/composables/resources/gifting'
import VInput from '~~/components/input/v-input.vue'
import Btn from '~~/components/input/btn.vue'
import Icon from '~~/components/ui/icon.vue'
import { Money } from '~~/composables/resources/finance'
import PurchaseItems from '~~/components/resources/purchases/purchase-items.vue'

// refs
const route = useRoute()
const router = useRouter()
const voucherNumber = computed(() => String(route.params.voucherNumber))
const initialItem = {
  name: '',
  price: null
}
const item = reactive<ItemForm>({ ...initialItem })
const redeemFlow = useRedeemFlow(voucherNumber.value)
const amountLeft = computed<Money>(() => {
  const amount = redeemFlow.value.items.reduce(
    (total, item) => (total -= item.price!),
    (redeemFlow.value.purchase?.amount ?? 0) - (item.price ?? 0)
  )
  return { amount, currency: redeemFlow.value.purchase?.currency ?? 'NGN' }
})
const redeemingVoucher = ref('')
const { addToast } = useToast()

// methods
const addItem = () => {
  redeemFlow.value.items = redeemFlow.value.items.concat({ ...item })
  Object.assign(item, { ...initialItem })
}
const redeemVoucher = async () => {
  const { purchase, items } = redeemFlow.value
  if (!purchase || redeemingVoucher.value) return
  try {
    redeemingVoucher.value = 'Redeeming gift card...'
    await apiFetch(`purchases/${purchase.id}`, {
      method: 'PUT',
      body: { status: 'redeemed', items }
    })
    addToast({ type: 'success', message: 'Gift card redeemed' })
    refreshGroups(['purchases'])
    router.push('/purchases')
  } catch (error) {
    addToast({
      type: 'error',
      message: 'Something went wrong',
      details: 'Please try again later'
    })
  } finally {
    redeemingVoucher.value = ''
  }
}

// logic
useState('purchases/modalTitle').value = 'Redeem Gift Card'

// watchers
watchEffect(() => {
  if (!redeemFlow.value.purchase) {
    navigateTo('/purchases')
  }
})
</script>
