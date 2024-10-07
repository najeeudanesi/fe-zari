<template>
  <Transition name="page">
    <div
      class="flex flex-col space-y-7 px-5 pb-5 text-sm sm:px-14"
      v-if="!pending && purchase"
    >
      <DetailDisplay title="Voucher Number">
        {{
          userRole() === 'admin' || purchase.status !== 'pending'
            ? purchase.voucherNumber
            : '****'
        }}
      </DetailDisplay>
      <DetailDisplay title="Gifteer">
        {{ purchase.creator?.name }}
      </DetailDisplay>
      <DetailDisplay title="Gifteee">
        {{ purchase.recipient?.name }}
      </DetailDisplay>
      <DetailDisplay title="Store">
        {{ purchase.voucher?.store?.name }}
      </DetailDisplay>
      <DetailDisplay title="Amount">
        {{ toMoney(purchase.money) }}
      </DetailDisplay>
      <DetailDisplay title="Date Gifted">
        {{ formatDate(purchase.createdAt, 'l') }}
      </DetailDisplay>

      <DetailDisplay title="Status">
        <div class="flex items-center space-x-3">
          <div
            :class="[
              'Status max-w-fit',
              `Status--${purchaseStatusMap[purchase.status]}`
            ]"
          >
            {{ purchase.status.replace('_', ' ') }}
          </div>
          <RetryPayment
            v-if="
              hasPermission('purchases.pay_store') &&
              retryPaymentStatuses.has(purchase.status)
            "
            v-bind="{ purchase }"
            @refresh="refresh"
          />
        </div>
      </DetailDisplay>

      <DetailDisplay
        v-if="purchase.items && purchase.items.length > 0"
        title="Items"
      >
        <PurchaseItems :items="purchase.items" />
      </DetailDisplay>

      <DetailDisplay
        v-if="purchase.refunds && purchase.refunds.length > 0"
        title="Refunds"
      >
        <table class="w-full">
          <thead>
            <th class="text-left text-xs text-gray-400">User</th>
            <th class="text-left text-xs text-gray-400">Date</th>
            <th class="text-right text-xs text-gray-400">Amount</th>
          </thead>
          <tr
            v-for="refund in purchase.refunds"
            class="rounded-xl border-b text-gray-600 last:border-none"
          >
            <td class="text-xs capitalize text-gray-600">
              <NuxtLink
                :to="`/users/view/${refund.user?.id}`"
                class="hover:text-primary"
              >
                {{ refund.user?.name }}
              </NuxtLink>
            </td>
            <td class="text-xs text-gray-600">
              {{ formatDate(refund.createdAt, 'dt') }}
            </td>
            <td class="py-4 text-right text-xs text-gray-600">
              {{ toMoney(refund) }}
            </td>
          </tr>
        </table>
      </DetailDisplay>

      <DetailDisplay
        v-if="purchase.logs && purchase.logs.length > 0"
        title="Logs"
      >
        <VLogs :logs="purchase.logs ?? []" class="m-3" />
      </DetailDisplay>
    </div>
    <DetailSkeleton v-else :rows="7" />
  </Transition>
</template>

<script setup lang="ts">
import { ApiShow } from '~~/composables/fetch'
import DetailDisplay from '~~/components/resources/detail-display.vue'
import DetailSkeleton from '~~/components/resources/detail-skeleton.vue'
import { Purchase } from '~~/composables/resources/gifting'
import RetryPayment from '~~/components/resources/purchases/retry-payment.vue'
import PurchaseItems from '~~/components/resources/purchases/purchase-items.vue'
import VLogs from '../v-logs.vue'

// refs
const route = useRoute()
const voucherNumber = route.params.voucherNumber
const { data, pending, refresh } = useApiFetch<ApiShow<Purchase>>(
  `purchases/${voucherNumber}`,
  () => ({
    params: {
      'relations[]': [
        'creator',
        'items',
        'logs',
        'recipient',
        'refunds',
        'voucher'
      ]
    },
    group: `purchases/${voucherNumber}`
  })
)
const purchase = computed(() => data.value?.data)
const retryPaymentStatuses = new Set<Purchase['status']>([
  'redeemed',
  'settlement_failed'
])

// wathcers
watchEffect(
  () =>
    (useState('transactions/modalTitle').value =
      purchase.value?.recipient?.name)
)
</script>
