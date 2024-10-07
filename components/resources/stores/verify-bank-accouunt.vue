<template>
  <div class="mt-1 text-xs">
    <span v-if="verifying">{{ verifying }} </span>
    <span v-else-if="bankDetails">{{ bankDetails.accountName }}</span>
    <span v-else-if="bank && accountNumber?.length === 10" class="text-red-500">
      Invalid bank account details
    </span>
  </div>
</template>

<script setup lang="ts">
import { ApiShow } from '~~/composables/fetch'
import { BankDetails } from '~~/composables/resources/finance'

// defines
const props = defineProps<{ bank?: string; accountNumber?: string }>()

// refs
const verifying = ref('')
const bankDetails = ref<BankDetails>()

// methods
const verifyBankAccouunt = async () => {
  const { bank, accountNumber } = props
  if (!bank || accountNumber?.length !== 10) {
    bankDetails.value = undefined
    return
  }
  verifying.value = 'Verifying...'
  try {
    const { data } = await apiFetch<ApiShow<BankDetails | undefined>>(
      `verify-bank-account`,
      {
        method: 'post',
        body: { ...props }
      }
    )
    bankDetails.value = data
  } catch (error) {
    bankDetails.value = undefined
  } finally {
    verifying.value = ''
  }
}

// watchers
watchEffect(() => {
  verifyBankAccouunt()
})
</script>
