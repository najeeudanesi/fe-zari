<template>
  <div class="contents">
    <Suspense>
      <StoreForm @submit="handleSubmit" v-bind="{ submitting }" />
      <template #fallback> <Fallback /> </template>
    </Suspense>
    <div class="hidden" ref="mapRef"></div>
  </div>
</template>

<script setup lang="ts">
import StoreForm from '~/components/resources/stores/store-form.vue'
import Fallback from '~/components/ui/fallback.vue'
import { ApiShow } from '~~/composables/fetch'
import {
  StoreRequest,
  StoreForm as StoreFormT,
  Store
} from '~~/composables/resources/business'

// refs
const submitting = ref(false)
const router = useRouter()
const { getPlace, mapRef } = useGoogleMap()
const { addToast } = useToast()

//methods
const handleSubmit = async (store: StoreFormT) => {
  if (submitting.value) return

  const { categories, address, productImages, logo, bankAccount, ...form } =
    store
  const place = await getPlace({
    placeId: address.place_id || '',
    fields: ['formatted_address', 'geometry.location']
  })
  submitting.value = true
  const body: StoreRequest = {
    ...form,
    categoryIds: categories.map((c) => c.id),
    address: {
      address: place.formatted_address ?? '',
      longitude: place.geometry?.location?.lng(),
      latitude: place.geometry?.location?.lat()
    },
    bankAccount: {
      accountNumber: bankAccount.accountNumber,
      bank: bankAccount.bank?.code ?? ''
    }
  }
  try {
    const { data: store } = await apiFetch<ApiShow<Store>>('stores', {
      method: 'post',
      body
    })
    const imageUploads = [
      apiFetch('media', {
        method: 'post',
        body: toFormData({
          file: logo.file,
          key: 'logo',
          entity: 'stores',
          refId: store.id
        })
      })
    ]
    productImages.forEach((image) => {
      imageUploads.push(
        apiFetch('media', {
          method: 'post',
          body: toFormData({
            file: image.file,
            key: 'product_image',
            entity: 'stores',
            refId: store.id
          })
        })
      )
    })
    await Promise.all(imageUploads)
    refreshGroups(['stores'])
    router.push('/stores')
    addToast({ type: 'success', message: `Store added successfully` })
  } catch (error) {
    addToast({ type: 'error', message: `Could not save store` })
  } finally {
    submitting.value = false
  }
}

// logic
useState('stores/modalTitle').value = 'Add Store'
</script>
