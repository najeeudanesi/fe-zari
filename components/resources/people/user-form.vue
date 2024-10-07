<template>
  <form
    class="flex h-full flex-col space-y-4 px-5 sm:px-14"
    @submit.prevent="submit"
  >
    <VInput
      id="name"
      label="Name"
      required
      v-model="admin.name"
      placeholder="Enter full name"
    />
    <VInput
      id="email"
      label="Email"
      type="email"
      required
      :readonly="!!data"
      v-model="admin.email"
      placeholder="Enter Email Address"
    />
    <VInput
      id="phone"
      label="Phone"
      type="phone"
      v-model="admin.phone"
      placeholder="Enter phone number"
    />
    <VSelect
      v-if="role === 'vendor' && stores"
      v-model="admin.store"
      @search="storeSearch"
      id="storeId"
      label="Store"
      :displayValue="(v: Store) => v?.name"
      :searchValue="(v: Store) => v?.name"
      :options="stores.data"
      :loading="storesPending"
      required
      placeholder="Select Store"
    />
    <div class="Modal__footer">
      <button
        v-if="data"
        @click="emit('cancel')"
        type="button"
        class="Btn__alt w-40"
      >
        Cancel
      </button>
      <Btn class="w-full" :loading="submitting ? 'Submitting...' : ''">
        Save
      </Btn>
    </div>
  </form>
</template>

<script setup lang="ts">
import VInput from '~~/components/input/v-input.vue'
import Btn from '~~/components/input/btn.vue'
import { ApiList } from '~~/composables/fetch'
import { Store } from '~~/composables/resources/business'
import { RoleGroup } from '~~/composables/resources/people'
import VSelect from '~~/components/input/v-select.vue'

export type UserForm = {
  name: string
  email: string
  phone: string
  store?: Store
}
// defines
const props = defineProps<{
  data?: UserForm
  role?: RoleGroup
  submitting?: boolean
}>()
const emit = defineEmits(['cancel', 'submit'])

// refs
const defaultAdmin: UserForm = { name: '', email: '', phone: '' }
const admin = reactive(props.data || { ...defaultAdmin })
const search = ref('')
const {
  data: stores,
  refresh,
  pending: storesPending
} = useApiFetch<ApiList<Store>>('stores', () => ({
  params: { search: search.value }
}))

// methods
const submit = () => emit('submit', admin)
const storeSearch = (v: string) => {
  search.value = v
  refresh()
}
</script>
