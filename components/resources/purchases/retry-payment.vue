<template>
  <button
    class="Btn__icon text-sm"
    type="button"
    title="Retry"
    @click="retryPayment"
  >
    <Icon
      name="arrow-path"
      :class="['mr-3 h-5 w-5', retrying ? 'animate-spin' : '']"
    />
    {{ retrying ? retrying : 'Retry Payment' }}
  </button>
</template>

<script setup lang="ts">
import Icon from '~~/components/ui/icon.vue'
import { ApiShow } from '~~/composables/fetch'
import { Purchase } from '~~/composables/resources/gifting'

// defines
const props = defineProps<{ purchase: Purchase }>()
const emit = defineEmits(['refresh'])

const { addToast } = useToast()
const handleFailure = () => {
  addToast({
    type: 'error',
    message: 'Payment Error',
    details: 'There was an error settling this payment'
  })
}
const retrying = ref('')
const retryPayment = async () => {
  try {
    retrying.value = 'Retrying...'
    const { data: purchase } = await apiFetch<ApiShow<Purchase>>(
      `purchases/pay-store/${props.purchase.id}`,
      { method: 'POST' }
    )
    emit('refresh')
    if (purchase.status === 'settled') {
      addToast({
        type: 'error',
        message: 'Payment initiated',
        details: 'Vendor payment initiated'
      })
    } else {
      handleFailure()
    }
  } catch (error) {
    handleFailure()
  } finally {
    retrying.value = ''
  }
}
</script>
