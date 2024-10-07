<template>
  <Transition name="page">
    <div
      class="flex flex-col space-y-7 px-5 pb-5 text-sm sm:px-14"
      v-if="!pending && store"
    >
      <DetailDisplay title="Logo" v-if="store.logo">
        <div class="rounded">
          <img
            :src="store.logo.url"
            :alt="store.logo.file.name"
            class="h-24 rounded object-cover shadow-lg"
          />
        </div>
      </DetailDisplay>
      <DetailDisplay title="Product Images" v-if="store.productImages?.length">
        <div class="grid grid-cols-3 gap-2">
          <img
            v-for="image in store.productImages"
            :src="image.url"
            :alt="image.file.name"
            class="h-24 rounded object-cover shadow-lg"
          />
        </div>
      </DetailDisplay>
      <DetailDisplay title="Description">
        {{ store.description }}
      </DetailDisplay>
      <DetailDisplay title="Address">
        {{ store.address?.address }}
      </DetailDisplay>
      <DetailDisplay title="Store Categories">
        {{ store.categories?.map((c) => c.name).join(', ') }}
      </DetailDisplay>
      <DetailDisplay title="Bank Account Details">
        <span>
          {{ store.bankAccount?.accountNumber }}
        </span>
        <span>
          {{ store.bankAccount?.bank.name }}
        </span>
        <span v-if="store.bankAccount?.name">
          {{ store.bankAccount?.name }}
        </span>
        <div
          v-if="store.bankAccount?.status !== 'verified'"
          class="flex items-center text-red-500"
        >
          <Icon name="x-circle-fill" class="mr-1" /> Unverified
        </div>
        <VerifyBankAccouunt
          v-if="store.bankAccount"
          :bankAccount="store.bankAccount"
          @refresh="refresh"
        />
      </DetailDisplay>
      <DetailDisplay title="Vouchers">
        {{ store.vouchers?.map((v) => toMoney(v)).join(', ') }}
      </DetailDisplay>
      <DetailDisplay title="Commision Percentage">
        {{ store.commisionPercentage }}%
      </DetailDisplay>
      <DetailDisplay title="">
        <GenerateVoucher v-bind="{ store }" @done="refreshPurchases" />
      </DetailDisplay>
    </div>
    <DetailSkeleton v-else :rows="7" />
  </Transition>
</template>

<script setup lang="ts">
import { ApiList, ApiShow } from '~~/composables/fetch'
import { Store } from '~~/composables/resources/business'
import DetailDisplay from '~~/components/resources/detail-display.vue'
import DetailSkeleton from '~~/components/resources/detail-skeleton.vue'
import { Purchase } from '~~/composables/resources/gifting'
import GenerateVoucher from '~~/components/resources/stores/generate-voucher.vue'
import VerifyBankAccouunt from '~~/components/resources/stores/verify-bank-accouunt.vue'
import Icon from '~~/components/ui/icon.vue'

// refs
const route = useRoute()
const storeId = route.params.storeId
const { data, pending, refresh } = useApiFetch<ApiShow<Store>>(
  `stores/${storeId}`,
  () => ({
    params: {
      'relations[]': [
        'categories',
        'bankAccount',
        'address',
        'vouchers',
        'logo',
        'productImages'
      ]
    },
    group: `stores/${storeId}`
  })
)
const search = ref('')
const { data: purchases, refresh: refreshPurchases } = useApiFetch<
  ApiList<Purchase>
>('purchases', () => ({
  params: {
    page: 1,
    perPage: 200,
    'relations[]': ['recipient'],
    search: search.value,
    'statuses[]': ['pending'],
    'storeIds[]': [storeId]
  },
  group: `purchases/${storeId}`
}))
const store = computed(() => data.value?.data)

// wathcers
watchEffect(() => (useState('stores/modalTitle').value = store.value?.name))
</script>
