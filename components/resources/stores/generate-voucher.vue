<template>
  <div class="contents">
    <button class="Btn w-64" type="button" @click="generatePopUp.open = true">
      Generate Gift Card
    </button>
    <PopUp v-bind="generatePopUp">
      <form
        @submit.prevent="generatePurchase"
        class="flex w-full flex-col space-y-4 px-4 text-left"
      >
        <div class="flex items-end space-x-4">
          <VSelect
            v-if="users"
            v-model="purchaseData.recipient"
            @search="searchUsers"
            id="recipientId"
                    label="Giftee"
                :displayValue="(v: User) => v?.name"
                :searchValue="(v: User) => v?.name"
                :options="users.data"
                :loading="usersPending"
                placeholder="Select User"
                class="w-full"
              />
              <button
                class="btn-transition mb-1.5 rounded-full bg-primary p-2 hover:-translate-y-[0.1rem] hover:scale-105"
                type="button"
                @click="newUser"
              >
                <Icon name="user-plus" class="h-5 text-white" />
              </button>
            </div>
            <VInput
              v-if="purchaseData.newRecipient && !purchaseData.recipient"
              v-model="purchaseData.name"
              id="name"
                label="Name of Giftee"
            required
          />
          <VInput
            v-if="purchaseData.newRecipient && !purchaseData.recipient"
            v-model="purchaseData.email"
            id="email"
              label="Email of Giftee"
          required
        />
        <VSelect
          v-if="store.vouchers"
          v-model="purchaseData.voucher"
          id="voucherAmount"
          label="Voucher Amount"
          :displayValue="(v: Voucher)=> v && toMoney(v)"
          :searchValue="(v: Voucher)=> v && toMoney(v)"
          :options="store.vouchers"
          required
          placeholder="Select Voucher Amount"
          class="w-full text-left"
        />
        <div class="flex justify-center space-x-3 pt-2">
          <Btn type="submit" class="Btn" :loading="generating"> Generate </Btn>
          <button
            type="button"
            class="Btn__alt w-32"
            @click="closePurchaseGenerate"
          >
            Cancel
          </button>
        </div>
      </form>
    </PopUp>
  </div>
</template>

<script setup lang="ts">
import Btn from '~~/components/input/btn.vue'
import VInput from '~~/components/input/v-input.vue'
import VSelect from '~~/components/input/v-select.vue'
import Icon from '~~/components/ui/icon.vue'
import PopUp from '~~/components/ui/pop-up.vue'
import { ApiList, ApiShow } from '~~/composables/fetch'
import { Auth } from '~~/composables/resources/auth'
import { Store, Voucher } from '~~/composables/resources/business'
import { Gift } from '~~/composables/resources/gifting'
import { User } from '~~/composables/resources/people'

// defines
defineProps<{ store: Store }>()
const emit = defineEmits(['done'])

// refs
const auth = inject<Auth>('auth')
const generatePopUp = reactive({
  open: false,
  title: 'Generate Gift Card',
  description: ''
})
const purchaseData = reactive<{
  newRecipient: boolean
  recipient: User | undefined
  name: string | undefined
  email: string | undefined
  voucher: Voucher | undefined
  gift: Gift | undefined
}>({
  newRecipient: false,
  recipient: undefined,
  name: undefined,
  email: undefined,
  voucher: undefined,
  gift: undefined
})
const generating = ref('')
const userSearch = ref('')
const {
  data: users,
  refresh: refreshUsers,
  pending: usersPending
} = useApiFetch<ApiList<User>>('users', () => ({
  params: { 'roles[]': ['user'], search: userSearch.value },
  group: 'users/generate-voucher'
}))

// methods
const searchUsers = (v: string) => {
  userSearch.value = v
  refreshUsers()
}
const newUser = () => {
  purchaseData.newRecipient = true
  purchaseData.recipient = undefined
}
const { addToast } = useToast()

const generatePurchase = async () => {
  generating.value = 'Generating gift cards'
  try {
    await apiFetch<ApiShow<Voucher>>('purchases', {
      method: 'post',
      body: {
        message: 'Happy birthday dear!',
        voucherType: 'gift_box',
        voucherId: purchaseData.voucher?.id,
        giftIds: [],
        address: {
          address: '9 Sam Adegbite Cl, Victoria Island 234000, Lagos, Nigeria',
          longitude: 3.4200692,
          latitude: 6.4262979
        },
        recipientId: purchaseData.recipient?.id,
        recipient: !purchaseData.recipient
          ? {
              name: purchaseData.name,
              email: purchaseData.email,
              username: purchaseData.email,
              roleGroup: 'user'
            }
          : undefined,
        relations: ['voucher']
      }
    })
    addToast({
      type: 'success',
      message: 'Gift card generated successfully'
    })
    closePurchaseGenerate()
    emit('done')
  } catch (error) {
    addToast({ type: 'error', message: 'There was an error on our end' })
  } finally {
    generating.value = ''
  }
}

const closePurchaseGenerate = () => {
  generatePopUp.open = false
  purchaseData.name = undefined
  purchaseData.email = undefined
  purchaseData.voucher = undefined
  purchaseData.gift = undefined
}
</script>
