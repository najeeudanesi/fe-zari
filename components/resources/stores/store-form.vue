<template>
  <form @submit.prevent="submit" class="relative flex h-full flex-col space-y-4 px-5 sm:px-14">
    <FileInput label="Store Cover Image" id="storeLogo" v-model="store.logo" v-slot="{ fileUrl }" :required="!store.logo.fileUrl || store.logo.fileUrl === PLACEHOLDER_IMAGE
    ">
      <div class="relative w-24">
        <div class="absolute bottom-0 right-0 rounded-full bg-gray-100 p-1.5">
          <Icon name="pencil" class="h-3.5 w-3.5" />
        </div>
        <img :src="fileUrl" alt="sample image" class="h-24 w-24 rounded-lg object-cover" />
      </div>
    </FileInput>
    <VInput id="storeName" label="Store Name" v-model="store.name" required placeholder="Zari Gifts Shop" />
    <VTextArea id="description" label="Description" v-model="store.description" required rows="3" />
    <VSelect v-model="store.categories" :displayValue="displayValue" :options="categories" :searchValue="displayValue"
      id="categoryId" label="Store Category" placeholder="Seach Store category" multiple
      :required="!store.categories.length">
      <div class="mt-2 flex flex-wrap items-center space-x-2 space-y-1">
        <Clearable v-for="(category, i) in store.categories" @clear="store.categories.splice(i, 1)">
          {{ displayValue(category) }}
        </Clearable>
      </div>
    </VSelect>
    <AddressInput id="address" label="Address" v-model="store.address" placeholder="12 glover road"
      :required="!store.address?.description" />
    <VInput id="accountNumber" label="Account Number" v-model="store.bankAccount.accountNumber" required minLength="10"
      maxLength="10" placeholder="1111-XXXXX-000">
      <VerifyBankAccouunt :bank="store.bankAccount.bank?.code" :accountNumber="store.bankAccount.accountNumber" />
    </VInput>
    <VSelect v-model="store.bankAccount.bank" :displayValue="displayValue" :options="banks" :searchValue="displayValue"
      id="bank" label="Bank Name" placeholder="Search Bank Name" :required="!store.bankAccount.bank?.code" />
    <VInput id="vouchers" :label="`Vouchers ${voucher
      ? `(${toMoney({ amount: Number(voucher), currency: 'NGN' })})`
      : ''
    }`" v-model="voucher" type="number" placeholder="Enter gift card amount" :required="!store.vouchers.length">
      <template #append>
        <button type="button"
          class="btn-transition m-2 h-7 w-7 rounded-full bg-primary font-bold text-white hover:-translate-y-[0.1rem] hover:scale-105"
          @click="addVoucher">
          +
        </button>
      </template>

      <div class="mt-2 flex flex-wrap items-center space-x-2 space-y-1">
        <Clearable
          v-for="(v, i) in store.vouchers"
          @clear="store.vouchers.splice(i, 1)"
        >
          {{ toMoney(v) }}
        </Clearable>
      </div>
    </VInput>
    <VInput
      id="commisionPercentage"
      label="Commission Per Transaction"
      tooltip="Commision per transaction"
      v-model="store.commisionPercentage"
      required
      type="number"
      placeholder="10%"
    />
    <FileInput
      label="Add Some Product Images"
      :title="`Please select at least ${MIN_IMAGES} images`"
      @update:modelValue="(fileData) => store.productImages.unshift(fileData)"
      :required="(store.productImages.length || 0) < MIN_IMAGES"
    >
      <div
        class="flex h-14 w-14 items-center justify-center rounded-lg border-2 p-3"
      >
        <Icon name="plus" class="text-gray-400" />
      </div>
    </FileInput>
    <div class="flex flex-wrap">
      <div class="relative mb-2 mr-2" v-for="({ fileUrl }, i) in store.productImages">
        <img :src="fileUrl" alt="sample image" class="h-16 w-16 rounded-lg object-cover" />
        <button class="absolute -right-2 -top-2 rounded-full bg-gray-100 p-1" type="button"
          @click="store.productImages.splice(i, 1)">
          <Icon name="x" class="h-3 w-3" />
        </button>
      </div>
    </div>
    <div class="Modal__footer">
      <button v-if="data" @click="emit('cancel')" type="button" class="Btn__alt w-40">
        Cancel
      </button>
      <Btn class="w-full" :loading="submitting ? 'Submitting...' : ''">
        Save
      </Btn>
    </div>
  </form>
</template>

<script setup lang="ts">
import Icon from '~~/components/ui/icon.vue'
import VInput from '~~/components/input/v-input.vue'
import FileInput from '~~/components/input/file-input.vue'
import VSelect from '~~/components/input/v-select.vue'
import Clearable from '~~/components/ui/clearable.vue'
import Btn from '~~/components/input/btn.vue'
import AddressInput from '~~/components/input/address-input.vue'
import { ApiList } from '~~/composables/fetch'
import { PaystackBank } from '~/composables/resources/finance'
import { StoreCategory, StoreForm } from '~/composables/resources/business'
import VTextArea from '~~/components/input/v-text-area.vue'
import VerifyBankAccouunt from './verify-bank-accouunt.vue'

// defines
const props = defineProps<{
  data?: StoreForm
  submitting?: boolean
}>()
const emit = defineEmits(['cancel', 'submit'])

// refs
const store = reactive(props.data || { ...defaultStore })
const voucher = ref('')
const MIN_IMAGES = 3

// methods
const displayValue = (v) => v?.name
const addVoucher = () => {
  if (!voucher.value) return
  store.vouchers?.push({ amount: Number(voucher.value), currency: 'NGN' })
  voucher.value = ''
}
const submit = () => emit('submit', store)

// logic
const banks = await apiFetch<ApiList<PaystackBank>>('banks').then(
  ({ data }) => data
)
const categories = await apiFetch<ApiList<StoreCategory>>(
  'store-categories'
).then(({ data }) => data)
</script>